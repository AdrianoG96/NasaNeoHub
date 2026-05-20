"use client"

import { useMemo, useRef, useState, useCallback } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import type { AsteroidSummary, AsteroidDetail } from "@/lib/types"
import { StarField } from "@/components/StarField"
import { EarthOrbitLine } from "@/components/OrbitLine3D"
import { AsteroidLabel } from "@/components/AsteroidLabel"
import { SceneControls, type SceneControlState } from "@/components/SceneControls"
import { AsteroidDetail3D } from "@/components/AsteroidDetail3D"
import { fetchAsteroidDetail } from "@/lib/api"
import {
  fallbackPosition,
  asteroidSceneSize,
  hashSeed,
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
  animationSpeed: 1,
}

const MAX_ASTEROIDS = 200

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

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (earthRef.current) {
      const angle = state.clock.elapsedTime * 0.1
      earthRef.current.position.x = Math.cos(angle) * 4
      earthRef.current.position.z = Math.sin(angle) * 4
      earthRef.current.rotation.y += 0.01
    }
  })

  return (
    <group>
      <mesh ref={earthRef} position={[4, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
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

// ─── Asteroid Point ──────────────────────────────────────────────────

interface AsteroidPointProps {
  asteroid: AsteroidSummary
  position: [number, number, number]
  size: number
  onClick: (id: string) => void
  showLabel: boolean
}

function AsteroidPoint({ asteroid, position, size, onClick, showLabel }: AsteroidPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  const color = asteroid.is_potentially_hazardous_asteroid ? "#ef4444" : "#60a5fa"
  const emissiveColor = asteroid.is_potentially_hazardous_asteroid ? "#ef4444" : "#3b82f6"

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + asteroid.id.charCodeAt(0)) * 0.03
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

// ─── Scene ───────────────────────────────────────────────────────────

interface SceneProps {
  asteroids: AsteroidSummary[]
  onAsteroidClick: (id: string) => void
  controls: SceneControlState
}

function Scene({ asteroids, onAsteroidClick, controls }: SceneProps) {
  const [selectedDetail, setSelectedDetail] = useState<AsteroidDetail | null>(null)
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string | null>(null)

  const asteroidData = useMemo(() => {
    const data: AsteroidData[] = []
    for (const a of asteroids) {
      if (data.length >= MAX_ASTEROIDS) break
      const seed = hashSeed(a.id)
      const size = asteroidSceneSize(a.estimated_diameter_max_km)
      const pos = fallbackPosition(a.miss_distance_km, seed)
      data.push({
        asteroid: a,
        position: [pos.x, pos.y, pos.z],
        orbitalParams: null,
        seed,
        size,
      })
    }
    return data
  }, [asteroids])

  const visibleAsteroids = useMemo(() => {
    if (!controls.hazardousOnly) return asteroidData
    return asteroidData.filter((d) => d.asteroid.is_potentially_hazardous_asteroid)
  }, [asteroidData, controls.hazardousOnly])

  const handleAsteroidClick = useCallback(
    async (id: string) => {
      setSelectedAsteroidId(id)
      setSelectedDetail(null)
      try {
        const detail = await fetchAsteroidDetail(id)
        setSelectedDetail(detail)
      } catch {
        // Silently fail - the parent dialog will handle the error
      }
      onAsteroidClick(id)
    },
    [onAsteroidClick]
  )

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <hemisphereLight args={["#1a1a2e", "#0f0f23", 0.3]} />
      <color attach="background" args={["#0a0a1a"]} />
      <StarField count={2000} depth={100} />
      <Sun />
      <Earth />
      <EarthOrbitLine visible={controls.showOrbits} />

      {visibleAsteroids.map((data) => (
        <AsteroidPoint
          key={data.asteroid.id}
          asteroid={data.asteroid}
          position={data.position}
          size={data.size}
          onClick={handleAsteroidClick}
          showLabel={controls.showLabels}
        />
      ))}

      {selectedDetail && selectedAsteroidId && (
        <Html position={[0, -3, 0]} distanceFactor={10} center>
          <div className="w-72 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{selectedDetail.name}</h3>
              <button
                onClick={() => {
                  setSelectedDetail(null)
                  setSelectedAsteroidId(null)
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

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={30}
        autoRotate={controls.autoRotate}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────

export function OrbitVisualization({ asteroids, onAsteroidClick }: OrbitVisualizationProps) {
  const [controls, setControls] = useState<SceneControlState>(DEFAULT_CONTROLS)

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
        <Scene asteroids={asteroids} onAsteroidClick={onAsteroidClick} controls={controls} />
      </Canvas>

      <SceneControls
        controls={controls}
        onChange={setControls}
        onResetCamera={() => {}}
        asteroidCount={asteroids.length}
        hazardousCount={asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length}
      />
    </div>
  )
}
