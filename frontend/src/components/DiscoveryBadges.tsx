"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Search, AlertTriangle, Orbit, Star, Telescope } from "lucide-react"
import type { AsteroidSummary } from "@/lib/types"

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  condition: (asteroids: AsteroidSummary[], totalSearches: number) => boolean
}

const BADGES: Badge[] = [
  {
    id: "first-search",
    name: "First Contact",
    description: "Completed your first asteroid search",
    icon: <Search className="size-4" />,
    condition: (_asteroids, totalSearches) => totalSearches >= 1,
  },
  {
    id: "hazard-hunter",
    name: "Hazard Hunter",
    description: "Found 10+ potentially hazardous asteroids",
    icon: <AlertTriangle className="size-4 text-red-400" />,
    condition: (asteroids) => asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length >= 10,
  },
  {
    id: "deep-explorer",
    name: "Deep Explorer",
    description: "Explored 50+ asteroids in a single search",
    icon: <Telescope className="size-4 text-blue-400" />,
    condition: (asteroids) => asteroids.length >= 50,
  },
  {
    id: "giant-hunter",
    name: "Giant Hunter",
    description: "Found an asteroid larger than 1 km",
    icon: <Star className="size-4 text-yellow-400" />,
    condition: (asteroids) => asteroids.some((a) => a.estimated_diameter_max_km >= 1),
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Found an asteroid traveling faster than 100,000 km/h",
    icon: <Orbit className="size-4 text-purple-400" />,
    condition: (asteroids) => asteroids.some((a) => a.relative_velocity_kph >= 100_000),
  },
  {
    id: "massive-search",
    name: "Mass Discovery",
    description: "Found 100+ asteroids in a single search",
    icon: <Award className="size-4 text-green-400" />,
    condition: (asteroids) => asteroids.length >= 100,
  },
]

interface DiscoveryBadgesProps {
  asteroids: AsteroidSummary[]
}

export function DiscoveryBadges({ asteroids }: DiscoveryBadgesProps) {
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set())
  const [totalSearches, setTotalSearches] = useState(0)
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("neo-badges")
    if (saved) {
      setEarnedBadges(new Set(JSON.parse(saved)))
    }
    const searches = Number.parseInt(localStorage.getItem("neo-searches") || "0", 10)
    setTotalSearches(searches)
  }, [])

  useEffect(() => {
    if (asteroids.length === 0) return

    const newlyEarned: string[] = []

    for (const badge of BADGES) {
      if (!earnedBadges.has(badge.id) && badge.condition(asteroids, totalSearches)) {
        newlyEarned.push(badge.id)
      }
    }

    if (newlyEarned.length > 0) {
      const updated = new Set(earnedBadges)
      for (const id of newlyEarned) {
        updated.add(id)
      }
      setEarnedBadges(updated)
      localStorage.setItem("neo-badges", JSON.stringify([...updated]))
      setShowNewBadge(newlyEarned[0])
      setTimeout(() => setShowNewBadge(null), 4000)
    }
  }, [asteroids, earnedBadges, totalSearches])

  if (earnedBadges.size === 0) return null

  return (
    <>
      {/* New Badge Toast */}
      {showNewBadge && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
          <Card className="border-yellow-500/30 bg-yellow-500/10 shadow-lg shadow-yellow-500/10 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Award className="size-6 text-yellow-400" />
              <div>
                <p className="text-sm font-semibold text-yellow-300">New Badge Unlocked!</p>
                <p className="text-xs text-yellow-200/70">
                  {BADGES.find((b) => b.id === showNewBadge)?.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2">
        {BADGES.filter((b) => earnedBadges.has(b.id)).map((badge) => (
          <div
            key={badge.id}
            className="group relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/90"
          >
            {badge.icon}
            <span className="hidden sm:inline">{badge.name}</span>
            <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow-md group-hover:block">
              {badge.description}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// Export to increment search count from dashboard
export function incrementSearchCount() {
  const current = Number.parseInt(localStorage.getItem("neo-searches") || "0", 10)
  localStorage.setItem("neo-searches", String(current + 1))
}
