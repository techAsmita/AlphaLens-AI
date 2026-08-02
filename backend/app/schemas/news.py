"""Schemas for financial news data."""

from pydantic import BaseModel


class NewsArticle(BaseModel):
    """A single news article relevant to a company."""

    title: str
    source: str
    summary: str
    published_at: str


class NewsData(BaseModel):
    """News data for a company, as returned by the news service."""

    ticker: str
    articles: list[NewsArticle]
    fetched_at: str
