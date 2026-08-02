"""
Health check business logic.

Kept separate from the route handler in ``app.api.health`` so that as
real dependencies are introduced (a database, a cache, an upstream
API), the checks they need can be added here without touching the
route layer. For now there are no external dependencies to verify, so
the service simply reports that the process is up and serving
requests.
"""

from app.schemas.health import HealthResponse


def get_health_status() -> HealthResponse:
    """Returns the current health status of the service."""
    return HealthResponse(status="healthy")
