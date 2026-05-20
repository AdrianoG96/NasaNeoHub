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

export interface CloseApproachData {
  close_approach_date: string
  miss_distance_km: number
  relative_velocity_kph: number
}

export interface OrbitalData {
  orbit_id: string | null
  orbit_determination_date: string | null
  orbit_uncertainty: string | null
  minimum_orbit_intersection: string | null
  jupiter_tisserand_invariant: string | null
  eccentricity: string | null
  semi_major_axis: string | null
  inclination: string | null
  ascending_node_longitude: string | null
  orbital_period: string | null
  perihelion_distance: string | null
  perihelion_argument: string | null
  aphelion_distance: string | null
  perihelion_time: string | null
  mean_anomaly: string | null
  mean_motion: string | null
  equinox: string | null
}

export interface AsteroidDetail {
  id: string
  name: string
  nasa_jpl_url: string
  estimated_diameter_min_km: number
  estimated_diameter_max_km: number
  estimated_diameter_min_m: number
  estimated_diameter_max_m: number
  estimated_diameter_min_miles: number
  estimated_diameter_max_miles: number
  estimated_diameter_min_feet: number
  estimated_diameter_max_feet: number
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: CloseApproachData[]
  orbital_data: OrbitalData | null
}

export interface FeedResponse {
  asteroids: AsteroidSummary[]
  total: number
}

export type HazardousFilterValue = "all" | "hazardous" | "non-hazardous"

export type SortField = "miss_distance_km" | "estimated_diameter_max_km" | "relative_velocity_kph"

export type SortDirection = "asc" | "desc"
