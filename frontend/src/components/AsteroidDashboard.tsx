"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { HazardousFilter } from "@/components/HazardousFilter"
import { AsteroidTable } from "@/components/AsteroidTable"
import { TableSkeleton } from "@/components/TableSkeleton"
import { ErrorAlert } from "@/components/ErrorAlert"
import { EmptyState } from "@/components/EmptyState"
import { BarChart3, ScatterChartIcon } from "lucide-react"
import { fetchAsteroidFeed } from "@/lib/api"
import { DistanceScatterChart } from "@/components/DistanceScatterChart"
import { DiameterBarChart } from "@/components/DiameterBarChart"
import { AsteroidDetail } from "@/components/AsteroidDetail"
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

  const handleSearch = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true)
    setError(null)
    setAsteroids([])
    setTotal(0)

    try {
      const data = await fetchAsteroidFeed(startDate, endDate)
      setAsteroids(data.asteroids)
      setTotal(data.total)
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Asteroids</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeSelector onSearch={handleSearch} isLoading={isLoading} />
        </CardContent>
      </Card>

      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      )}

      {asteroids.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScatterChartIcon className="size-5" />
                Distance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <DistanceScatterChart asteroids={filteredAsteroids} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Diameter Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <DiameterBarChart asteroids={filteredAsteroids} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asteroids</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <HazardousFilter
                value={hazardousFilter}
                onChange={setHazardousFilter}
                totalCount={total}
                filteredCount={filteredAsteroids.length}
              />
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <AsteroidTable
                  asteroids={filteredAsteroids}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onAsteroidClick={handleAsteroidClick}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!isLoading && asteroids.length === 0 && !error && (
        <EmptyState
          title="Seleziona un intervallo di date"
          subtitle="Scegli una data di inizio e fine, poi clicca Search per esplorare gli asteroidi vicini alla Terra."
        />
      )}

      {!isLoading && asteroids.length > 0 && filteredAsteroids.length === 0 && (
        <EmptyState
          title="Nessun asteroide corrisponde al filtro"
          subtitle="Prova a cambiare il filtro Hazardous per vedere più risultati."
        />
      )}

      <AsteroidDetail
        asteroidId={selectedAsteroidId}
        onClose={() => setSelectedAsteroidId(null)}
      />
    </div>
  )
}
