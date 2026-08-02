"""Response schema for the health check endpoint."""

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    """Shape returned by GET /health."""

    model_config = ConfigDict(
        json_schema_extra={"example": {"status": "healthy"}}
    )

    status: str
