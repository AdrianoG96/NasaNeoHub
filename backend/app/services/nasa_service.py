import logging
from datetime import date, timedelta

import httpx
from aiocache import cached
from aiocache.serializers import JsonSerializer
from fastapi import HTTPException, status

from app.core.config import settings

logger = logging.getLogger(__name__)

NASA_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed"
NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/neo"


def _chunk_date_range(start_date: date, end_date: date) -> list[tuple[date, date]]:
    """Split a date range into chunks of max 7 days (NASA API limit)."""
    chunks: list[tuple[date, date]] = []
    current = start_date
    while current <= end_date:
        chunk_end = min(current + timedelta(days=6), end_date)
        chunks.append((current, chunk_end))
        current = chunk_end + timedelta(days=1)
    return chunks


def _parse_asteroid_summary(raw: dict, approach_date: str) -> dict:
    """Parse a raw NASA asteroid dict into a summary dict."""
    diameter = raw.get("estimated_diameter", {}).get("kilometers", {})
    close_approach = raw.get("close_approach_data", [{}])[0]
    miss_distance = close_approach.get("miss_distance", {})
    velocity = close_approach.get("relative_velocity", {})

    return {
        "id": raw.get("id", ""),
        "name": raw.get("name", ""),
        "estimated_diameter_min_km": _safe_float(diameter.get("estimated_diameter_min")),
        "estimated_diameter_max_km": _safe_float(diameter.get("estimated_diameter_max")),
        "close_approach_date": approach_date,
        "miss_distance_km": _safe_float(miss_distance.get("kilometers")),
        "relative_velocity_kph": _safe_float(velocity.get("kilometers_per_hour")),
        "is_potentially_hazardous_asteroid": raw.get(
            "is_potentially_hazardous_asteroid", False
        ),
        "nasa_jpl_url": raw.get("nasa_jpl_url", ""),
    }


def _safe_float(value: str | float | int | None) -> float:
    """Safely convert a value to float, returning 0.0 if None or invalid."""
    if value is None:
        return 0.0
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def _handle_nasa_error(response: httpx.Response) -> None:
    """Translate NASA HTTP errors into user-friendly FastAPI exceptions."""
    if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        logger.warning("NASA rate limit reached")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit NASA raggiunto. Riprova più tardi.",
        )
    if response.status_code == status.HTTP_404_NOT_FOUND:
        logger.warning("NASA resource not found: %s", response.url)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asteroide non trovato.",
        )
    if response.status_code >= 500:
        logger.error("NASA server error: %d %s", response.status_code, response.text[:200])
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Errore dal servizio NASA. Riprova più tardi.",
        )
    # Fallback for other unexpected status codes
    logger.error("Unexpected NASA response: %d %s", response.status_code, response.text[:200])
    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Errore imprevisto dal servizio NASA. Riprova più tardi.",
    )


def _feed_cache_key_builder(f, start_date: date, end_date: date) -> str:
    """Build a cache key for the feed endpoint."""
    return f"feed:{start_date.isoformat()}:{end_date.isoformat()}"


def _detail_cache_key_builder(f, asteroid_id: str) -> str:
    """Build a cache key for the detail endpoint."""
    return f"detail:{asteroid_id}"


async def _fetch_feed_from_nasa(start_date: date, end_date: date) -> list[dict]:
    """Internal function: fetch asteroids from NASA NeoWs feed.

    This function is cached. Validation (start > end) must happen before calling it.
    """
    chunks = _chunk_date_range(start_date, end_date)
    seen_ids: set[str] = set()
    all_asteroids: list[dict] = []

    params = {"api_key": settings.nasa_api_key}

    async with httpx.AsyncClient(timeout=30.0) as client:
        for chunk_start, chunk_end in chunks:
            chunk_params = {
                **params,
                "start_date": chunk_start.isoformat(),
                "end_date": chunk_end.isoformat(),
            }

            try:
                response = await client.get(NASA_FEED_URL, params=chunk_params)
            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                logger.error("NASA connection error: %s", exc)
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Servizio temporaneamente non disponibile.",
                )

            if response.is_error:
                _handle_nasa_error(response)

            data = response.json()
            near_earth_objects = data.get("near_earth_objects", {})

            for approach_date, asteroids in near_earth_objects.items():
                for raw_asteroid in asteroids:
                    asteroid_id = raw_asteroid.get("id")
                    if asteroid_id and asteroid_id not in seen_ids:
                        seen_ids.add(asteroid_id)
                        all_asteroids.append(
                            _parse_asteroid_summary(raw_asteroid, approach_date)
                        )

    # Sort by close_approach_date
    all_asteroids.sort(key=lambda a: a["close_approach_date"])
    return all_asteroids


