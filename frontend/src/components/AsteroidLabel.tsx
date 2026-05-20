"use client"

import { Html } from "@react-three/drei"

interface AsteroidLabelProps {
  name: string
  position: [number, number, number]
  isHazardous: boolean
  visible?: boolean
}

/**
 * Renders a text label for an asteroid in 3D space.
 * Shows the asteroid name with a subtle background.
 */
export function AsteroidLabel({
  name,
  position,
  isHazardous,
  visible = true,
}: AsteroidLabelProps) {
  if (!visible) return null

  // Only show labels for larger/named asteroids (filter out generic IDs)
  const isNamed = !name.startsWith("(") && name.length < 20

  if (!isNamed) return null

  return (
    <Html
      position={[position[0], position[1] - 0.4, position[2]]}
      distanceFactor={8}
      center
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${
          isHazardous
            ? "bg-red-900/40 text-red-300"
            : "bg-slate-800/40 text-slate-300"
        }`}
      >
        {name.replace(/[()]/g, "")}
      </div>
    </Html>
  )
}
