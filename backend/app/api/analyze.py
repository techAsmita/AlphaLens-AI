"""POST /analyze route — the frontend's entry point into the analysis pipeline."""

import logging

from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalysisReport, AnalyzeRequest
from app.services.analysis_service import analyze_company

logger = logging.getLogger(__name__)

router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalysisReport, summary="Analyze a company")
def analyze(request: AnalyzeRequest) -> AnalysisReport:
    """
    Runs the analysis pipeline for the given ticker and returns a
    structured AnalysisReport. Currently backed entirely by
    analysis_service's mock data pipeline (transcript_service +
    news_service); unknown tickers fall back to a generic profile
    rather than erroring.
    """
    ticker = request.ticker.strip()
    if not ticker:
        raise HTTPException(status_code=422, detail="ticker must not be empty")

    try:
        return analyze_company(ticker)
    except Exception:
        logger.exception("analyze_company failed for ticker=%s", ticker)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate analysis report. Please try again.",
        )