async def _fetch_detail_from_nasa(asteroid_id: str) -> dict:
    """Internal function: fetch detailed data for a single asteroid from NASA.

    This function is cached.
    """
    params = {"api_key": settings.nasa_api_key}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(
                f"{NASA_NEO_URL}/{asteroid_id}", params=params
            )
        except (httpx.TimeoutException, httpx.ConnectError) as exc:
            logger.error("NASA connection error: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Servizio temporaneamente non disponibile.",
            )

        if response.is_error:
            _handle_nasa_error(response)

        raw = response.json()

    diameter_km = raw.get("estimated_diameter", {}).get("kilometers", {})
    diameter_m = raw.get("estimated_diameter", {}).get("meters", {})
    diameter_miles = raw.get("estimated_diameter", {}).get("miles", {})
    diameter_feet = raw.get("estimated_diameter", {}).get("feet", {})

    close_approach_data = []
    for approach in raw.get("close_approach_data", []):
        close_approach_data.append(
            {
                "close_approach_date": approach.get("close_approach_date", ""),
                "miss_distance_km": _safe_float(
                    approach.get("miss_distance", {}).get("kilometers")
                ),
                "relative_velocity_kph": _safe_float(
                    approach.get("relative_velocity", {}).get("kilometers_per_hour")
                ),
            }
        )

    orbital_raw = raw.get("orbital_data", {}) or {}
    orbital_data = {
        "orbit_id": orbital_raw.get("orbit_id"),
        "orbit_determination_date": orbital_raw.get("orbit_determination_date"),
        "orbit_uncertainty": orbital_raw.get("orbit_uncertainty"),
        "minimum_orbit_intersection": orbital_raw.get("minimum_orbit_intersection"),
        "jupiter_tisserand_invariant": orbital_raw.get("jupiter_tisserand_invariant"),
        "eccentricity": orbital_raw.get("eccentricity"),
        "semi_major_axis": orbital_raw.get("semi_major_axis"),
        "inclination": orbital_raw.get("inclination"),
        "ascending_node_longitude": orbital_raw.get("ascending_node_longitude"),
        "orbital_period": orbital_raw.get("orbital_period"),
        "perihelion_distance": orbital_raw.get("perihelion_distance"),
        "perihelion_argument": orbital_raw.get("perihelion_argument"),
        "aphelion_distance": orbital_raw.get("aphelion_distance"),
        "perihelion_time": orbital_raw.get("perihelion_time"),
        "mean_anomaly": orbital_raw.get("mean_anomaly"),
        "mean_motion": orbital_raw.get("mean_motion"),
        "equinox": orbital_raw.get("equinox"),
    }

    return {
        "id": raw.get("id", ""),
        "name": raw.get("name", ""),
        "nasa_jpl_url": raw.get("nasa_jpl_url", ""),
        "estimated_diameter_min_km": _safe_float(diameter_km.get("estimated_diameter_min")),
        "estimated_diameter_max_km": _safe_float(diameter_km.get("estimated_diameter_max")),
        "estimated_diameter_min_m": _safe_float(diameter_m.get("estimated_diameter_min")),
        "estimated_diameter_max_m": _safe_float(diameter_m.get("estimated_diameter_max")),
        "estimated_diameter_min_miles": _safe_float(diameter_miles.get("estimated_diameter_min")),
        "estimated_diameter_max_miles": _safe_float(diameter_miles.get("estimated_diameter_max")),
        "estimated_diameter_min_feet": _safe_float(diameter_feet.get("estimated_diameter_min")),
        "estimated_diameter_max_feet": _safe_float(diameter_feet.get("estimated_diameter_max")),
        "is_potentially_hazardous_asteroid": raw.get(
            "is_potentially_hazardous_asteroid", False
        ),
        "close_approach_data": close_approach_data,
        "orbital_data": orbital_data,
    }


# Apply caching decorators to the internal functions
_fetch_feed_from_nasa = cached(
    ttl=settings.cache_ttl,
    serializer=JsonSerializer(),
    key_builder=_feed_cache_key_builder,
)(_fetch_feed_from_nasa)

_fetch_detail_from_nasa = cached(
    ttl=settings.cache_ttl,
    serializer=JsonSerializer(),
    key_builder=_detail_cache_key_builder,
)(_fetch_detail_from_nasa)


async def fetch_feed(start_date: date, end_date: date) -> list[dict]:
    """Fetch asteroids from NASA NeoWs feed, handling arbitrary date ranges.

    Validates input, then delegates to cached internal function.
    """
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="La data di inizio non può essere successiva alla data di fine.",
        )

    return await _fetch_feed_from_nasa(start_date, end_date)


async def fetch_asteroid_detail(asteroid_id: str) -> dict:
    """Fetch detailed data for a single asteroid from NASA /neo/{id}.

    Delegates to cached internal function.
    """
    return await _fetch_detail_from_nasa(asteroid_id)
