"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { ErrorAlert } from "@/components/ErrorAlert"
import { EmptyState } from "@/components/EmptyState"
import { DashboardTabs } from "@/components/DashboardTabs"
import { DiscoveryBadges, incrementSearchCount } from "@/components/DiscoveryBadges"
import { AsteroidCompare } from "@/components/AsteroidCompare"
import { GlossaryDialog } from "@/components/GlossaryDialog"
import { AsteroidDetail } from "@/components/AsteroidDetail"
import { fetchAsteroidFeed } from "@/lib/api"
import { Search, BookOpen, ArrowLeftRight } from "lucide-react"
import type { AsteroidSummary, HazardousFilterValue, SortField, SortDirection } from "@/lib/types"

export function AsteroidDashboard() {
  const [asteroids, setAsteroids] = useState<AsteroidSummary[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hazardousFilter, setHazardousFilter] = useState<HazardousFilterValue>("all")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string | null>(null)
  const [currentRange, setCurrentRange] = useState<{ start: string; end: string } | null>(null)

  const filteredAsteroids = useMemo(() => {
    let result = [...asteroids]

    if (hazardousFilter === "hazardous") {
      result = result.filter((a) => a.is_potentially_hazardous_asteroid)
    } else if (hazardousFilter === "non-hazardous") {
      result = result.filter((a) => !a.is_potentially_hazardous_asteroid)
    }

    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      })
    }

    return result
  }, [asteroids, hazardousFilter, sortField, sortDirection])

  const hazardousCount = useMemo(
    () => asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length,
    [asteroids]
  )

  const handleSearch = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true)
    setError(null)
    setAsteroids([])
    setTotal(0)
    setCurrentRange({ start: startDate, end: endDate })

    try {
      const data = await fetchAsteroidFeed(startDate, endDate)
      setAsteroids(data.asteroids)
      setTotal(data.total)
      incrementSearchCount()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento dei dati")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))
        return field
      }
      setSortDirection("asc")
      return field
    })
  }, [])

  const handleAsteroidClick = useCallback((id: string) => {
    setSelectedAsteroidId(id)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Search Card */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="size-5 text-blue-400" />
            Search Asteroids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeSelector onSearch={handleSearch} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Top Bar: Badges + Actions */}
      {asteroids.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DiscoveryBadges asteroids={asteroids} />
          <div className="flex items-center gap-2">
            <AsteroidCompare asteroids={filteredAsteroids} />
            <GlossaryDialog />
          </div>
        </div>
      )}

      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      )}

      {asteroids.length > 0 && (
        <DashboardTabs
          asteroids={asteroids}
          filteredAsteroids={filteredAsteroids}
          total={total}
          isLoading={isLoading}
          hazardousCount={hazardousCount}
          hazardousFilter={hazardousFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          currentRange={currentRange}
          onSetHazardousFilter={setHazardousFilter}
          onSort={handleSort}
          onAsteroidClick={handleAsteroidClick}
        />
      )}

      {!isLoading && asteroids.length === 0 && !error && (
        <EmptyState
          title="Select a date range to begin"
          subtitle="Choose a start and end date, then click Search to explore near-Earth asteroids."
        />
      )}

      {!isLoading && asteroids.length > 0 && filteredAsteroids.length === 0 && (
        <EmptyState
          title="No asteroids match the filter"
          subtitle="Try changing the Hazardous filter to see more results."
        />
      )}

      <AsteroidDetail
        asteroidId={selectedAsteroidId}
        onClose={() => setSelectedAsteroidId(null)}
      />
    </div>
  )
}


