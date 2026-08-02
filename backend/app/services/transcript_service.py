"""
Transcript retrieval service.

Fetches earnings call transcript data for a company. Today the only
implementation is MockTranscriptProvider (canned data, no network
calls). To integrate a real transcript API later:

  1. Add a new class implementing TranscriptProvider (e.g.
     ``SeekingAlphaTranscriptProvider``) with its own ``fetch()``.
  2. Branch on ``settings.transcript_provider`` in
     ``get_transcript_service()`` below to return it.

Nothing that calls ``get_transcript_service()`` (analysis_service, or
any future API route) needs to change.
"""

from abc import ABC, abstractmethod
from datetime import datetime, timezone

from app.schemas.transcript import TranscriptData, TranscriptQuote
from app.utils.config import settings


class TranscriptProvider(ABC):
    """Abstract interface every transcript provider must implement."""

    @abstractmethod
    def fetch(self, ticker: str) -> TranscriptData:
        """Returns the latest earnings call transcript data for a ticker."""
        raise NotImplementedError


# Canned transcript content per ticker. Mirrors the shape a real
# transcript API would hand back: a short summary plus a handful of
# attributed quotes.
_MOCK_TRANSCRIPTS: dict[str, dict] = {
    "INFY": {
        "summary": "Management struck a more cautious tone on demand recovery and flagged margin pressure from input costs.",
        "quotes": [
            {"speaker": "CFO", "quote": "We remain cautious about demand recovery in key markets."},
            {"speaker": "CEO", "quote": "We're taking a more measured approach this quarter."},
        ],
    },
    "TCS": {
        "summary": "Large-deal momentum is moderating while workforce metrics stay stable.",
        "quotes": [
            {"speaker": "CEO", "quote": "Large deal momentum is moderating compared to last year."},
            {"speaker": "CHRO", "quote": "Attrition has stabilized within our target range."},
        ],
    },
    "AAPL": {
        "summary": "Demand commentary was more measured while services growth stayed roughly in line with expectations.",
        "quotes": [
            {"speaker": "CEO", "quote": "We're seeing a more normalized demand environment in certain markets."},
            {"speaker": "CFO", "quote": "Services revenue grew in line with our expectations for the period."},
        ],
    },
    "NVDA": {
        "summary": "Demand for data center platforms remains strong, though management flagged export policy as a growing watch item.",
        "quotes": [
            {"speaker": "CEO", "quote": "Demand for our data center platforms continues to outpace supply."},
            {"speaker": "CFO", "quote": "Changes in export regulations could impact our ability to ship certain products."},
        ],
    },
    "RELIANCE": {
        "summary": "Capex phasing shifted later in the year while refining margins drew a notably more cautious tone.",
        "quotes": [
            {"speaker": "CFO", "quote": "We expect capital expenditure to be more weighted toward the second half."},
            {"speaker": "CEO", "quote": "Refining margins are likely to remain under pressure in the near term."},
        ],
    },
}

_DEFAULT_TRANSCRIPT = {
    "summary": "Management commentary was largely consistent with prior guidance, with modest caution on near-term margins.",
    "quotes": [
        {"speaker": "CFO", "quote": "We remain cautious about demand recovery."},
        {"speaker": "CEO", "quote": "We're taking a more measured approach this quarter."},
    ],
}


class MockTranscriptProvider(TranscriptProvider):
    """Returns canned transcript content. No network calls, no API key needed."""

    def fetch(self, ticker: str) -> TranscriptData:
        raw = _MOCK_TRANSCRIPTS.get(ticker.upper(), _DEFAULT_TRANSCRIPT)
        return TranscriptData(
            ticker=ticker.upper(),
            summary=raw["summary"],
            quotes=[TranscriptQuote(**quote) for quote in raw["quotes"]],
            fetched_at=datetime.now(timezone.utc).isoformat(),
        )


def get_transcript_service() -> TranscriptProvider:
    """Returns the transcript provider configured via TRANSCRIPT_PROVIDER."""
    if settings.transcript_provider == "mock":
        return MockTranscriptProvider()
    raise ValueError(f"Unknown transcript provider: {settings.transcript_provider!r}")
