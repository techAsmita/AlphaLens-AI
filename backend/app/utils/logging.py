"""
Application-wide logging configuration.

``configure_logging()`` is called once, at startup, from ``app.main``.
It sets a consistent formatter and level across the root logger and
uvicorn's own loggers, so every log line — ours and uvicorn's access
logs — looks the same and respects the configured LOG_LEVEL.
"""

import logging
import sys

from app.utils.config import settings

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging() -> None:
    """Configures root and uvicorn loggers to a single consistent format."""
    level = getattr(logging, settings.log_level, logging.INFO)

    formatter = logging.Formatter(fmt=LOG_FORMAT, datefmt=DATE_FORMAT)

    handler = logging.StreamHandler(stream=sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    # Avoid duplicate handlers if configure_logging() is ever called
    # more than once (e.g. under --reload).
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        uvicorn_logger = logging.getLogger(logger_name)
        uvicorn_logger.handlers.clear()
        uvicorn_logger.addHandler(handler)
        uvicorn_logger.setLevel(level)
        uvicorn_logger.propagate = False


def get_logger(name: str) -> logging.Logger:
    """Returns a module-level logger; call after configure_logging() has run."""
    return logging.getLogger(name)
