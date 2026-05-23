"use client"

import { useState, useEffect, useReducer, useRef } from "react"
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

type DetailState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; detail: AsteroidDetailType }

type DetailAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; detail: AsteroidDetailType }
  | { type: "FETCH_ERROR"; message: string }

function detailReducer(_state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" }
    case "FETCH_SUCCESS":
      return { status: "success", detail: action.detail }
    case "FETCH_ERROR":
      return { status: "error", message: action.message }
  }
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
  const logSize = Math.log10(avgDiameter + 0.01)
  const visualSize = Math.max(40, Math.min(120, 40 + logSize * 25))

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
        <circle cx="50" cy="50" r="45" fill={`url(#asteroid-grad-${isHazardous ? "haz" : "safe"})`} filter={`url(#asteroid-shadow-${isHazardous ? "haz" : "safe"})`} />
        {craters.map((crater, i) => {
          // Convert percentage strings to absolute numbers based on viewBox 100x100
          const cxNum = Number.parseFloat(crater.cx)
          const cyNum = Number.parseFloat(crater.cy)
          return (
            <ellipse key={i} cx={crater.cx} cy={crater.cy} rx={crater.r} ry={crater.r} fill={darkColor} opacity="0.4" transform={`rotate(${i * 37}, ${cxNum}, ${cyNum})`} />
          )
        })}
        <ellipse cx="35" cy="30" rx="15" ry="10" fill="white" opacity="0.08" transform="rotate(-30, 35, 30)" />
      </svg>
      <span className="text-xs font-mono text-muted-foreground">Ø {formatDecimal(avgDiameter, 3)} km</span>
    </div>
  )
}

