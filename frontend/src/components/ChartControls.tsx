"use client"

import { useCallback } from "react"
import { RotateCcw } from "lucide-react"

export type ChartType =
  | "velocity-line"
  | "bubble-comparison"
  | "hazard-donut"
  | "stacked-diameter"
  | "daily-discovery"
  | "activity-heatmap"

export interface ChartSettings {
  chartType: ChartType
  logScale: boolean
  showMovingAverage: boolean
  showPercentage: boolean
}

interface ChartControlsProps {
  settings: ChartSettings
  onSettingsChange: (settings: ChartSettings) => void
  isLoading: boolean
}

const CHART_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "velocity-line", label: "Velocity Over Time" },
  { value: "bubble-comparison", label: "Diameter vs Distance" },
  { value: "hazard-donut", label: "Hazard Distribution" },
  { value: "stacked-diameter", label: "Stacked Diameter" },
  { value: "daily-discovery", label: "Daily Discoveries" },
  { value: "activity-heatmap", label: "Activity Heatmap" },
]

const DEFAULT_SETTINGS: ChartSettings = {
  chartType: "velocity-line",
  logScale: false,
  showMovingAverage: false,
  showPercentage: false,
}

export function ChartControls({ settings, onSettingsChange, isLoading }: ChartControlsProps) {
  const handleReset = useCallback(() => {
    onSettingsChange(DEFAULT_SETTINGS)
  }, [onSettingsChange])

  const update = useCallback(
    (partial: Partial<ChartSettings>) => {
      onSettingsChange({ ...settings, ...partial })
    },
    [settings, onSettingsChange]
  )

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
      {/* Chart type selector */}
      <select
        value={settings.chartType}
        onChange={(e) => update({ chartType: e.target.value as ChartType })}
        disabled={isLoading}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
        aria-label="Select chart type"
      >
        {CHART_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white/70">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Log scale toggle */}
      <button
        onClick={() => update({ logScale: !settings.logScale })}
        disabled={isLoading}
        className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
          settings.logScale
            ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
        }`}
        aria-label="Toggle log scale"
      >
        Log Scale
      </button>

      {/* Moving average toggle */}
      <button
        onClick={() => update({ showMovingAverage: !settings.showMovingAverage })}
        disabled={isLoading}
        className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
          settings.showMovingAverage
            ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
        }`}
        aria-label="Toggle moving average"
      >
        Moving Avg
      </button>

      {/* Percentage toggle */}
      <button
        onClick={() => update({ showPercentage: !settings.showPercentage })}
        disabled={isLoading}
        className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
          settings.showPercentage
            ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
        }`}
        aria-label="Toggle percentage view"
      >
        %
      </button>

      {/* Reset button */}
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="ml-auto flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white/70 disabled:opacity-50"
        aria-label="Reset chart settings to defaults"
      >
        <RotateCcw className="size-3" />
        Reset
      </button>
    </div>
  )
}
