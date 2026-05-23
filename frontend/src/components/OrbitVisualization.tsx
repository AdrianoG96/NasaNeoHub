"use client"

import { useMemo, useRef, useState, useCallback, useEffect } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls as DreiOrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import type { AsteroidSummary, AsteroidDetail } from "@/lib/types"
import { StarField } from "@/components/StarField"
import { EarthOrbitLine, OrbitLine3D } from "@/components/OrbitLine3D"
import { AsteroidLabel } from "@/components/AsteroidLabel"
import { SceneControls, type SceneControlState } from "@/components/SceneControls"
import { AsteroidDetail3D } from "@/components/AsteroidDetail3D"
import { fetchAsteroidDetail } from "@/lib/api"
import {
  calculateOrbitalPosition,
  fallbackPosition,
  asteroidSceneSize,
  hashSeed,
  scalePosition,
  type OrbitalParams,
} from "@/lib/orbitalMath"

// ─── Types ───────────────────────────────────────────────────────────

interface OrbitVisualizationProps {
  asteroids: AsteroidSummary[]
  onAsteroidClick: (id: string) => void
}

interface AsteroidData {
  asteroid: AsteroidSummary
  position: [number, number, number]
  orbitalParams: OrbitalParams | null
  seed: number
  size: number
}

// ─── Constants ───────────────────────────────────────────────────────

const DEFAULT_CONTROLS: SceneControlState = {
  showOrbits: true,
  showLabels: true,
  autoRotate: false,
  hazardousOnly: false,
  nearOnly: false,
  animationSpeed: 1,
}

const MAX_ASTEROIDS = 200
const NEAR_THRESHOLD_AU = 0.05 // ~7.5M km

// ─── Helpers ─────────────────────────────────────────────────────────

function parseOrbitalParams(a: AsteroidSummary): OrbitalParams | null {
  if (!a.eccentricity || !a.semi_major_axis || !a.inclination) return null
  const e = parseFloat(a.eccentricity)
  const sma = parseFloat(a.semi_major_axis)
  if (isNaN(e) || isNaN(sma) || sma <= 0) return null
  return {
    eccentricity: e,
    semiMajorAxis: sma,
    inclination: parseFloat(a.inclination) || 0,
    ascendingNode: parseFloat(a.ascending_node_longitude ?? "0") || 0,
    perihelionArg: parseFloat(a.perihelion_argument ?? "0") || 0,
    meanAnomaly: parseFloat(a.mean_anomaly ?? "0") || 0,
  }
}

// ─── Sun ─────────────────────────────────────────────────────────────

function Sun() {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.03)
    }
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <pointLight intensity={3} distance={30} decay={0.5} />
    </group>
  )
}

// ─── Earth ───────────────────────────────────────────────────────────

function Earth({ animationSpeed = 1 }: { animationSpeed?: number }) {
  const earthRef = useRef<THREE.Mesh>(null)
  const textureLoader = useMemo(() => new THREE.TextureLoader(), [])

  // Load Earth texture from a reliable CDN
  const [earthMap, setEarthMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    textureLoader.load(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      (texture) => setEarthMap(texture),
      undefined,
      () => {
        // Fallback: try another source
        textureLoader.load(
          "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
          (texture) => setEarthMap(texture),
        )
      }
    )
  }, [textureLoader])

  useFrame((state) => {
    if (earthRef.current) {
      const angle = state.clock.elapsedTime * 0.1 * animationSpeed
      earthRef.current.position.x = Math.cos(angle) * 4
      earthRef.current.position.z = Math.sin(angle) * 4
      earthRef.current.rotation.y += 0.01 * animationSpeed
    }
  })

  return (
    <group>
      <mesh ref={earthRef} position={[4, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          map={earthMap}
          color={earthMap ? "#ffffff" : "#3b82f6"}
          emissive={earthMap ? "#000000" : "#1d4ed8"}
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Nebula Background ───────────────────────────────────────────────

function NebulaBackground() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.0005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.0003) * 0.02
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(45, 32, 32)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    // Seeded pseudo-random for deterministic starfield colors
    let seed = 42
    const pseudoRandom = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + y * y + z * z) / 45
      // Cosmic gradient: deep purple-blue with hints of magenta
      colors[i * 3] = 0.05 + pseudoRandom() * 0.08 + dist * 0.1
      colors[i * 3 + 1] = 0.01 + pseudoRandom() * 0.04 + dist * 0.05
      colors[i * 3 + 2] = 0.08 + pseudoRandom() * 0.1 + dist * 0.15
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial vertexColors transparent opacity={0.3} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  )
}

