import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.neo import (
    AsteroidDetail,
    AsteroidSummary,
    CloseApproachData,
    FeedResponse,
    OrbitalData,
)
from app.services.nasa_service import fetch_asteroid_detail, fetch_feed

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/neo", tags=["neo"])


@router.get("/feed", response_model=FeedResponse)
async def get_feed(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
):
    """Get asteroid feed for a date range.

    Supports arbitrary date ranges. The backend splits ranges > 7 days
    into chunks and aggregates results.
    """
    # Validate date format
    try:
        parsed_start = datetime.strptime(start_date, "%Y-%m-%d").date()
        parsed_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Formato data non valido. Usa YYYY-MM-DD.",
        )

    asteroids_data = await fetch_feed(parsed_start, parsed_end)

    asteroids = [AsteroidSummary(**item) for item in asteroids_data]

    return FeedResponse(asteroids=asteroids, total=len(asteroids))


@router.get("/{asteroid_id}", response_model=AsteroidDetail)
async def get_asteroid_detail(asteroid_id: str):
    """Get detailed information for a specific asteroid by NASA ID."""
    detail_data = await fetch_asteroid_detail(asteroid_id)

    close_approaches = [
        CloseApproachData(**item) for item in detail_data["close_approach_data"]
    ]

    orbital = (
        OrbitalData(**detail_data["orbital_data"])
        if detail_data.get("orbital_data")
        else None
    )

    return AsteroidDetail(
        id=detail_data["id"],
        name=detail_data["name"],
        nasa_jpl_url=detail_data["nasa_jpl_url"],
        estimated_diameter_min_km=detail_data["estimated_diameter_min_km"],
        estimated_diameter_max_km=detail_data["estimated_diameter_max_km"],
        estimated_diameter_min_m=detail_data["estimated_diameter_min_m"],
        estimated_diameter_max_m=detail_data["estimated_diameter_max_m"],
        estimated_diameter_min_miles=detail_data["estimated_diameter_min_miles"],
        estimated_diameter_max_miles=detail_data["estimated_diameter_max_miles"],
        estimated_diameter_min_feet=detail_data["estimated_diameter_min_feet"],
        estimated_diameter_max_feet=detail_data["estimated_diameter_max_feet"],
        is_potentially_hazardous_asteroid=detail_data[
            "is_potentially_hazardous_asteroid"
        ],
        close_approach_data=close_approaches,
        orbital_data=orbital,
    )
