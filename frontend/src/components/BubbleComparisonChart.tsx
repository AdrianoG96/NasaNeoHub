"use client"

import { useMemo, useState } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"
import { useMobile } from "@/lib/useMobile"

interface BubbleComparisonChartProps {
  asteroids: AsteroidSummary[]
}

interface BubbleDataPoint {
  name: string
  miss_distance_km: number
  estimated_diameter_max_km: number
  relative_velocity_kph: number
  isHazardous: boolean
  bubbleSize: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as BubbleDataPoint

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.name}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Distance: {data.miss_distance_km.toLocaleString("en-US")} km</p>
        <p>Diameter: {data.estimated_diameter_max_km.toFixed(3)} km</p>
        <p>Velocity: {data.relative_velocity_kph.toLocaleString("en-US")} km/h</p>
        <p>
          Hazardous:{" "}
          <span className={data.isHazardous ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
            {data.isHazardous ? "Yes" : "No"}
          </span>
        </p>
      </div>
    </div>
  )
}

export function BubbleComparisonChart({ asteroids }: BubbleComparisonChartProps) {
  const isMobile = useMobile()
  const [logScale, setLogScale] = useState(false)

  const chartData = useMemo(() => {
    const maxDiameter = Math.max(...asteroids.map((a) => a.estimated_diameter_max_km), 0.001)
    return asteroids.map((a) => ({
      name: a.name,
      miss_distance_km: a.miss_distance_km,
      estimated_diameter_max_km: a.estimated_diameter_max_km,
      relative_velocity_kph: a.relative_velocity_kph,
      isHazardous: a.is_potentially_hazardous_asteroid,
      bubbleSize: Math.max((a.estimated_diameter_max_km / maxDiameter) * 100, 5),
    }))
  }, [asteroids])

  const hazardousData = useMemo(() => chartData.filter((d) => d.isHazardous), [chartData])
  const nonHazardousData = useMemo(() => chartData.filter((d) => !d.isHazardous), [chartData])

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
          onClick={() => setLogScale((prev) => !prev)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
            logScale
              ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
          aria-label="Toggle log scale for X axis"
        >
          {logScale ? "Linear" : "Log"} Scale (X)
        </button>
      </div>
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <ScatterChart margin={isMobile ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="miss_distance_km"
            name="Distance (km)"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            scale={logScale ? "log" : "linear"}
            domain={logScale ? ["auto", "auto"] : [0, "auto"]}
            tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toLocaleString("en-US")}
            {...(isMobile ? {} : { label: { value: "Miss Distance (km)", position: "insideBottom", offset: -10, style: { fontSize: 12 } } })}
          />
          <YAxis
            dataKey="estimated_diameter_max_km"
            name="Diameter (km)"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickFormatter={(v: number) => v.toFixed(2)}
            {...(isMobile ? {} : { label: { value: "Max Diameter (km)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } } })}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className={isMobile ? "text-[10px]" : "text-sm"}>{value === "Hazardous" ? "Potentially Hazardous" : "Non-Hazardous"}</span>
            )}
          />
          <Scatter
            name="Non-Hazardous"
            data={nonHazardousData}
            fill="hsl(221, 83%, 53%)"
            fillOpacity={0.6}
            stroke="none"
            shape={(props: any) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.bubbleSize / 8}
                  fill="hsl(221, 83%, 53%)"
                  fillOpacity={0.6}
                  stroke="none"
                />
              )
            }}
          />
          <Scatter
            name="Hazardous"
            data={hazardousData}
            fill="hsl(0, 84%, 60%)"
            fillOpacity={0.8}
            stroke="none"
            shape={(props: any) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.bubbleSize / 8}
                  fill="hsl(0, 84%, 60%)"
                  fillOpacity={0.8}
                  stroke="hsl(0, 84%, 50%)"
                  strokeWidth={1}
                />
              )
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