// ─── Instanced Asteroids ─────────────────────────────────────────────

interface InstancedAsteroidsProps {
  asteroidData: AsteroidData[]
  selectedIds: Set<string>
  onAsteroidClick: (id: string) => void
  showLabel: boolean
  animationSpeed: number
}

function InstancedAsteroids({
  asteroidData,
  selectedIds,
  onAsteroidClick,
  showLabel,
  animationSpeed,
}: InstancedAsteroidsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = asteroidData.length

  // Colors per instance
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const isHazardous = asteroidData[i].asteroid.is_potentially_hazardous_asteroid
      const isSelected = selectedIds.has(asteroidData[i].asteroid.id)
      if (isSelected) {
        cols[i * 3] = 1
        cols[i * 3 + 1] = 0.8
        cols[i * 3 + 2] = 0.2
      } else if (isHazardous) {
        cols[i * 3] = 0.94
        cols[i * 3 + 1] = 0.27
        cols[i * 3 + 2] = 0.2
      } else {
        cols[i * 3] = 0.2
        cols[i * 3 + 1] = 0.8
        cols[i * 3 + 2] = 0.5
      }
    }
    return cols
  }, [asteroidData, selectedIds, count])

  // Apply instance colors on mount
  useEffect(() => {
    if (!meshRef.current) return
    const colorAttr = new THREE.InstancedBufferAttribute(colors, 3)
    meshRef.current.instanceColor = colorAttr
  }, [colors])

  // Update instance matrices
  useFrame((state) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      const data = asteroidData[i]
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.5 * animationSpeed + data.seed) * 0.03
      dummy.position.set(data.position[0], data.position[1] + floatOffset, data.position[2])
      dummy.scale.setScalar(data.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      if (!meshRef.current) return
      const instanceId = e.instanceId
      if (instanceId !== undefined && instanceId < asteroidData.length) {
        onAsteroidClick(asteroidData[instanceId].asteroid.id)
      }
    },
    [asteroidData, onAsteroidClick]
  )

  // Hover state
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.instanceId !== undefined) setHoveredId(e.instanceId)
  }, [])

  const handlePointerOut = useCallback(() => setHoveredId(null), [])

  const hoveredAsteroid = hoveredId !== null ? asteroidData[hoveredId] : null

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial roughness={0.6} metalness={0.3} />
      </instancedMesh>

      {/* Hover tooltip */}
      {hoveredAsteroid && (
        <Html
          position={[
            hoveredAsteroid.position[0],
            hoveredAsteroid.position[1] + hoveredAsteroid.size + 0.3,
            hoveredAsteroid.position[2],
          ]}
          distanceFactor={6}
          center
        >
          <div className="min-w-[140px] rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
            <p className="font-semibold text-white">{hoveredAsteroid.asteroid.name}</p>
            <div className="mt-1 space-y-0.5 text-white/60">
              <p>
                Ø {hoveredAsteroid.asteroid.estimated_diameter_min_km.toFixed(2)}–{hoveredAsteroid.asteroid.estimated_diameter_max_km.toFixed(2)} km
              </p>
              <p>{Math.round(hoveredAsteroid.asteroid.miss_distance_km).toLocaleString("en-US")} km</p>
              <p>{Math.round(hoveredAsteroid.asteroid.relative_velocity_kph).toLocaleString("en-US")} km/h</p>
            </div>
            {hoveredAsteroid.asteroid.is_potentially_hazardous_asteroid && (
              <p className="mt-1 text-[10px] font-medium text-red-400">⚠ Potentially Hazardous</p>
            )}
          </div>
        </Html>
      )}

      {/* Labels */}
      {asteroidData.map((data) => (
        <AsteroidLabel
          key={data.asteroid.id}
          name={data.asteroid.name}
          position={data.position}
          isHazardous={data.asteroid.is_potentially_hazardous_asteroid}
          visible={showLabel && hoveredId !== asteroidData.indexOf(data)}
        />
      ))}
    </group>
  )
}