/** Size comparison: asteroid vs familiar objects */
function SizeComparison({ diameterMinKm, diameterMaxKm }: { diameterMinKm: number; diameterMaxKm: number }) {
  const avgDiameterM = ((diameterMinKm + diameterMaxKm) / 2) * 1000

  const comparisons = [
    { name: "Bus", sizeM: 12, icon: "🚌" },
    { name: "Football Field", sizeM: 110, icon: "🏟️" },
    { name: "Eiffel Tower", sizeM: 330, icon: "🗼" },
    { name: "Burj Khalifa", sizeM: 828, icon: "🏗️" },
  ]

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
              {isLarger ? `${formatDecimal(ratio, 1)}× larger` : `${formatDecimal(1 / ratio, 1)}× smaller`}
            </span>
            <span className="text-xs text-muted-foreground">than a {closest.name}</span>
          </div>
          <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className={`rounded-full transition-all duration-500 ${isLarger ? "bg-orange-500" : "bg-blue-500"}`} style={{ width: `${isLarger ? 100 : (avgDiameterM / closest.sizeM) * 100}%` }} />
            {isLarger && <div className="rounded-full bg-white/30" style={{ width: `${(closest.sizeM / avgDiameterM) * 100}%` }} />}
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
function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
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
  const [state, dispatch] = useReducer(detailReducer, { status: "idle" })
  const [showAllApproaches, setShowAllApproaches] = useState(false)
  const prevAsteroidIdRef = useRef(asteroidId)

  useEffect(() => {
    if (!asteroidId) return

    // Reset showAllApproaches when asteroidId changes
    if (prevAsteroidIdRef.current !== asteroidId) {
      prevAsteroidIdRef.current = asteroidId
      setShowAllApproaches(false)
    }

    dispatch({ type: "FETCH_START" })

    fetchAsteroidDetail(asteroidId)
      .then((data) => dispatch({ type: "FETCH_SUCCESS", detail: data }))
      .catch((err) => dispatch({ type: "FETCH_ERROR", message: err instanceof Error ? err.message : "Failed to load asteroid details" }))
  }, [asteroidId])

  const sortedApproaches = state.status === "success"
    ? [...state.detail.close_approach_data].sort(
        (a, b) => new Date(b.close_approach_date).getTime() - new Date(a.close_approach_date).getTime()
      )
    : []

  const displayedApproaches = showAllApproaches ? sortedApproaches : sortedApproaches.slice(0, 10)

  return (
    <Dialog open={!!asteroidId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] w-full max-w-2xl overflow-x-hidden overflow-y-auto border-white/10 bg-slate-900 p-3 text-white sm:max-w-3xl sm:p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
        {state.status === "loading" && <DetailSkeleton />}

        {state.status === "error" && (
          <DetailError
            message={state.message}
            onRetry={() => {
              if (!asteroidId) return
              dispatch({ type: "FETCH_START" })
              setShowAllApproaches(false)
              fetchAsteroidDetail(asteroidId)
                .then((data) => dispatch({ type: "FETCH_SUCCESS", detail: data }))
                .catch((err) => dispatch({ type: "FETCH_ERROR", message: err instanceof Error ? err.message : "Failed to load asteroid details" }))
            }}
          />
        )}

        {state.status === "success" && (() => {
          const detail = state.detail
          return (
            <>
              <DialogHeader className="pr-8 sm:pr-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <DialogTitle className="text-lg font-bold leading-tight sm:text-2xl">{detail.name}</DialogTitle>
                    <DialogDescription className="truncate text-xs font-mono text-muted-foreground">ID: {detail.id}</DialogDescription>
                  </div>
                  <Badge variant={detail.is_potentially_hazardous_asteroid ? "destructive" : "outline"} className={detail.is_potentially_hazardous_asteroid ? "shrink-0 text-[10px] sm:text-xs" : "shrink-0 border-green-500 text-green-400 text-[10px] sm:text-xs"}>
                    {detail.is_potentially_hazardous_asteroid ? (
                      <span className="flex items-center gap-1"><AlertTriangle className="size-3" /><span className="hidden sm:inline">Potentially Hazardous</span><span className="sm:hidden">Hazardous</span></span>
                    ) : (
                      <span className="flex items-center gap-1"><Info className="size-3" /><span className="hidden sm:inline">Not Hazardous</span><span className="sm:hidden">Safe</span></span>
                    )}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center justify-center">
                  <AsteroidIllustration diameterMinKm={detail.estimated_diameter_min_km} diameterMaxKm={detail.estimated_diameter_max_km} isHazardous={detail.is_potentially_hazardous_asteroid} />
                </div>
                <div className="w-full flex-1 space-y-2">
                  <SizeComparison diameterMinKm={detail.estimated_diameter_min_km} diameterMaxKm={detail.estimated_diameter_max_km} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {/* On mobile, first two cards span full width, last two stack below */}
                <StatCard icon={<Ruler className="size-3.5" />} label="Diameter Range" value={`${formatDecimal(detail.estimated_diameter_min_km, 3)} km`} subValue={`${formatDecimal(detail.estimated_diameter_min_m, 0)} – ${formatDecimal(detail.estimated_diameter_max_m, 0)} m`} />
                <StatCard icon={<Gauge className="size-3.5" />} label="Relative Velocity" value={formatVelocity(detail.close_approach_data[0]?.relative_velocity_kph ?? 0)} subValue={detail.close_approach_data[0] ? `${formatDecimal(detail.close_approach_data[0].relative_velocity_kph / 3600, 2)} km/s` : undefined} />
                <StatCard icon={<ArrowLeftRight className="size-3.5" />} label="Miss Distance" value={formatDistance(detail.close_approach_data[0]?.miss_distance_km ?? 0)} subValue={detail.close_approach_data[0] ? `${formatDecimal(detail.close_approach_data[0].miss_distance_km / 384400, 2)} lunar distances` : undefined} />
                <StatCard icon={<Globe className="size-3.5" />} label="Close Approach" value={formatDate(detail.close_approach_data[0]?.close_approach_date ?? "")} subValue={detail.close_approach_data.length > 1 ? `${detail.close_approach_data.length} total approaches` : undefined} />
              </div>

              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <History className="size-4" />
                  Close Approach History
                  <span className="text-xs font-normal text-muted-foreground/60">({sortedApproaches.length} records)</span>
                </h3>
                {sortedApproaches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No close approach data available.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap sm:whitespace-normal">Date</TableHead>
                          <TableHead className="whitespace-nowrap sm:whitespace-normal">Miss Distance</TableHead>
                          <TableHead className="hidden whitespace-nowrap sm:table-cell sm:whitespace-normal">Relative Velocity</TableHead>
                          <TableHead className="hidden whitespace-nowrap sm:table-cell sm:whitespace-normal">Orbiting Body</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedApproaches.map((approach) => (
                          <TableRow key={approach.close_approach_date}>
                            <TableCell className="whitespace-nowrap font-medium sm:whitespace-normal">{formatDate(approach.close_approach_date)}</TableCell>
                            <TableCell className="whitespace-nowrap sm:whitespace-normal">{formatDistance(approach.miss_distance_km)}</TableCell>
                            <TableCell className="hidden whitespace-nowrap sm:table-cell sm:whitespace-normal">{formatVelocity(approach.relative_velocity_kph)}</TableCell>
                            <TableCell className="hidden whitespace-nowrap sm:table-cell sm:whitespace-normal">Earth</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {sortedApproaches.length > 10 && !showAllApproaches && (
                  <Button variant="outline" size="sm" onClick={() => setShowAllApproaches(true)}>Show more ({sortedApproaches.length - 10} remaining)</Button>
                )}
                {showAllApproaches && sortedApproaches.length > 10 && (
                  <Button variant="outline" size="sm" onClick={() => setShowAllApproaches(false)}>Show less</Button>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Orbit className="size-4" />
                  Orbital Data
                </h3>
                {detail.orbital_data ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border p-3 sm:grid-cols-2 sm:p-4 md:grid-cols-3">
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

              <div className="flex justify-center pt-2">
                <a href={detail.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
                  <ExternalLink className="size-3.5" />
                  View full details on NASA JPL
                </a>
              </div>
            </>
          )
        })()}
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
