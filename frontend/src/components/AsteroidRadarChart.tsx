"use client"

import { useMemo } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import type { AsteroidSummary } from "@/lib/types"
import { useMobile } from "@/lib/useMobile"

interface AsteroidRadarChartProps {
  asteroids: AsteroidSummary[]
  selectedAsteroid: AsteroidSummary | null
}

interface RadarMetric {
  metric: string
  asteroidValue: number
  averageValue: number
  asteroidRaw: number
  averageRaw: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: RadarMetric }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as RadarMetric

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="mb-1 font-semibold">{data.metric}</p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p className="text-cyan-400">Selected: {data.asteroidRaw.toFixed(4)}</p>
        <p className="text-white/60">Average: {data.averageRaw.toFixed(4)}</p>
      </div>
    </div>
  )
}

export function AsteroidRadarChart({ asteroids, selectedAsteroid }: AsteroidRadarChartProps) {
  const isMobile = useMobile()

  const chartData = useMemo((): RadarMetric[] => {
    if (!selectedAsteroid || asteroids.length === 0) return []

    const avg = (values: number[]): number => {
      if (values.length === 0) return 0
      return values.reduce((s, v) => s + v, 0) / values.length
    }

    // Compute averages
    const avgDistance = avg(asteroids.map((a) => a.miss_distance_km))
    const avgDiameter = avg(asteroids.map((a) => a.estimated_diameter_max_km))
    const avgVelocity = avg(asteroids.map((a) => a.relative_velocity_kph))
    const avgHazardous = avg(asteroids.map((a) => (a.is_potentially_hazardous_asteroid ? 1 : 0)))
    const avgEccentricity = avg(
      asteroids.map((a) => {
        const e = a.eccentricity ? Number.parseFloat(a.eccentricity) : null
        return e != null && !Number.isNaN(e) ? e : 0
      })
    )

    // Selected asteroid values
    const selDistance = selectedAsteroid.miss_distance_km
    const selDiameter = selectedAsteroid.estimated_diameter_max_km
    const selVelocity = selectedAsteroid.relative_velocity_kph
    const selHazardous = selectedAsteroid.is_potentially_hazardous_asteroid ? 1 : 0
    const selEccentricity = selectedAsteroid.eccentricity
      ? Number.parseFloat(selectedAsteroid.eccentricity)
      : 0

    // Normalize to 0-100%
    // Distance: inverse (closer = higher score)
    const maxDist = Math.max(...asteroids.map((a) => a.miss_distance_km), 1)
    const normalizeInverse = (val: number, max: number) => Math.min((1 - val / max) * 100, 100)
    const normalize = (val: number, max: number) => Math.min((val / max) * 100, 100)

    const maxDiam = Math.max(...asteroids.map((a) => a.estimated_diameter_max_km), 0.001)
    const maxVel = Math.max(...asteroids.map((a) => a.relative_velocity_kph), 1)
    const maxEcc = Math.max(
      ...asteroids.map((a) => {
        const e = a.eccentricity ? Number.parseFloat(a.eccentricity) : 0
        return e != null && !Number.isNaN(e) ? e : 0
      }),
      0.001
    )

    return [
      {
        metric: "Proximity",
        asteroidValue: normalizeInverse(selDistance, maxDist),
        averageValue: normalizeInverse(avgDistance, maxDist),
        asteroidRaw: selDistance,
        averageRaw: avgDistance,
      },
      {
        metric: "Diameter",
        asteroidValue: normalize(selDiameter, maxDiam),
        averageValue: normalize(avgDiameter, maxDiam),
        asteroidRaw: selDiameter,
        averageRaw: avgDiameter,
      },
      {
        metric: "Velocity",
        asteroidValue: normalize(selVelocity, maxVel),
        averageValue: normalize(avgVelocity, maxVel),
        asteroidRaw: selVelocity,
        averageRaw: avgVelocity,
      },
      {
        metric: "Hazard",
        asteroidValue: selHazardous * 100,
        averageValue: normalize(avgHazardous, 1),
        asteroidRaw: selHazardous,
        averageRaw: avgHazardous,
      },
      {
        metric: "Eccentricity",
        asteroidValue: normalize(selEccentricity, maxEcc),
        averageValue: normalize(avgEccentricity, maxEcc),
        asteroidRaw: selEccentricity,
        averageRaw: avgEccentricity,
      },
    ]
  }, [asteroids, selectedAsteroid])

  if (!selectedAsteroid || chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Select an asteroid to compare
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <RadarChart data={chartData} margin={isMobile ? { top: 10, right: 20, bottom: 10, left: 20 } : { top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid className="stroke-border" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: isMobile ? 9 : 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: isMobile ? 8 : 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => (
            <span className={isMobile ? "text-[10px]" : "text-sm"}>{value === "asteroidValue" ? selectedAsteroid.name : "Dataset Average"}</span>
          )}
        />
        <Radar
          name="asteroidValue"
          dataKey="asteroidValue"
          stroke="hsl(187, 85%, 53%)"
          fill="hsl(187, 85%, 53%)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Radar
          name="averageValue"
          dataKey="averageValue"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.1}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
