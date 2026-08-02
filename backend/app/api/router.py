"""
Aggregated API router.

New route modules should be added here (imported and included) rather
than wired up individually in ``app.main`` — that keeps main.py focused
purely on app construction/middleware and lets the route surface grow
without touching it.
"""

from fastapi import APIRouter

from app.api import analyze, health

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(analyze.router)
