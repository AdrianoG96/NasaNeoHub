"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, RotateCw, Orbit, Eye, EyeOff, AlertTriangle } from "lucide-react"

export interface SceneControlState {
  showOrbits: boolean
  showLabels: boolean
  autoRotate: boolean
  hazardousOnly: boolean
  animationSpeed: number
}

interface SceneControlsProps {
  controls: SceneControlState
  onChange: (controls: SceneControlState) => void
  onResetCamera: () => void
  asteroidCount: number
  hazardousCount: number
}

/**
 * Overlay control panel for the 3D scene.
 * Allows toggling orbits, labels, auto-rotate, and filtering.
 */
export function SceneControls({
  controls,
  onChange,
  onResetCamera,
  asteroidCount,
  hazardousCount,
}: SceneControlsProps) {
  const toggle = (key: keyof SceneControlState) => {
    if (key === "animationSpeed") return
    onChange({ ...controls, [key]: !controls[key as keyof Omit<SceneControlState, "animationSpeed">] })
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Top-right controls */}
      <div className="pointer-events-auto absolute right-3 top-3 flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCamera}
          className="border-white/10 bg-slate-900/80 text-white/70 hover:bg-slate-800 hover:text-white"
          title="Reset camera view"
        >
          <RotateCcw className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("autoRotate")}
          className={`border-white/10 bg-slate-900/80 hover:bg-slate-800 ${
            controls.autoRotate ? "text-blue-400" : "text-white/70 hover:text-white"
          }`}
          title="Toggle auto-rotation"
        >
          <RotateCw className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("showOrbits")}
          className={`border-white/10 bg-slate-900/80 hover:bg-slate-800 ${
            controls.showOrbits ? "text-white/70 hover:text-white" : "text-white/30"
          }`}
          title="Toggle orbit lines"
        >
          {controls.showOrbits ? <Orbit className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("showLabels")}
          className={`border-white/10 bg-slate-900/80 hover:bg-slate-800 ${
            controls.showLabels ? "text-white/70 hover:text-white" : "text-white/30"
          }`}
          title="Toggle labels"
        >
          {controls.showLabels ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle("hazardousOnly")}
          className={`border-white/10 bg-slate-900/80 hover:bg-slate-800 ${
            controls.hazardousOnly ? "text-red-400" : "text-white/70 hover:text-white"
          }`}
          title="Show only hazardous asteroids"
        >
          <AlertTriangle className="size-3.5" />
        </Button>
      </div>

      {/* Bottom-left info badges */}
      <div className="pointer-events-auto absolute bottom-3 left-3 flex flex-wrap gap-2">
        <div className="rounded-md bg-slate-900/80 px-2.5 py-1 text-xs text-white/60 backdrop-blur-sm">
          {asteroidCount} asteroids
        </div>
        {hazardousCount > 0 && (
          <div className="rounded-md bg-red-900/60 px-2.5 py-1 text-xs text-red-300 backdrop-blur-sm">
            {hazardousCount} hazardous
          </div>
        )}
        <div className="rounded-md bg-slate-900/80 px-2.5 py-1 text-xs text-white/40 backdrop-blur-sm">
          1 unit ≈ 0.25 AU
        </div>
      </div>

      {/* Bottom-right legend */}
      <div className="pointer-events-auto absolute bottom-3 right-3 flex flex-col gap-1.5 rounded-md bg-slate-900/80 px-3 py-2 text-xs backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-white/60">
          <span className="inline-block size-2.5 rounded-full bg-red-500" />
          Hazardous
        </span>
        <span className="flex items-center gap-1.5 text-white/60">
          <span className="inline-block size-2.5 rounded-full bg-blue-400" />
          Non-Hazardous
        </span>
        <span className="flex items-center gap-1.5 text-white/60">
          <span className="inline-block size-2.5 rounded-full bg-amber-400" />
          Sun
        </span>
        <span className="flex items-center gap-1.5 text-white/60">
          <span className="inline-block size-2.5 rounded-full bg-blue-600" />
          Earth
        </span>
      </div>

      {/* Bottom-center interaction hint */}
      <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="rounded-full bg-slate-900/60 px-3 py-1 text-[10px] text-white/30 backdrop-blur-sm">
          Drag to rotate · Scroll to zoom · Click asteroid for details
        </div>
      </div>
    </div>
  )
}
