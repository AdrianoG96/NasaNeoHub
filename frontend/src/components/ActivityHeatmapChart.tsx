"use client"

import { useMemo, useState } from "react"
import type { AsteroidSummary } from "@/lib/types"

interface ActivityHeatmapChartProps {
  asteroids: AsteroidSummary[]
}

interface HeatmapCell {
  dayOfWeek: number
  dayLabel: string
  weekOfMonth: number
  count: number
  hazardousCount: number
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5+"]

function getWeekOfMonth(dateStr: string): number {
  const d = new Date(dateStr)
  const day = d.getDate()
  if (day <= 7) return 0
  if (day <= 14) return 1
  if (day <= 21) return 2
  if (day <= 28) return 3
  return 4
}

export function ActivityHeatmapChart({ asteroids }: ActivityHeatmapChartProps) {
  const [hazardousOnly, setHazardousOnly] = useState(false)

  const filteredAsteroids = useMemo(() => {
    return hazardousOnly ? asteroids.filter((a) => a.is_potentially_hazardous_asteroid) : asteroids
  }, [asteroids, hazardousOnly])

  const heatmapData = useMemo(() => {
    const grid = new Map<string, HeatmapCell>()

    for (const asteroid of filteredAsteroids) {
      const d = new Date(asteroid.close_approach_date)
      const dayOfWeek = d.getDay()
      const weekOfMonth = getWeekOfMonth(asteroid.close_approach_date)
      const key = `${dayOfWeek}-${weekOfMonth}`

      const existing = grid.get(key)
      if (existing) {
        existing.count++
        if (asteroid.is_potentially_hazardous_asteroid) existing.hazardousCount++
      } else {
        grid.set(key, {
          dayOfWeek,
          dayLabel: DAY_LABELS[dayOfWeek],
          weekOfMonth,
          count: 1,
          hazardousCount: asteroid.is_potentially_hazardous_asteroid ? 1 : 0,
        })
      }
    }

    // Fill in missing cells with zero
    const result: HeatmapCell[] = []
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const key = `${day}-${week}`
        const existing = grid.get(key)
        result.push(
          existing ?? {
            dayOfWeek: day,
            dayLabel: DAY_LABELS[day],
            weekOfMonth: week,
            count: 0,
            hazardousCount: 0,
          }
        )
      }
    }

    return result
  }, [filteredAsteroids])

  const maxCount = useMemo(() => Math.max(...heatmapData.map((c) => c.count), 1), [heatmapData])

  const getCellColor = (count: number): string => {
    if (count === 0) return "bg-white/5"
    const intensity = Math.min(count / maxCount, 1)
    if (intensity < 0.25) return "bg-cyan-900/40"
    if (intensity < 0.5) return "bg-cyan-700/50"
    if (intensity < 0.75) return "bg-cyan-600/60"
    return "bg-cyan-500/70"
  }

  if (asteroids.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setHazardousOnly((prev) => !prev)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
            hazardousOnly
              ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
          aria-label="Filter to show only hazardous asteroids"
        >
          {hazardousOnly ? "All" : "Hazardous Only"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-xs text-muted-foreground font-medium text-left">Week \ Day</th>
              {DAY_LABELS.map((day) => (
                <th key={day} className="p-1 text-xs text-muted-foreground font-medium text-center w-[48px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEK_LABELS.map((weekLabel, weekIdx) => (
              <tr key={weekLabel}>
                <td className="p-1 text-xs text-muted-foreground pr-2">{weekLabel}</td>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const cell = heatmapData.find((c) => c.dayOfWeek === day && c.weekOfMonth === weekIdx)
                  const count = cell?.count ?? 0
                  return (
                    <td key={`${weekIdx}-${day}`} className="p-1">
                      <div
                        className={`relative aspect-square rounded-md ${getCellColor(count)} flex items-center justify-center transition-all duration-200 hover:ring-2 hover:ring-cyan-400/50 cursor-default group`}
                        title={`${DAY_LABELS[day]} ${weekLabel}: ${count} asteroids`}
                      >
                        {count > 0 && (
                          <span className="text-[10px] font-medium text-white/80">{count}</span>
                        )}
                        {/* Tooltip on hover */}
                        {cell && count > 0 && (
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="rounded-lg border bg-card px-2 py-1 shadow-md text-xs whitespace-nowrap">
                              <p className="font-medium">{cell.dayLabel} — {WEEK_LABELS[cell.weekOfMonth]}</p>
                              <p className="text-muted-foreground">Total: {cell.count}</p>
                              <p className="text-red-400">Hazardous: {cell.hazardousCount}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Low</span>
        <div className="flex gap-0.5">
          <div className="size-3 rounded-sm bg-white/5" />
          <div className="size-3 rounded-sm bg-cyan-900/40" />
          <div className="size-3 rounded-sm bg-cyan-700/50" />
          <div className="size-3 rounded-sm bg-cyan-600/60" />
          <div className="size-3 rounded-sm bg-cyan-500/70" />
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
