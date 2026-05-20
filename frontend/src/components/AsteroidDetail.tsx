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
import { AlertCircle, ExternalLink, AlertTriangle, Orbit, History, Info } from "lucide-react"

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
      <DialogContent className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto p-4 sm:max-w-3xl sm:p-6">
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
                      : "shrink-0 border-green-500 text-green-600 dark:text-green-400"
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

            {/* Overview Section */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Info className="size-4" />
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Diameter (min)</p>
                  <p className="text-sm font-medium">{formatDecimal(detail.estimated_diameter_min_km, 4)} km</p>
                  <p className="text-xs text-muted-foreground">{formatDecimal(detail.estimated_diameter_min_m, 2)} m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diameter (max)</p>
                  <p className="text-sm font-medium">{formatDecimal(detail.estimated_diameter_max_km, 4)} km</p>
                  <p className="text-xs text-muted-foreground">{formatDecimal(detail.estimated_diameter_max_m, 2)} m</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Relative Velocity</p>
                  <p className="text-sm font-medium">{formatVelocity(detail.close_approach_data[0]?.relative_velocity_kph ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Miss Distance</p>
                  <p className="text-sm font-medium">{formatDistance(detail.close_approach_data[0]?.miss_distance_km ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Close Approach Date</p>
                  <p className="text-sm font-medium">{formatDate(detail.close_approach_data[0]?.close_approach_date ?? "")}</p>
                </div>
                <div className="flex items-end">
                  <a
                    href={detail.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    View on NASA JPL
                  </a>
                </div>
              </div>
            </section>

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
