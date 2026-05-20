"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { AsteroidSummary } from "@/lib/types"
import { formatNumber } from "@/lib/format"
import { OrbitIcon, RulerIcon, AlertTriangleIcon, MaximizeIcon, PercentIcon } from "lucide-react"

interface StatsCardsProps {
  asteroids: AsteroidSummary[]
}

interface StatCard {
  label: string
  value: string
  icon: React.ReactNode
  description?: string
}

export function StatsCards({ asteroids }: StatsCardsProps) {
  const stats = useMemo((): StatCard[] => {
    if (asteroids.length === 0) return []

    const total = asteroids.length

    const avgDistance =
      asteroids.reduce((sum, a) => sum + a.miss_distance_km, 0) / total

    const closest = asteroids.reduce((prev, curr) =>
      curr.miss_distance_km < prev.miss_distance_km ? curr : prev
    )

    const largest = asteroids.reduce((prev, curr) =>
      curr.estimated_diameter_max_km > prev.estimated_diameter_max_km ? curr : prev
    )

    const hazardousCount = asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length
    const hazardousPercent = (hazardousCount / total) * 100

    return [
      {
        label: "Total Asteroids",
        value: formatNumber(total),
        icon: <OrbitIcon className="size-5 text-blue-500" />,
      },
      {
        label: "Average Distance",
        value: `${formatNumber(Math.round(avgDistance))} km`,
        icon: <RulerIcon className="size-5 text-green-500" />,
      },
      {
        label: "Closest Approach",
        value: `${closest.name}`,
        description: `${formatNumber(Math.round(closest.miss_distance_km))} km`,
        icon: <MaximizeIcon className="size-5 text-orange-500" />,
      },
      {
        label: "Largest Asteroid",
        value: `${largest.name}`,
        description: `${formatNumber(largest.estimated_diameter_max_km, 3)} km diameter`,
        icon: <MaximizeIcon className="size-5 text-purple-500" />,
      },
      {
        label: "Hazardous",
        value: `${hazardousPercent.toFixed(1)}%`,
        description: `${formatNumber(hazardousCount)} of ${formatNumber(total)}`,
        icon: <AlertTriangleIcon className="size-5 text-red-500" />,
      },
    ]
  }, [asteroids])

  if (stats.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="mt-0.5 shrink-0">{stat.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="truncate text-base font-semibold">{stat.value}</p>
              {stat.description && (
                <p className="truncate text-xs text-muted-foreground/70">{stat.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
