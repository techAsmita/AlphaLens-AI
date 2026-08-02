"""
News retrieval service.

Fetches recent financial news relevant to a company. Today the only
implementation is MockNewsProvider (canned data, no network calls). To
integrate a real news API later:

  1. Add a new class implementing NewsProvider (e.g.
     ``NewsApiProvider``) with its own ``fetch()``.
  2. Branch on ``settings.news_provider`` in ``get_news_service()``
     below to return it.

Nothing that calls ``get_news_service()`` (analysis_service, or any
future API route) needs to change.
"""

from abc import ABC, abstractmethod
from datetime import datetime, timezone

from app.schemas.news import NewsArticle, NewsData
from app.utils.config import settings


class NewsProvider(ABC):
    """Abstract interface every news provider must implement."""

    @abstractmethod
    def fetch(self, ticker: str) -> NewsData:
        """Returns recent news articles relevant to a ticker."""
        raise NotImplementedError


# Canned news content per ticker. Mirrors the shape a real news API
# would hand back: a handful of articles with title, source, and a
# short summary.
_MOCK_NEWS: dict[str, list[dict]] = {
    "INFY": [
        {
            "title": "Infosys earnings draw cautious analyst reaction",
            "source": "Reuters",
            "summary": "Coverage described the outlook as measured rather than optimistic following the results.",
        },
        {
            "title": "IT services sector faces margin scrutiny",
            "source": "Economic Times",
            "summary": "Analysts flagged input cost pressure as a recurring theme across the sector this quarter.",
        },
    ],
    "TCS": [
        {
            "title": "TCS deal pipeline growth moderates",
            "source": "Mint",
            "summary": "Coverage noted steady reliance on top accounts amid slower large-deal bookings.",
        },
    ],
    "AAPL": [
        {
            "title": "Regulators eye App Store practices",
            "source": "Bloomberg",
            "summary": "Regulators in multiple regions signaled closer review of App Store practices.",
        },
    ],
    "NVDA": [
        {
            "title": "Export policy in focus for chipmakers",
            "source": "Reuters",
            "summary": "Reports highlighted export regulation as an emerging watch item for the sector.",
        },
    ],
    "RELIANCE": [
        {
            "title": "Telecom tariff hikes may face delay",
            "source": "Business Standard",
            "summary": "Reports suggested further tariff hikes may be delayed pending regulatory review.",
        },
    ],
}

_DEFAULT_NEWS: list[dict] = [
    {
        "title": "Analysts react to quarterly results",
        "source": "Wire Service",
        "summary": "Coverage was mixed, with analysts flagging both stable fundamentals and pockets of caution.",
    },
]


class MockNewsProvider(NewsProvider):
    """Returns canned news content. No network calls, no API key needed."""

    def fetch(self, ticker: str) -> NewsData:
        raw = _MOCK_NEWS.get(ticker.upper(), _DEFAULT_NEWS)
        now = datetime.now(timezone.utc).isoformat()
        return NewsData(
            ticker=ticker.upper(),
            articles=[NewsArticle(published_at=now, **article) for article in raw],
            fetched_at=now,
        )


def get_news_service() -> NewsProvider:
    """Returns the news provider configured via NEWS_PROVIDER."""
    if settings.news_provider == "mock":
        return MockNewsProvider()
    raise ValueError(f"Unknown news provider: {settings.news_provider!r}")
