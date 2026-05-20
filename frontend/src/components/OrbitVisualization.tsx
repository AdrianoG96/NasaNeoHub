"use client"

import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Sphere, Line, Html } from "@react-three/drei"
import * as THREE from "three"
import type { AsteroidSummary } from "@/lib/types"

interface OrbitVisualizationProps {
  asteroids: AsteroidSummary[]
  onAsteroidClick: (id: string) => void
}

interface AsteroidPointProps {
  asteroid: AsteroidSummary
  position: [number, number, number]
  onClick: (id: string) => void
}

function AsteroidPoint({ asteroid, position, onClick }: AsteroidPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  const color = asteroid.is_potentially_hazardous_asteroid ? "#ef4444" : "#6b7280"
  const size = Math.max(0.05, Math.min(asteroid.estimated_diameter_max_km * 2, 0.3))

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + asteroid.id.charCodeAt(0)) * 0.05
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick(asteroid.id)
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <sphereGeometry args={[isHovered ? size * 1.5 : size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered ? 0.5 : 0.1}
      />
      {isHovered && (
        <Html distanceFactor={10}>
          <div className="rounded-md bg-background/90 px-2 py-1 text-xs shadow-md backdrop-blur-sm">
            <p className="font-semibold">{asteroid.name}</p>
            <p className="text-muted-foreground">
              {Math.round(asteroid.miss_distance_km).toLocaleString("en-US")} km
            </p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={1}
      />
      <pointLight intensity={2} distance={20} decay={1} />
    </mesh>
  )
}

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
    <mesh ref={earthRef} position={[4, 0, 0]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#1d4ed8"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function EarthOrbitLine() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([Math.cos(angle) * 4, 0, Math.sin(angle) * 4])
    }
    return pts
  }, [])

  return (
    <Line
      points={points}
      color="#3b82f6"
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  )
}

function Scene({ asteroids, onAsteroidClick }: OrbitVisualizationProps) {
  const asteroidPositions = useMemo(() => {
    return asteroids.map((a) => {
      const distance = Math.min(a.miss_distance_km / 100000, 8)
      const angle = (a.id.charCodeAt(0) * 137.5) % 360
      const elevation = (a.id.charCodeAt(1) || 42) % 180 - 90

      const rad = (angle * Math.PI) / 180
      const elevRad = (elevation * Math.PI) / 180

      return {
        asteroid: a,
        position: [
          Math.cos(rad) * distance * Math.cos(elevRad),
          Math.sin(elevRad) * distance * 0.3,
          Math.sin(rad) * distance * Math.cos(elevRad),
        ] as [number, number, number],
      }
    })
  }, [asteroids])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Sun />
      <Earth />
      <EarthOrbitLine />
      {asteroidPositions.map(({ asteroid, position }) => (
        <AsteroidPoint
          key={asteroid.id}
          asteroid={asteroid}
          position={position}
          onClick={onAsteroidClick}
        />
      ))}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
      />
    </>
  )
}

export function OrbitVisualization({ asteroids, onAsteroidClick }: OrbitVisualizationProps) {
  if (asteroids.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border text-muted-foreground">
        No asteroid data available for 3D visualization
      </div>
    )
  }

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <Scene asteroids={asteroids} onAsteroidClick={onAsteroidClick} />
      </Canvas>
      <div className="absolute bottom-3 left-3 flex gap-4 rounded-md bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-full bg-red-500" />
          Hazardous
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-full bg-gray-400" />
          Non-Hazardous
        </span>
      </div>
    </div>
  )
}
