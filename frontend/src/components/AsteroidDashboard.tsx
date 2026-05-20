"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { HazardousFilter } from "@/components/HazardousFilter"
import { AsteroidTable } from "@/components/AsteroidTable"
import { TableSkeleton } from "@/components/TableSkeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchAsteroidFeed } from "@/lib/api"
import type { AsteroidSummary, HazardousFilterValue, SortField, SortDirection } from "@/lib/types"

export function AsteroidDashboard() {
  const [asteroids, setAsteroids] = useState<AsteroidSummary[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hazardousFilter, setHazardousFilter] = useState<HazardousFilterValue>("all")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

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
    // Will be implemented in a future milestone (asteroid detail)
    console.log("Asteroid clicked:", id)
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
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {asteroids.length > 0 && (
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
      )}

      {!isLoading && asteroids.length === 0 && !error && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Select a date range and click Search to explore near-Earth asteroids.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
