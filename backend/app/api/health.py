"""Health check route."""

from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.services.health_service import get_health_status

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="Health check")
def health() -> HealthResponse:
    """Returns {"status": "healthy"} when the API process is up and serving requests."""
    return get_health_status()
