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
  Line,
  Legend,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"

interface DailyDiscoveryChartProps {
  asteroids: AsteroidSummary[]
}

interface DailyData {
  date: string
  dateTimestamp: number
  total: number
  hazardous: number
  nonHazardous: number
  hazardousPct: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as DailyData

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.date}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Total: {data.total}</p>
        <p className="text-red-400">Hazardous: {data.hazardous}</p>
        <p className="text-blue-400">Non-Hazardous: {data.nonHazardous}</p>
      </div>
    </div>
  )
}

function computeRollingAverage(values: number[], windowSize: number): (number | null)[] {
  return values.map((_, idx) => {
    if (idx < windowSize - 1) return null
    let sum = 0
    for (let i = idx - windowSize + 1; i <= idx; i++) {
      sum += values[i]
    }
    return sum / windowSize
  })
}

export function DailyDiscoveryChart({ asteroids }: DailyDiscoveryChartProps) {
  const [showTrend, setShowTrend] = useState(false)

  const chartData = useMemo(() => {
    const grouped = new Map<string, { total: number; hazardous: number }>()

    for (const asteroid of asteroids) {
      const date = asteroid.close_approach_date
      const existing = grouped.get(date)
      if (existing) {
        existing.total++
        if (asteroid.is_potentially_hazardous_asteroid) existing.hazardous++
      } else {
        grouped.set(date, {
          total: 1,
          hazardous: asteroid.is_potentially_hazardous_asteroid ? 1 : 0,
        })
      }
    }

    const sorted = Array.from(grouped.entries()).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    )

    return sorted.map(([date, data]) => ({
      date,
      dateTimestamp: new Date(date).getTime(),
      total: data.total,
      hazardous: data.hazardous,
      nonHazardous: data.total - data.hazardous,
      hazardousPct: data.total > 0 ? (data.hazardous / data.total) * 100 : 0,
    }))
  }, [asteroids])

  const dataWithTrend = useMemo(() => {
    if (!showTrend) return chartData
    const ma = computeRollingAverage(
      chartData.map((d) => d.total),
      3
    )
    return chartData.map((d, idx) => ({
      ...d,
      trendLine: ma[idx],
    }))
  }, [chartData, showTrend])

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
          onClick={() => setShowTrend((prev) => !prev)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
            showTrend
              ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
          aria-label="Toggle trend line"
        >
          {showTrend ? "Hide" : "Show"} Trend (3-day MA)
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dataWithTrend} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            label={{ value: "Date", position: "insideBottom", offset: -10, style: { fontSize: 12 } }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-sm">
                {value === "nonHazardous" ? "Non-Hazardous" : value === "hazardous" ? "Hazardous" : value === "trendLine" ? "Trend (3-day MA)" : value}
              </span>
            )}
          />
          <Bar
            dataKey="nonHazardous"
            name="nonHazardous"
            stackId="stack"
            fill="hsl(221, 83%, 53%)"
            radius={[0, 0, 0, 0]}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="hazardous"
            name="hazardous"
            stackId="stack"
            fill="hsl(0, 84%, 60%)"
            radius={[4, 4, 0, 0]}
            animationBegin={100}
            animationDuration={800}
            animationEasing="ease-out"
          />
          {showTrend && (
            <Line
              type="monotone"
              dataKey="trendLine"
              name="trendLine"
              stroke="hsl(40, 90%, 60%)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
