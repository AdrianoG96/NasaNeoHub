"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import type { AsteroidSummary } from "@/lib/types"

interface KeyInsightsProps {
  asteroids: AsteroidSummary[]
}

const MOON_DISTANCE_KM = 384_400

const COMPARISONS = [
  { max: 0.01, label: "a small car", icon: "🚗" },
  { max: 0.05, label: "a house", icon: "🏠" },
  { max: 0.1, label: "a football field", icon: "🏟️" },
  { max: 0.5, label: "the Statue of Liberty", icon: "🗽" },
  { max: 1, label: "the Great Pyramid", icon: "🔺" },
  { max: 5, label: "a small mountain", icon: "⛰️" },
  { max: Infinity, label: "a city", icon: "🏙️" },
]

function getSizeComparison(diameterKm: number): string {
  const comp = COMPARISONS.find((c) => diameterKm < c.max)
  return comp ? `${comp.icon} Comparable to ${comp.label}` : ""
}

function getDistanceComparison(distanceKm: number): string {
  if (distanceKm < MOON_DISTANCE_KM) {
    const ratio = (MOON_DISTANCE_KM / distanceKm).toFixed(1)
    return `🌙 Closer than the Moon! (${ratio}x closer than the lunar orbit)`
  }
  const lunarDistances = (distanceKm / MOON_DISTANCE_KM).toFixed(1)
  return `🌙 ${lunarDistances} lunar distances away`
}

function getVelocityComparison(velocityKph: number): string {
  const timesFaster = (velocityKph / 1000).toFixed(0)
  return `✈️ ${timesFaster}x faster than a commercial jet`
}

interface Insight {
  icon: string
  title: string
  description: string
  highlight?: string
}

export function KeyInsights({ asteroids }: KeyInsightsProps) {
  const insights = useMemo((): Insight[] => {
    if (asteroids.length === 0) return []

    const total = asteroids.length
    const hazardousCount = asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length
    const hazardousPercent = ((hazardousCount / total) * 100).toFixed(1)

    const closest = asteroids.reduce((prev, curr) =>
      curr.miss_distance_km < prev.miss_distance_km ? curr : prev
    )

    const largest = asteroids.reduce((prev, curr) =>
      curr.estimated_diameter_max_km > prev.estimated_diameter_max_km ? curr : prev
    )

    const fastest = asteroids.reduce((prev, curr) =>
      curr.relative_velocity_kph > prev.relative_velocity_kph ? curr : prev
    )

    const avgDistance = asteroids.reduce((sum, a) => sum + a.miss_distance_km, 0) / total

    const result: Insight[] = [
      {
        icon: "📊",
        title: "Total Asteroids Found",
        description: `${total} near-Earth objects detected in this period`,
        highlight: `${total}`,
      },
      {
        icon: "🎯",
        title: "Closest Approach",
        description: `${closest.name} at ${Math.round(closest.miss_distance_km).toLocaleString("en-US")} km — ${getDistanceComparison(closest.miss_distance_km)}`,
      },
      {
        icon: "📏",
        title: "Largest Object",
        description: `${largest.name} with a diameter of ${largest.estimated_diameter_max_km.toFixed(3)} km — ${getSizeComparison(largest.estimated_diameter_max_km)}`,
      },
      {
        icon: "🚀",
        title: "Fastest Asteroid",
        description: `${fastest.name} at ${Math.round(fastest.relative_velocity_kph).toLocaleString("en-US")} km/h — ${getVelocityComparison(fastest.relative_velocity_kph)}`,
      },
      {
        icon: "⚠️",
        title: "Hazard Assessment",
        description: `${hazardousCount} of ${total} (${hazardousPercent}%) are classified as potentially hazardous`,
      },
      {
        icon: "🌍",
        title: "Average Distance",
        description: `Average miss distance: ${Math.round(avgDistance).toLocaleString("en-US")} km — ${getDistanceComparison(avgDistance)}`,
      },
    ]

    return result
  }, [asteroids])

  if (insights.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-yellow-400" />
        <h2 className="text-sm font-semibold text-white/80">Key Insights</h2>
      </div>
      <div className="animate-stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <Card
            key={insight.title}
            className="group border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{insight.icon}</span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">
                  {insight.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/80">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
