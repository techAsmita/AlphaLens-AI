"""Schemas for the structured output of analysis_service.analyze_company()."""

from typing import Literal, Optional

from pydantic import BaseModel

SignalStatus = Literal["RISK", "WATCH", "NEUTRAL"]
EvidenceSource = Literal["Earnings Call", "SEC Filing", "News"]


class AnalysisSignal(BaseModel):
    """A single detected signal."""

    id: str
    title: str
    status: SignalStatus
    confidence: int
    summary: str


class AnalysisEvidence(BaseModel):
    """The evidence backing one signal, joined to it by signal_id."""

    signal_id: str
    source: EvidenceSource
    quote: str
    why_it_matters: str
    related_evidence: list[str]


class AnalysisTimelineEntry(BaseModel):
    """A single step in the analysis run's timeline."""

    time: str
    label: str


class AnalysisReport(BaseModel):
    """
    Full structured output of analyze_company(). This is the contract
    the rest of the system (and now the frontend, see POST /analyze)
    depends on — it stays the same whether the data underneath comes
    from mocks or real providers.
    """

    ticker: str
    company: str
    sector: str
    market_status: str
    confidence: float
    summary: str
    signals: list[AnalysisSignal]
    evidence: list[AnalysisEvidence]
    timeline: list[AnalysisTimelineEntry]
    generated_at: str
    sources: Optional[dict] = None


class AnalyzeRequest(BaseModel):
    """Request body for POST /analyze."""

    ticker: str
