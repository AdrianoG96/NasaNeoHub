"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, AlertTriangle, Info } from "lucide-react"
import { formatDistance, formatVelocity, formatDecimal } from "@/lib/format"
import type { AsteroidSummary } from "@/lib/types"

interface AsteroidCompareProps {
  asteroids: AsteroidSummary[]
}

export function AsteroidCompare({ asteroids }: AsteroidCompareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected1, setSelected1] = useState<string>("")
  const [selected2, setSelected2] = useState<string>("")

  const asteroid1 = useMemo(
    () => asteroids.find((a) => a.id === selected1),
    [asteroids, selected1]
  )
  const asteroid2 = useMemo(
    () => asteroids.find((a) => a.id === selected2),
    [asteroids, selected2]
  )

  const comparisonRows = useMemo(() => {
    if (!asteroid1 || !asteroid2) return []

    return [
      {
        label: "Diameter (min)",
        value1: formatDecimal(asteroid1.estimated_diameter_min_km, 3) + " km",
        value2: formatDecimal(asteroid2.estimated_diameter_min_km, 3) + " km",
        winner: asteroid1.estimated_diameter_min_km > asteroid2.estimated_diameter_min_km ? 1 : 2,
      },
      {
        label: "Diameter (max)",
        value1: formatDecimal(asteroid1.estimated_diameter_max_km, 3) + " km",
        value2: formatDecimal(asteroid2.estimated_diameter_max_km, 3) + " km",
        winner: asteroid1.estimated_diameter_max_km > asteroid2.estimated_diameter_max_km ? 1 : 2,
      },
      {
        label: "Miss Distance",
        value1: formatDistance(asteroid1.miss_distance_km),
        value2: formatDistance(asteroid2.miss_distance_km),
        winner: asteroid1.miss_distance_km < asteroid2.miss_distance_km ? 1 : 2,
      },
      {
        label: "Velocity",
        value1: formatVelocity(asteroid1.relative_velocity_kph),
        value2: formatVelocity(asteroid2.relative_velocity_kph),
        winner: asteroid1.relative_velocity_kph > asteroid2.relative_velocity_kph ? 1 : 2,
      },
      {
        label: "Close Approach",
        value1: asteroid1.close_approach_date,
        value2: asteroid2.close_approach_date,
        winner: 0,
      },
    ]
  }, [asteroid1, asteroid2])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={asteroids.length < 2}
        className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
      >
        <ArrowLeftRight className="mr-1.5 size-3.5" />
        Compare
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85dvh] max-w-3xl overflow-y-auto border-white/10 bg-slate-900 p-3 text-white sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ArrowLeftRight className="size-5 text-blue-400" />
              Asteroid Comparison
            </DialogTitle>
            <DialogDescription className="text-blue-200/60 text-xs sm:text-sm">
              Select two asteroids to compare their characteristics side by side.
            </DialogDescription>
          </DialogHeader>

          {/* Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-blue-300/70">Asteroid A</label>
              <select
                value={selected1}
                onChange={(e) => setSelected1(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="">Select...</option>
                {asteroids
                  .filter((a) => a.id !== selected2)
                  .map((a) => (
                    <option key={a.id} value={a.id} className="bg-slate-800">
                      {a.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-blue-300/70">Asteroid B</label>
              <select
                value={selected2}
                onChange={(e) => setSelected2(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="">Select...</option>
                {asteroids
                  .filter((a) => a.id !== selected1)
                  .map((a) => (
                    <option key={a.id} value={a.id} className="bg-slate-800">
                      {a.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          {asteroid1 && asteroid2 && (
            <div className="mt-4 space-y-2">
              {/* Header Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-semibold text-white">{asteroid1.name}</p>
                    <Badge
                      variant={asteroid1.is_potentially_hazardous_asteroid ? "destructive" : "outline"}
                      className="mt-1"
                    >
                      {asteroid1.is_potentially_hazardous_asteroid ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="size-3" /> Hazardous
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Info className="size-3" /> Safe
                        </span>
                      )}
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-semibold text-white">{asteroid2.name}</p>
                    <Badge
                      variant={asteroid2.is_potentially_hazardous_asteroid ? "destructive" : "outline"}
                      className="mt-1"
                    >
                      {asteroid2.is_potentially_hazardous_asteroid ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="size-3" /> Hazardous
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Info className="size-3" /> Safe
                        </span>
                      )}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Rows */}
              <div className="overflow-hidden rounded-lg border border-white/10">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1fr_auto_1fr] border-b border-white/5 last:border-0"
                  >
                    <div
                      className={`px-3 py-2 text-right text-sm ${
                        row.winner === 1 ? "font-semibold text-green-400" : "text-white/70"
                      }`}
                    >
                      {row.value1}
                    </div>
                    <div className="flex items-center justify-center border-x border-white/5 px-3 py-2 text-xs font-medium text-white/40">
                      {row.label}
                    </div>
                    <div
                      className={`px-3 py-2 text-left text-sm ${
                        row.winner === 2 ? "font-semibold text-green-400" : "text-white/70"
                      }`}
                    >
                      {row.value2}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
