"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { fetchAsteroidDetail } from "@/lib/api"
import { formatDistance, formatVelocity, formatDate, formatDecimal } from "@/lib/format"
import type { AsteroidDetail as AsteroidDetailType } from "@/lib/types"
import { AlertCircle, ExternalLink, AlertTriangle, Orbit, History, Info, Ruler, Gauge, Globe, ArrowLeftRight } from "lucide-react"

interface AsteroidDetailProps {
  asteroidId: string | null
  onClose: () => void
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

function DetailError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error Loading Asteroid Details</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p>{message}</p>
        <Button variant="outline" size="sm" className="w-fit" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

/** Stylized SVG asteroid illustration with size-relative rendering */
function AsteroidIllustration({
  diameterMinKm,
  diameterMaxKm,
  isHazardous,
}: {
  diameterMinKm: number
  diameterMaxKm: number
  isHazardous: boolean
}) {
  const avgDiameter = (diameterMinKm + diameterMaxKm) / 2
  // Scale: map asteroid diameter (km) to a visual size (40-120px)
  // Use log scale for better visual range
  const logSize = Math.log10(avgDiameter + 0.01)
  const visualSize = Math.max(40, Math.min(120, 40 + logSize * 25))

  // Generate random-looking but deterministic crater positions
  const craters = [
    { cx: "35%", cy: "30%", r: "12%" },
    { cx: "60%", cy: "40%", r: "8%" },
    { cx: "45%", cy: "65%", r: "15%" },
    { cx: "25%", cy: "55%", r: "6%" },
    { cx: "70%", cy: "60%", r: "10%" },
    { cx: "50%", cy: "25%", r: "5%" },
  ]

  const baseColor = isHazardous ? "#dc2626" : "#64748b"
  const darkColor = isHazardous ? "#991b1b" : "#475569"
  const lightColor = isHazardous ? "#fca5a5" : "#94a3b8"

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={visualSize}
        height={visualSize}
        viewBox="0 0 100 100"
        className="drop-shadow-lg"
        aria-label={`Asteroid illustration, average diameter ${formatDecimal(avgDiameter, 3)} km`}
      >
        <defs>
          <radialGradient id={`asteroid-grad-${isHazardous ? "haz" : "safe"}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.6" />
            <stop offset="50%" stopColor={baseColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={darkColor} stopOpacity="1" />
          </radialGradient>
          <filter id={`asteroid-shadow-${isHazardous ? "haz" : "safe"}`}>
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Main body */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill={`url(#asteroid-grad-${isHazardous ? "haz" : "safe"})`}
          filter={`url(#asteroid-shadow-${isHazardous ? "haz" : "safe"})`}
        />

        {/* Craters */}
        {craters.map((crater, i) => (
          <ellipse
            key={i}
            cx={crater.cx}
            cy={crater.cy}
            rx={crater.r}
            ry={crater.r}
            fill={darkColor}
            opacity="0.4"
            transform={`rotate(${i * 37}, ${crater.cx}, ${crater.cy})`}
          />
        ))}

        {/* Highlight/shine */}
        <ellipse cx="35" cy="30" rx="15" ry="10" fill="white" opacity="0.08" transform="rotate(-30, 35, 30)" />
      </svg>

      <span className="text-xs font-mono text-muted-foreground">
        Ø {formatDecimal(avgDiameter, 3)} km
      </span>
    </div>
  )
}

/** Size comparison: asteroid vs familiar objects */
function SizeComparison({ diameterMinKm, diameterMaxKm }: { diameterMinKm: number; diameterMaxKm: number }) {
  const avgDiameterM = ((diameterMinKm + diameterMaxKm) / 2) * 1000 // convert to meters

  const comparisons = [
    { name: "Bus", sizeM: 12, icon: "🚌" },
    { name: "Football Field", sizeM: 110, icon: "🏟️" },
    { name: "Eiffel Tower", sizeM: 330, icon: "🗼" },
    { name: "Burj Khalifa", sizeM: 828, icon: "🏗️" },
  ]

  // Find the closest comparison
  const closest = comparisons.reduce((prev, curr) =>
    Math.abs(curr.sizeM - avgDiameterM) < Math.abs(prev.sizeM - avgDiameterM) ? curr : prev
  )

  const ratio = avgDiameterM / closest.sizeM
  const isLarger = ratio > 1

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Ruler className="size-3" />
        Size Comparison
      </p>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{closest.icon}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-white">
              {isLarger
                ? `${formatDecimal(ratio, 1)}× larger`
                : `${formatDecimal(1 / ratio, 1)}× smaller`}
            </span>
            <span className="text-xs text-muted-foreground">than a {closest.name}</span>
          </div>
          {/* Visual bar comparison */}
          <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`rounded-full transition-all duration-500 ${
                isLarger ? "bg-orange-500" : "bg-blue-500"
              }`}
              style={{
                width: `${isLarger ? 100 : (avgDiameterM / closest.sizeM) * 100}%`,
              }}
            />
            {isLarger && (
              <div
                className="rounded-full bg-white/30"
                style={{
                  width: `${(closest.sizeM / avgDiameterM) * 100}%`,
                }}
              />
            )}
          </div>
          <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
            <span>Asteroid</span>
            <span>{closest.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Quick stat card with icon */
function StatCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
      {subValue && <p className="text-[11px] text-muted-foreground">{subValue}</p>}
    </div>
  )
}

export function AsteroidDetail({ asteroidId, onClose }: AsteroidDetailProps) {
  const [detail, setDetail] = useState<AsteroidDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAllApproaches, setShowAllApproaches] = useState(false)

