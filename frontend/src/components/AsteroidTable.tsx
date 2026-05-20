"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistance, formatDiameter, formatVelocity } from "@/lib/format"
import type { AsteroidSummary, SortField, SortDirection } from "@/lib/types"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

interface AsteroidTableProps {
  asteroids: AsteroidSummary[]
  sortField: SortField | null
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onAsteroidClick: (id: string) => void
}

const columns: { key: SortField; label: string; sortable: boolean }[] = [
  { key: "miss_distance_km", label: "Min Distance (km)", sortable: true },
  { key: "estimated_diameter_max_km", label: "Diameter (km)", sortable: true },
  { key: "relative_velocity_kph", label: "Velocity (km/h)", sortable: true },
]

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField | null; sortDirection: SortDirection }) {
  if (sortField !== field) return <ArrowUpDown className="ml-1 inline size-3 text-muted-foreground/50" />

  return sortDirection === "asc"
    ? <ArrowUp className="ml-1 inline size-3" />
    : <ArrowDown className="ml-1 inline size-3" />
}

export function AsteroidTable({ asteroids, sortField, sortDirection, onSort, onAsteroidClick }: AsteroidTableProps) {
  const handleSort = (field: SortField) => {
    onSort(field)
  }

  return (
    <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-48">Name</TableHead>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={col.sortable ? "cursor-pointer select-none" : ""}
              onClick={() => col.sortable && handleSort(col.key)}
              tabIndex={col.sortable ? 0 : undefined}
              onKeyDown={col.sortable ? (e) => e.key === "Enter" && handleSort(col.key) : undefined}
              aria-label={col.sortable ? `Ordina per ${col.label}` : col.label}
            >
              {col.label}
              {col.sortable && (
                <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
              )}
            </TableHead>
          ))}
          <TableHead className="w-24">Hazardous</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {asteroids.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
              Nessun asteroide trovato
            </TableCell>
          </TableRow>
        ) : (
          asteroids.map((asteroid) => (
            <TableRow
              key={asteroid.id}
              className="cursor-pointer"
              onClick={() => onAsteroidClick(asteroid.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onAsteroidClick(asteroid.id)}
              aria-label={`Dettagli per ${asteroid.name}`}
            >
              <TableCell className="font-medium">{asteroid.name}</TableCell>
              <TableCell>{formatDistance(asteroid.miss_distance_km)}</TableCell>
              <TableCell>{formatDiameter(asteroid.estimated_diameter_min_km, asteroid.estimated_diameter_max_km)}</TableCell>
              <TableCell>{formatVelocity(asteroid.relative_velocity_kph)}</TableCell>
              <TableCell>
                {asteroid.is_potentially_hazardous_asteroid ? (
                  <Badge variant="destructive">Yes</Badge>
                ) : (
                  <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">No</Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    </div>
  )
}
