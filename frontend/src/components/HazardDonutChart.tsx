"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { AsteroidSummary } from "@/lib/types"
import { useMobile } from "@/lib/useMobile"

interface HazardDonutChartProps {
  asteroids: AsteroidSummary[]
}

interface DonutData {
  name: string
  value: number
  percentage: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: DonutData }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as DonutData

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.name}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Count: {data.value}</p>
        <p>Percentage: {data.percentage.toFixed(1)}%</p>
      </div>
    </div>
  )
}

export function HazardDonutChart({ asteroids }: HazardDonutChartProps) {
  const isMobile = useMobile()

  const chartData = useMemo(() => {
    const total = asteroids.length
    const hazardous = asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length
    const nonHazardous = total - hazardous

    const data: DonutData[] = [
      {
        name: "Non-Hazardous",
        value: nonHazardous,
        percentage: total > 0 ? (nonHazardous / total) * 100 : 0,
        color: "hsl(221, 83%, 53%)",
      },
      {
        name: "Potentially Hazardous",
        value: hazardous,
        percentage: total > 0 ? (hazardous / total) * 100 : 0,
        color: "hsl(0, 84%, 60%)",
      },
    ]

    return data
  }, [asteroids])

  if (asteroids.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 60 : 80}
            outerRadius={isMobile ? 100 : 140}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className={isMobile ? "text-[10px]" : "text-sm"}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label showing total */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className={isMobile ? "text-xl font-bold text-white" : "text-2xl font-bold text-white"}>{asteroids.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  )
}
