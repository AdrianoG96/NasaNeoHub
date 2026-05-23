"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"
import { useMobile } from "@/lib/useMobile"

interface DistanceScatterChartProps {
  asteroids: AsteroidSummary[]
}

interface ScatterDataPoint {
  date: string
  dateTimestamp: number
  miss_distance_km: number
  name: string
  isHazardous: boolean
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as ScatterDataPoint

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.name}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>Date: {data.date}</p>
        <p>Distance: {data.miss_distance_km.toLocaleString("en-US")} km</p>
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

export function DistanceScatterChart({ asteroids }: DistanceScatterChartProps) {
  const isMobile = useMobile()

  const chartData = useMemo(() => {
    return asteroids.map((a) => ({
      date: a.close_approach_date,
      dateTimestamp: new Date(a.close_approach_date).getTime(),
      miss_distance_km: a.miss_distance_km,
      name: a.name,
      isHazardous: a.is_potentially_hazardous_asteroid,
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
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <ScatterChart margin={isMobile ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 20, right: 20, bottom: 20, left: 20 }}>
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
          tick={{ fontSize: isMobile ? 10 : 12 }}
          {...(isMobile ? {} : { label: { value: "Close Approach Date", position: "insideBottom", offset: -10, style: { fontSize: 12 } } })}
        />
        <YAxis
          dataKey="miss_distance_km"
          name="Distance (km)"
          tick={{ fontSize: isMobile ? 10 : 12 }}
          tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toLocaleString("en-US")}
          {...(isMobile ? {} : { label: { value: "Miss Distance (km)", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12 } } })}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => (
            <span className={isMobile ? "text-[10px]" : "text-sm"}>{value === "Hazardous" ? "Potentially Hazardous" : "Non-Hazardous"}</span>
          )}
        />
        {!isMobile && (
          <Brush
            dataKey="dateTimestamp"
            height={30}
            stroke="hsl(var(--primary))"
            tickFormatter={(ts: number) => {
              const d = new Date(ts)
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
          />
        )}
        <Scatter
          name="Non-Hazardous"
          data={nonHazardousData}
          fill="hsl(221, 83%, 53%)"
          fillOpacity={0.6}
          stroke="none"
        />
        <Scatter
          name="Hazardous"
          data={hazardousData}
          fill="hsl(0, 84%, 60%)"
          fillOpacity={0.8}
          stroke="none"
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
