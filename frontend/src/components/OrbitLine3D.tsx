"use client"

import { useMemo } from "react"
import { Line } from "@react-three/drei"
import type { OrbitalParams } from "@/lib/orbitalMath"
import { generateOrbitPoints, scaleOrbitPoints } from "@/lib/orbitalMath"

interface OrbitLine3DProps {
  orbitalParams: OrbitalParams
  color?: string
  opacity?: number
  visible?: boolean
}

/**
 * Renders an elliptical orbit line in 3D space based on real orbital elements.
 * Uses Keplerian mechanics to generate the full orbital path.
 */
export function OrbitLine3D({
  orbitalParams,
  color = "#3b82f6",
  opacity = 0.3,
  visible = true,
}: OrbitLine3DProps) {
  const points = useMemo(() => {
    const rawPoints = generateOrbitPoints(orbitalParams, 128)
    return scaleOrbitPoints(rawPoints)
  }, [orbitalParams])

  if (!visible) return null

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={opacity}
      dashed={false}
    />
  )
}

/**
 * Earth's orbital path as a dashed, animated line.
 */
export function EarthOrbitLine({ visible = true }: { visible?: boolean }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([Math.cos(angle) * 4, 0, Math.sin(angle) * 4])
    }
    return pts
  }, [])

  if (!visible) return null

  return (
    <Line
      points={points}
      color="#3b82f6"
      lineWidth={0.5}
      transparent
      opacity={0.2}
      dashed
      dashSize={0.2}
      gapSize={0.15}
    />
  )
}
