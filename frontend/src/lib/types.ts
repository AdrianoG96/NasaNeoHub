export interface AsteroidSummary {
  id: string
  name: string
  estimated_diameter_min_km: number
  estimated_diameter_max_km: number
  close_approach_date: string
  miss_distance_km: number
  relative_velocity_kph: number
  is_potentially_hazardous_asteroid: boolean
  nasa_jpl_url: string
}

export interface FeedResponse {
  asteroids: AsteroidSummary[]
  total: number
}

export type HazardousFilterValue = "all" | "hazardous" | "non-hazardous"

export type SortField = "miss_distance_km" | "estimated_diameter_max_km" | "relative_velocity_kph"

export type SortDirection = "asc" | "desc"
