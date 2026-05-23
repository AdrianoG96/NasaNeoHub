"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface StarFieldProps {
  count?: number
  depth?: number
}

/**
 * Renders a 3D star field background with subtle twinkling animation.
 * Stars are distributed in a sphere around the scene for depth perception.
 */
export function StarField({ count = 2000, depth = 100 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [geometry] = useState(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = depth * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      // Star color: mostly white with some blue/yellow tints
      const colorType = Math.random()
      if (colorType < 0.6) {
        // White
        col[i * 3] = 0.9 + Math.random() * 0.1
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1
        col[i * 3 + 2] = 0.9 + Math.random() * 0.1
      } else if (colorType < 0.8) {
        // Blue tint
        col[i * 3] = 0.6 + Math.random() * 0.2
        col[i * 3 + 1] = 0.7 + Math.random() * 0.2
        col[i * 3 + 2] = 1.0
      } else {
        // Yellow/Orange tint
        col[i * 3] = 1.0
        col[i * 3 + 1] = 0.7 + Math.random() * 0.3
        col[i * 3 + 2] = 0.4 + Math.random() * 0.2
      }

      siz[i] = 0.5 + Math.random() * 1.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
    geo.setAttribute("size", new THREE.BufferAttribute(siz, 1))
    return geo
  })

  useFrame((state) => {
    if (pointsRef.current) {
      // Subtle rotation for parallax effect
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.002
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.01
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