  const loadDetail = useCallback(async () => {
    if (!asteroidId) return

    setIsLoading(true)
    setError(null)
    setDetail(null)
    setShowAllApproaches(false)

    try {
      const data = await fetchAsteroidDetail(asteroidId)
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asteroid details")
    } finally {
      setIsLoading(false)
    }
  }, [asteroidId])

  useEffect(() => {
    if (asteroidId) loadDetail()
  }, [asteroidId, loadDetail])

  const sortedApproaches = detail?.close_approach_data
    ? [...detail.close_approach_data].sort(
        (a, b) => new Date(b.close_approach_date).getTime() - new Date(a.close_approach_date).getTime()
      )
    : []

  const displayedApproaches = showAllApproaches ? sortedApproaches : sortedApproaches.slice(0, 10)

  return (
    <Dialog open={!!asteroidId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto border-white/10 bg-slate-900 p-4 text-white sm:max-w-3xl sm:p-6">
        {isLoading && <DetailSkeleton />}

        {error && <DetailError message={error} onRetry={loadDetail} />}

        {!isLoading && !error && detail && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold">{detail.name}</DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground">
                    ID: {detail.id}
                  </DialogDescription>
                </div>
                <Badge
                  variant={detail.is_potentially_hazardous_asteroid ? "destructive" : "outline"}
                  className={
                    detail.is_potentially_hazardous_asteroid
                      ? "shrink-0"
                      : "shrink-0 border-green-500 text-green-400"
                  }
                >
                  {detail.is_potentially_hazardous_asteroid ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      Potentially Hazardous
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Info className="size-3" />
                      Not Hazardous
                    </span>
                  )}
                </Badge>
              </div>
            </DialogHeader>

            {/* Asteroid Illustration + Size Comparison Row */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center justify-center">
                <AsteroidIllustration
                  diameterMinKm={detail.estimated_diameter_min_km}
                  diameterMaxKm={detail.estimated_diameter_max_km}
                  isHazardous={detail.is_potentially_hazardous_asteroid}
                />
              </div>
              <div className="w-full flex-1 space-y-2">
                <SizeComparison
                  diameterMinKm={detail.estimated_diameter_min_km}
                  diameterMaxKm={detail.estimated_diameter_max_km}
                />
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatCard
                icon={<Ruler className="size-3.5" />}
                label="Diameter Range"
                value={`${formatDecimal(detail.estimated_diameter_min_km, 3)} km`}
                subValue={`${formatDecimal(detail.estimated_diameter_min_m, 0)} – ${formatDecimal(detail.estimated_diameter_max_m, 0)} m`}
              />
              <StatCard
                icon={<Gauge className="size-3.5" />}
                label="Relative Velocity"
                value={formatVelocity(detail.close_approach_data[0]?.relative_velocity_kph ?? 0)}
                subValue={
                  detail.close_approach_data[0]
                    ? `${formatDecimal(detail.close_approach_data[0].relative_velocity_kph / 3600, 2)} km/s`
                    : undefined
                }
              />
              <StatCard
                icon={<ArrowLeftRight className="size-3.5" />}
                label="Miss Distance"
                value={formatDistance(detail.close_approach_data[0]?.miss_distance_km ?? 0)}
                subValue={
                  detail.close_approach_data[0]
                    ? `${formatDecimal(detail.close_approach_data[0].miss_distance_km / 384400, 2)} lunar distances`
                    : undefined
                }
              />
              <StatCard
                icon={<Globe className="size-3.5" />}
                label="Close Approach"
                value={formatDate(detail.close_approach_data[0]?.close_approach_date ?? "")}
                subValue={
                  detail.close_approach_data.length > 1
                    ? `${detail.close_approach_data.length} total approaches`
                    : undefined
                }
              />
            </div>

            {/* Close Approach History */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <History className="size-4" />
                Close Approach History
                <span className="text-xs font-normal text-muted-foreground/60">
                  ({sortedApproaches.length} records)
                </span>
              </h3>
              {sortedApproaches.length === 0 ? (
                <p className="text-sm text-muted-foreground">No close approach data available.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Miss Distance (km)</TableHead>
                        <TableHead>Relative Velocity (km/h)</TableHead>
                        <TableHead>Orbiting Body</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedApproaches.map((approach) => (
                        <TableRow key={approach.close_approach_date}>
                          <TableCell className="font-medium">{formatDate(approach.close_approach_date)}</TableCell>
                          <TableCell>{formatDistance(approach.miss_distance_km)}</TableCell>
                          <TableCell>{formatVelocity(approach.relative_velocity_kph)}</TableCell>
                          <TableCell>Earth</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {sortedApproaches.length > 10 && !showAllApproaches && (
                <Button variant="outline" size="sm" onClick={() => setShowAllApproaches(true)}>
                  Show more ({sortedApproaches.length - 10} remaining)
                </Button>
              )}
              {showAllApproaches && sortedApproaches.length > 10 && (
                <Button variant="outline" size="sm" onClick={() => setShowAllApproaches(false)}>
                  Show less
                </Button>
              )}
            </section>

            {/* Orbital Data */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Orbit className="size-4" />
                Orbital Data
              </h3>
              {detail.orbital_data ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border p-4 sm:grid-cols-3">
                  <OrbitalField label="Orbit ID" value={detail.orbital_data.orbit_id} />
                  <OrbitalField label="Orbit Determination Date" value={detail.orbital_data.orbit_determination_date} />
                  <OrbitalField label="Eccentricity" value={detail.orbital_data.eccentricity} />
                  <OrbitalField label="Semi-Major Axis (AU)" value={detail.orbital_data.semi_major_axis} />
                  <OrbitalField label="Inclination (deg)" value={detail.orbital_data.inclination} />
                  <OrbitalField label="Ascending Node Longitude (deg)" value={detail.orbital_data.ascending_node_longitude} />
                  <OrbitalField label="Perihelion Distance (AU)" value={detail.orbital_data.perihelion_distance} />
                  <OrbitalField label="Aphelion Distance (AU)" value={detail.orbital_data.aphelion_distance} />
                  <OrbitalField label="Orbital Period (days)" value={detail.orbital_data.orbital_period} />
                  <OrbitalField label="Min Orbit Intersection (AU)" value={detail.orbital_data.minimum_orbit_intersection} />
                  <OrbitalField label="Perihelion Argument (deg)" value={detail.orbital_data.perihelion_argument} />
                  <OrbitalField label="Mean Anomaly (deg)" value={detail.orbital_data.mean_anomaly} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No orbital data available.</p>
              )}
            </section>

            {/* NASA JPL Link */}
            <div className="flex justify-center pt-2">
              <a
                href={detail.nasa_jpl_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                View full details on NASA JPL
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function OrbitalField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{formatDecimal(value)}</p>
    </div>
  )
}