// ─── Individual Asteroid Point (for <50 count) ──────────────────────

interface AsteroidPointProps {
  asteroid: AsteroidSummary
  position: [number, number, number]
  size: number
  isSelected: boolean
  onClick: (id: string) => void
  showLabel: boolean
  animationSpeed: number
  seed: number
}

function AsteroidPoint({
  asteroid,
  position,
  size,
  isSelected,
  onClick,
  showLabel,
  animationSpeed,
  seed,
}: AsteroidPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  const color = isSelected
    ? "#facc15"
    : asteroid.is_potentially_hazardous_asteroid
      ? "#ef4444"
      : "#34d399"
  const emissiveColor = isSelected
    ? "#facc15"
    : asteroid.is_potentially_hazardous_asteroid
      ? "#ef4444"
      : "#10b981"

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 * animationSpeed + seed) * 0.03
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick(asteroid.id)
  }

  const displaySize = isHovered ? size * 1.8 : size

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[displaySize, isHovered ? 20 : 12, isHovered ? 20 : 12]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={isHovered ? 0.6 : 0.15}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {isHovered && (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[displaySize * 1.5, displaySize * 2, 24]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {isHovered && (
        <Html
          position={[position[0], position[1] + displaySize + 0.3, position[2]]}
          distanceFactor={6}
          center
        >
          <div className="min-w-[140px] rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
            <p className="font-semibold text-white">{asteroid.name}</p>
            <div className="mt-1 space-y-0.5 text-white/60">
              <p>
                Ø {asteroid.estimated_diameter_min_km.toFixed(2)}–{asteroid.estimated_diameter_max_km.toFixed(2)} km
              </p>
              <p>{Math.round(asteroid.miss_distance_km).toLocaleString("en-US")} km</p>
              <p>{Math.round(asteroid.relative_velocity_kph).toLocaleString("en-US")} km/h</p>
            </div>
            {asteroid.is_potentially_hazardous_asteroid && (
              <p className="mt-1 text-[10px] font-medium text-red-400">⚠ Potentially Hazardous</p>
            )}
          </div>
        </Html>
      )}

      <AsteroidLabel
        name={asteroid.name}
        position={position}
        isHazardous={asteroid.is_potentially_hazardous_asteroid}
        visible={showLabel && !isHovered}
      />
    </group>
  )
}

// ─── Minimap ─────────────────────────────────────────────────────────

function Minimap({ asteroidData }: { asteroidData: AsteroidData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2
    const scale = 8 // pixels per scene unit

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      ctx.fillStyle = "rgba(15, 23, 42, 0.7)"
      ctx.beginPath()
      ctx.roundRect(0, 0, w, h, 6)
      ctx.fill()

      // Sun
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#fbbf24"
      ctx.fill()

      // Earth orbit ring
      ctx.beginPath()
      ctx.arc(cx, cy, 4 * scale, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 2])
      ctx.stroke()
      ctx.setLineDash([])

      // Earth (orbiting)
      const earthAngle = Date.now() * 0.0001
      const earthX = cx + Math.cos(earthAngle) * 4 * scale
      const earthY = cy + Math.sin(earthAngle) * 4 * scale
      ctx.beginPath()
      ctx.arc(earthX, earthY, 2, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Asteroids
      for (const data of asteroidData) {
        const x = cx + data.position[0] * scale
        const y = cy + data.position[2] * scale
        if (x < 0 || x > w || y < 0 || y > h) continue
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = data.asteroid.is_potentially_hazardous_asteroid
          ? "rgba(239, 68, 68, 0.6)"
          : "rgba(52, 211, 153, 0.6)"
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animRef.current)
  }, [asteroidData])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="pointer-events-none absolute left-3 top-16 z-20 rounded-lg border border-white/10 shadow-lg"
      aria-hidden="true"
    />
  )
}

