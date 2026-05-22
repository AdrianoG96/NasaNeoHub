"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react"
import type { AsteroidSummary } from "@/lib/types"

interface ChartSummaryStatsProps {
  asteroids: AsteroidSummary[]
  metric: "miss_distance_km" | "estimated_diameter_max_km" | "relative_velocity_kph"
  label: string
  unit: string
}

interface Stats {
  min: number
  max: number
  avg: number
  median: number
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const duration = 800
    const from = 0

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (value - from) * eased)
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }

    ref.current = requestAnimationFrame(animate)
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current)
    }
  }, [value])

  return <>{display.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>
}

function formatStat(value: number, unit: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M ${unit}`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K ${unit}`
  return `${value.toFixed(2)} ${unit}`
}

export function ChartSummaryStats({ asteroids, metric, label, unit }: ChartSummaryStatsProps) {
  const stats = useMemo((): Stats | null => {
    if (asteroids.length === 0) return null

    const values = asteroids.map((a) => a[metric]).filter((v) => v != null && !Number.isNaN(v)) as number[]
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]

    return { min, max, avg, median }
  }, [asteroids, metric])

  if (!stats) return null

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="font-medium text-white/70">{label}:</span>

      <span className="flex items-center gap-1" title="Minimum">
        <ArrowDown className="size-3 text-blue-400" />
        <AnimatedNumber value={stats.min} decimals={2} /> {unit}
      </span>

      <span className="flex items-center gap-1" title="Maximum">
        <ArrowUp className="size-3 text-red-400" />
        <AnimatedNumber value={stats.max} decimals={2} /> {unit}
      </span>

      <span className="flex items-center gap-1" title="Average">
        <TrendingUp className="size-3 text-green-400" />
        <AnimatedNumber value={stats.avg} decimals={2} /> {unit}
      </span>

      <span className="flex items-center gap-1" title="Median">
        <Minus className="size-3 text-yellow-400" />
        <AnimatedNumber value={stats.median} decimals={2} /> {unit}
      </span>
    </div>
  )
}
