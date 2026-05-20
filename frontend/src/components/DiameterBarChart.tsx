"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"

interface DiameterBarChartProps {
  asteroids: AsteroidSummary[]
}

interface BinData {
  binLabel: string
  binMin: number
  binMax: number
  count: number
  percentage: number
}

const BINS = [
  { label: "0 – 0.1 km", min: 0, max: 0.1 },
  { label: "0.1 – 0.5 km", min: 0.1, max: 0.5 },
  { label: "0.5 – 1 km", min: 0.5, max: 1 },
  { label: "1 – 5 km", min: 1, max: 5 },
  { label: "5+ km", min: 5, max: Infinity },
]

const BAR_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(221, 83%, 60%)",
  "hsl(221, 83%, 67%)",
  "hsl(221, 83%, 74%)",
  "hsl(221, 83%, 81%)",
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as BinData

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">Diameter Range: {data.binLabel}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Count: {data.count}</p>
        <p>Percentage: {data.percentage.toFixed(1)}%</p>
      </div>
    </div>
  )
}

export function DiameterBarChart({ asteroids }: DiameterBarChartProps) {
  const chartData = useMemo(() => {
    const total = asteroids.length

    return BINS.map((bin) => {
      const count = asteroids.filter((a) => {
        const diameter = a.estimated_diameter_max_km
        return diameter >= bin.min && diameter < bin.max
      }).length

      return {
        binLabel: bin.label,
        binMin: bin.min,
        binMax: bin.max,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
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
          label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={() => (
            <span className="text-sm">Asteroid Count</span>
          )}
        />
        <Bar dataKey="count" name="Asteroid Count" radius={[4, 4, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