// ─── Scene ───────────────────────────────────────────────────────────

interface SceneProps {
  asteroids: AsteroidSummary[]
  onAsteroidClick: (id: string) => void
  controls: SceneControlState
  orbitControlsRef: React.RefObject<{ reset: () => void } | null>
}

function Scene({ asteroids, onAsteroidClick, controls, orbitControlsRef }: SceneProps) {
  const [selectedDetail, setSelectedDetail] = useState<AsteroidDetail | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const asteroidData = useMemo(() => {
    const data: AsteroidData[] = []
    for (const a of asteroids) {
      if (data.length >= MAX_ASTEROIDS) break
      const seed = hashSeed(a.id)
      const size = asteroidSceneSize(a.estimated_diameter_max_km)

      // Try real orbital data first
      const orbitalParams = parseOrbitalParams(a)
      let position: [number, number, number]
      if (orbitalParams) {
        const pos = calculateOrbitalPosition(orbitalParams)
        const scaled = scalePosition(pos)
        position = [scaled.x, scaled.y, scaled.z]
      } else {
        // Fallback to miss_distance based position
        const pos = fallbackPosition(a.miss_distance_km, seed)
        position = [pos.x, pos.y, pos.z]
      }

      data.push({
        asteroid: a,
        position,
        orbitalParams,
        seed,
        size,
      })
    }
    return data
  }, [asteroids])

  const visibleAsteroids = useMemo(() => {
    let filtered = asteroidData
    if (controls.hazardousOnly) {
      filtered = filtered.filter((d) => d.asteroid.is_potentially_hazardous_asteroid)
    }
    if (controls.nearOnly) {
      filtered = filtered.filter((d) => {
        const dist = Math.sqrt(
          d.position[0] ** 2 + d.position[1] ** 2 + d.position[2] ** 2
        )
        return dist < NEAR_THRESHOLD_AU * 4 // Convert AU to scene units
      })
    }
    return filtered
  }, [asteroidData, controls.hazardousOnly, controls.nearOnly])

  const handleAsteroidClick = useCallback(
    async (id: string) => {
      // Toggle selection with Ctrl/Cmd
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })

      setSelectedDetail(null)
      try {
        const detail = await fetchAsteroidDetail(id)
        setSelectedDetail(detail)
      } catch {
        // Silently fail
      }
      onAsteroidClick(id)
    },
    [onAsteroidClick]
  )

  const useInstancing = visibleAsteroids.length > 50

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <hemisphereLight args={["#1a1a2e", "#0f0f23", 0.3]} />
      <color attach="background" args={["#0a0a1a"]} />
      <NebulaBackground />
      <StarField count={2000} depth={100} />
      <Sun />
      <Earth animationSpeed={controls.animationSpeed} />
      <EarthOrbitLine visible={controls.showOrbits} />

      {/* Orbit lines for asteroids with real orbital data */}
      {controls.showOrbits &&
        visibleAsteroids.map((data) => {
          if (!data.orbitalParams) return null
          return (
            <OrbitLine3D
              key={`orbit-${data.asteroid.id}`}
              orbitalParams={data.orbitalParams}
              color={data.asteroid.is_potentially_hazardous_asteroid ? "#ef4444" : "#34d399"}
              opacity={selectedIds.has(data.asteroid.id) ? 0.6 : 0.2}
              visible
            />
          )
        })}

      {/* Render asteroids */}
      {useInstancing ? (
        <InstancedAsteroids
          asteroidData={visibleAsteroids}
          selectedIds={selectedIds}
          onAsteroidClick={handleAsteroidClick}
          showLabel={controls.showLabels}
          animationSpeed={controls.animationSpeed}
        />
      ) : (
        visibleAsteroids.map((data) => (
          <AsteroidPoint
            key={data.asteroid.id}
            asteroid={data.asteroid}
            position={data.position}
            size={data.size}
            isSelected={selectedIds.has(data.asteroid.id)}
            onClick={handleAsteroidClick}
            showLabel={controls.showLabels}
            animationSpeed={controls.animationSpeed}
            seed={data.seed}
          />
        ))
      )}

      {/* Selected detail panel */}
      {selectedDetail && (
        <Html position={[0, -3, 0]} distanceFactor={10} center>
          <div className="w-72 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{selectedDetail.name}</h3>
              <button
                onClick={() => {
                  setSelectedDetail(null)
                }}
                className="text-xs text-white/40 hover:text-white/80"
              >
                ✕
              </button>
            </div>
            <div className="mb-3 h-24 w-full">
              <Canvas camera={{ position: [0, 0, 3], fov: 30 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} intensity={0.8} />
                <AsteroidDetail3D detail={selectedDetail} />
              </Canvas>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-white/40">Diameter</span>
                <p className="font-medium text-white/80">
                  {selectedDetail.estimated_diameter_min_km.toFixed(2)}–{selectedDetail.estimated_diameter_max_km.toFixed(2)} km
                </p>
              </div>
              <div>
                <span className="text-white/40">Velocity</span>
                <p className="font-medium text-white/80">
                  {Math.round(selectedDetail.close_approach_data[0]?.relative_velocity_kph ?? 0).toLocaleString()} km/h
                </p>
              </div>
              <div>
                <span className="text-white/40">Miss Distance</span>
                <p className="font-medium text-white/80">
                  {Math.round(selectedDetail.close_approach_data[0]?.miss_distance_km ?? 0).toLocaleString()} km
                </p>
              </div>
              <div>
                <span className="text-white/40">Hazardous</span>
                <p
                  className={
                    selectedDetail.is_potentially_hazardous_asteroid
                      ? "font-medium text-red-400"
                      : "font-medium text-green-400"
                  }
                >
                  {selectedDetail.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </Html>
      )}

      <DreiOrbitControls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={orbitControlsRef as React.Ref<any>}
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={30}
        autoRotate={controls.autoRotate}
        autoRotateSpeed={0.5 * controls.animationSpeed}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────

export function OrbitVisualization({ asteroids, onAsteroidClick }: OrbitVisualizationProps) {
  const [controls, setControls] = useState<SceneControlState>(DEFAULT_CONTROLS)
  const orbitControlsRef = useRef<{ reset: () => void } | null>(null)

  const asteroidData = useMemo(() => {
    const data: AsteroidData[] = []
    for (const a of asteroids) {
      if (data.length >= MAX_ASTEROIDS) break
      const seed = hashSeed(a.id)
      const size = asteroidSceneSize(a.estimated_diameter_max_km)
      const orbitalParams = parseOrbitalParams(a)
      let position: [number, number, number]
      if (orbitalParams) {
        const pos = calculateOrbitalPosition(orbitalParams)
        const scaled = scalePosition(pos)
        position = [scaled.x, scaled.y, scaled.z]
      } else {
        const pos = fallbackPosition(a.miss_distance_km, seed)
        position = [pos.x, pos.y, pos.z]
      }
      data.push({ asteroid: a, position, orbitalParams, seed, size })
    }
    return data
  }, [asteroids])

  const handleResetCamera = useCallback(() => {
    orbitControlsRef.current?.reset()
  }, [])

  if (asteroids.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-white/10 text-white/40">
        <div className="text-center">
          <p className="text-sm">No asteroid data available for 3D visualization</p>
          <p className="mt-1 text-xs text-white/20">Search for asteroids to explore their orbits</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-white/10">
      <Canvas camera={{ position: [0, 6, 12], fov: 50 }}>
        <Scene
          asteroids={asteroids}
          onAsteroidClick={onAsteroidClick}
          controls={controls}
          orbitControlsRef={orbitControlsRef}
        />
      </Canvas>

      <SceneControls
        controls={controls}
        onChange={setControls}
        onResetCamera={handleResetCamera}
        asteroidCount={asteroids.length}
        hazardousCount={asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length}
      />

      <Minimap asteroidData={asteroidData} />
    </div>
  )
}
