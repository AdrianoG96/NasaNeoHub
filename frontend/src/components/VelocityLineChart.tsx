"use client"

import { useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"

interface VelocityLineChartProps {
  asteroids: AsteroidSummary[]
}

interface VelocityDataPoint {
  date: string
  dateTimestamp: number
  relative_velocity_kph: number
  name: string
  isHazardous: boolean
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as VelocityDataPoint

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.name}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Date: {data.date}</p>
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

function computeRollingAverage(data: VelocityDataPoint[], windowSize: number): (number | null)[] {
  return data.map((_, idx) => {
    if (idx < windowSize - 1) return null
    let sum = 0
    for (let i = idx - windowSize + 1; i <= idx; i++) {
      sum += data[i].relative_velocity_kph
    }
    return sum / windowSize
  })
}

export function VelocityLineChart({ asteroids }: VelocityLineChartProps) {
  const [showMovingAverage, setShowMovingAverage] = useState(false)

  const chartData = useMemo(() => {
    const sorted = [...asteroids].sort(
      (a, b) => new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime()
    )
    return sorted.map((a) => ({
      date: a.close_approach_date,
      dateTimestamp: new Date(a.close_approach_date).getTime(),
      relative_velocity_kph: a.relative_velocity_kph,
      name: a.name,
      isHazardous: a.is_potentially_hazardous_asteroid,
    }))
  }, [asteroids])

  const dataWithMA = useMemo(() => {
    if (!showMovingAverage) return chartData
    const ma = computeRollingAverage(chartData, 3)
    return chartData.map((d, idx) => ({
      ...d,
      movingAverage: ma[idx],
    }))
  }, [chartData, showMovingAverage])

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
          onClick={() => setShowMovingAverage((prev) => !prev)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
            showMovingAverage
              ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
          aria-label="Toggle moving average overlay"
        >
          {showMovingAverage ? "Hide" : "Show"} Moving Average (3)
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataWithMA} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="dateTimestamp"
            name="Date"
            tickFormatter={(ts: number) => {
              const d = new Date(ts)
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 12 }}
            label={{ value: "Close Approach Date", position: "insideBottom", offset: -10, style: { fontSize: 12 } }}
          />
          <YAxis
            dataKey="relative_velocity_kph"
            name="Velocity (km/h)"
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toLocaleString("en-US")}
            label={{ value: "Relative Velocity (km/h)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-sm">{value === "Velocity" ? "Relative Velocity" : value}</span>
            )}
          />
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="relative_velocity_kph"
            name="Velocity"
            stroke="hsl(187, 85%, 53%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(187, 85%, 53%)", strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "hsl(187, 85%, 53%)", strokeWidth: 2, fill: "hsl(220, 15%, 12%)" }}
          />
          <Area
            type="monotone"
            dataKey="relative_velocity_kph"
            fill="url(#velocityGradient)"
            stroke="none"
          />
          {showMovingAverage && (
            <Line
              type="monotone"
              dataKey="movingAverage"
              name="Moving Average (3)"
              stroke="hsl(40, 90%, 60%)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
