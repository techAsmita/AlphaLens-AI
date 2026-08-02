"""
Centralized application configuration.

All environment-specific values (host/port defaults, CORS origins, log
level, etc.) are read here through pydantic-settings, which loads from
process environment variables first and falls back to a local ``.env``
file (see ``.env.example`` for the full list of supported keys). No
other module should read ``os.environ`` directly — import ``settings``
from here instead, so there is exactly one source of truth for
configuration.
"""

from functools import lru_cache
from typing import List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, overridable via environment variables or a .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # General
    app_name: str = "AlphaLens AI API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS: comma-separated list of allowed origins. Defaults cover the
    # Vite dev server ports used by the AlphaLens frontend.
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    # Logging
    log_level: str = "INFO"

    # Data pipeline providers (Step 9). Each service picks its concrete
    # implementation based on these values — set to anything other than
    # "mock" once a real provider is implemented, and only the relevant
    # service module needs to change, not its callers.
    transcript_provider: str = "mock"
    news_provider: str = "mock"

    # Gemini integration (Step 10). Optional — generate_report() in
    # gemini_service.py raises a clear, catchable error if this isn't
    # set rather than failing at import time, so the app runs fine
    # without it.
    gemini_api_key: Optional[str] = None

    @field_validator("log_level")
    @classmethod
    def _normalize_log_level(cls, value: str) -> str:
        return value.upper()

    @property
    def cors_origins(self) -> List[str]:
        """Parsed list form of ``allowed_origins``, ready for CORSMiddleware."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Returns the cached Settings instance (loaded once per process)."""
    return Settings()


settings = get_settings()
