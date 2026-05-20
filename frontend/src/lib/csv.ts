import type { AsteroidSummary } from "@/lib/types"

export function generateCsv(asteroids: AsteroidSummary[], startDate: string, endDate: string): void {
  const headers = [
    "Name",
    "ID",
    "Date",
    "Distance (km)",
    "Diameter Min (km)",
    "Diameter Max (km)",
    "Velocity (km/h)",
    "Hazardous",
  ]

  const rows = asteroids.map((a) => [
    a.name,
    a.id,
    a.close_approach_date,
    a.miss_distance_km.toString(),
    a.estimated_diameter_min_km.toString(),
    a.estimated_diameter_max_km.toString(),
    a.relative_velocity_kph.toString(),
    a.is_potentially_hazardous_asteroid ? "Yes" : "No",
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `nasa-neo-${startDate}-${endDate}.csv`
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
