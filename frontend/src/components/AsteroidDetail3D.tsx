"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { AsteroidDetail } from "@/lib/types"

interface AsteroidDetail3DProps {
  detail: AsteroidDetail
}

/**
 * 3D visualization of a single asteroid with irregular shape,
 * procedural texture, and multi-axis rotation.
 */
export function AsteroidDetail3D({ detail }: AsteroidDetail3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const avgDiameter = (detail.estimated_diameter_min_km + detail.estimated_diameter_max_km) / 2
  const size = Math.max(0.3, Math.min(avgDiameter * 3, 2))

  // Generate irregular geometry by displacing icosahedron vertices
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(size, 2)
    const positions = geo.attributes.position

    // Seeded pseudo-random based on vertex index for deterministic noise
    const seededRandom = (seed: number) => {
      const s = seed * 9301 + 49297
      return ((s % 233280) / 233280)
    }

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      const length = Math.sqrt(x * x + y * y + z * z)
      const noise = 0.7 + seededRandom(i) * 0.6
      const newLength = length * noise

      positions.setXYZ(i, (x / length) * newLength, (y / length) * newLength, (z / length) * newLength)
    }

    positions.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [size])

  // Procedural color based on asteroid characteristics
  const color = useMemo(() => {
    if (detail.is_potentially_hazardous_asteroid) {
      return new THREE.Color(0.9, 0.2, 0.15) // Reddish for hazardous
    }
    // Gray-brown based on size
    const gray = 0.4 + avgDiameter * 0.1
    return new THREE.Color(gray, gray * 0.85, gray * 0.7)
  }, [detail.is_potentially_hazardous_asteroid, avgDiameter])

  // Multi-axis rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.z += delta * 0.15
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
        flatShading
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}
