from datetime import date

from pydantic import BaseModel, Field


class CloseApproachData(BaseModel):
    close_approach_date: date
    miss_distance_km: float
    relative_velocity_kph: float


class OrbitalData(BaseModel):
    orbit_id: str | None = None
    orbit_determination_date: str | None = None
    orbit_uncertainty: str | None = None
    minimum_orbit_intersection: str | None = None
    jupiter_tisserand_invariant: str | None = None
    eccentricity: str | None = None
    semi_major_axis: str | None = None
    inclination: str | None = None
    ascending_node_longitude: str | None = None
    orbital_period: str | None = None
    perihelion_distance: str | None = None
    perihelion_argument: str | None = None
    aphelion_distance: str | None = None
    perihelion_time: str | None = None
    mean_anomaly: str | None = None
    mean_motion: str | None = None
    equinox: str | None = None


class AsteroidSummary(BaseModel):
    id: str
    name: str
    estimated_diameter_min_km: float
    estimated_diameter_max_km: float
    close_approach_date: date
    miss_distance_km: float
    relative_velocity_kph: float
    is_potentially_hazardous_asteroid: bool
    nasa_jpl_url: str


class AsteroidDetail(BaseModel):
    id: str
    name: str
    nasa_jpl_url: str
    estimated_diameter_min_km: float
    estimated_diameter_max_km: float
    estimated_diameter_min_m: float
    estimated_diameter_max_m: float
    estimated_diameter_min_miles: float
    estimated_diameter_max_miles: float
    estimated_diameter_min_feet: float
    estimated_diameter_max_feet: float
    is_potentially_hazardous_asteroid: bool
    close_approach_data: list[CloseApproachData]
    orbital_data: OrbitalData | None = None


class FeedResponse(BaseModel):
    asteroids: list[AsteroidSummary]
    total: int


class ErrorResponse(BaseModel):
    detail: str
