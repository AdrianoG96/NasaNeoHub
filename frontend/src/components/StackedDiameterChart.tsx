"use client"

import { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"

interface StackedDiameterChartProps {
  asteroids: AsteroidSummary[]
}

interface StackedBinData {
  binLabel: string
  binMin: number
  binMax: number
  hazardous: number
  nonHazardous: number
  total: number
  hazardousPct: number
  nonHazardousPct: number
}

const BINS = [
  { label: "0 – 0.1 km", min: 0, max: 0.1 },
  { label: "0.1 – 0.5 km", min: 0.1, max: 0.5 },
  { label: "0.5 – 1 km", min: 0.5, max: 1 },
  { label: "1 – 5 km", min: 1, max: 5 },
  { label: "5+ km", min: 5, max: Infinity },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as StackedBinData

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">Diameter Range: {data.binLabel}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Total: {data.total}</p>
        <p className="text-red-400">Hazardous: {data.hazardous}</p>
        <p className="text-blue-400">Non-Hazardous: {data.nonHazardous}</p>
      </div>
    </div>
  )
}

export function StackedDiameterChart({ asteroids }: StackedDiameterChartProps) {
  const [showPercentage, setShowPercentage] = useState(false)

  const chartData = useMemo(() => {
    return BINS.map((bin) => {
      const binAsteroids = asteroids.filter((a) => {
        const diameter = a.estimated_diameter_max_km
        return diameter >= bin.min && diameter < bin.max
      })
      const hazardous = binAsteroids.filter((a) => a.is_potentially_hazardous_asteroid).length
      const nonHazardous = binAsteroids.length - hazardous

      return {
        binLabel: bin.label,
        binMin: bin.min,
        binMax: bin.max,
        hazardous,
        nonHazardous,
        total: binAsteroids.length,
        hazardousPct: binAsteroids.length > 0 ? (hazardous / binAsteroids.length) * 100 : 0,
        nonHazardousPct: binAsteroids.length > 0 ? (nonHazardous / binAsteroids.length) * 100 : 0,
      }
    })
  }, [asteroids])

  if (asteroids.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPercentage((prev) => !prev)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
            showPercentage
              ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
          aria-label="Toggle between absolute count and percentage"
        >
          {showPercentage ? "Count" : "Percentage"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="binLabel"
            tick={{ fontSize: 12 }}
            label={{ value: "Diameter Range", position: "insideBottom", offset: -10, style: { fontSize: 12 } }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: showPercentage ? "Percentage (%)" : "Count",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-sm">{value === "hazardous" ? "Potentially Hazardous" : "Non-Hazardous"}</span>
            )}
          />
          <Bar
            dataKey={showPercentage ? "hazardousPct" : "hazardous"}
            name="hazardous"
            stackId="stack"
            fill="hsl(0, 84%, 60%)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey={showPercentage ? "nonHazardousPct" : "nonHazardous"}
            name="nonHazardous"
            stackId="stack"
            fill="hsl(221, 83%, 53%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
