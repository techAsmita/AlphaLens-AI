"""Schemas for earnings call transcript data."""

from pydantic import BaseModel


class TranscriptQuote(BaseModel):
    """A single attributed quote pulled from a transcript."""

    speaker: str
    quote: str


class TranscriptData(BaseModel):
    """Transcript data for a company, as returned by the transcript service."""

    ticker: str
    source: str = "Earnings Call"
    summary: str
    quotes: list[TranscriptQuote]
    fetched_at: str
