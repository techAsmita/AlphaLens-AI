"""
Gemini integration service.

generate_report() sends fetched transcript and news content to
Google's Gemini API and asks it to synthesize a structured signals
report from that real content — as opposed to the static, per-ticker
mock signal definitions analysis_service uses today.

Requires GEMINI_API_KEY to be set (see .env.example). This module is
safe to import with no key configured — the SDK client is only built
lazily, on the first actual call to generate_report(), so importing it
(and therefore starting the app) never fails just because the key is
missing. Calling generate_report() without a key raises
GeminiNotConfiguredError, a normal catchable exception rather than a
crash.

Not wired into analysis_service.analyze_company() yet — that still
runs entirely on mock data (see Step 9). This module is the
integration point a future step can call into.
"""

import json
import logging
from typing import Any, Dict

from app.schemas.news import NewsData
from app.schemas.transcript import TranscriptData
from app.utils.config import settings

logger = logging.getLogger(__name__)

_MODEL_NAME = "gemini-1.5-flash"

_SYSTEM_INSTRUCTION = (
    "You are AlphaLens AI, a financial signal detection engine. Given an "
    "earnings call transcript and recent news for a company, you identify "
    "market-moving signals grounded strictly in the provided material — "
    "never invent facts, figures, or quotes that aren't present in the "
    "input. You respond only with valid JSON, no prose, no markdown "
    "code fences."
)

_RESPONSE_SCHEMA_HINT = """Respond with JSON matching exactly this shape:
{
  "summary": "<one sentence synthesizing the overall picture>",
  "signals": [
    {
      "id": "<kebab-case-slug>",
      "title": "<short signal title>",
      "status": "RISK" | "WATCH" | "NEUTRAL",
      "confidence": <integer 0-100>,
      "summary": "<one sentence describing the signal>",
      "source": "Earnings Call" | "SEC Filing" | "News",
      "quote": "<short supporting quote pulled from the input material>",
      "why_it_matters": "<one sentence explaining the significance>",
      "related_evidence": ["<short reference>", "<short reference>"]
    }
  ]
}
Identify between 3 and 5 signals."""


class GeminiNotConfiguredError(RuntimeError):
    """Raised when generate_report() is called without GEMINI_API_KEY set."""


class GeminiResponseError(RuntimeError):
    """Raised when Gemini's response couldn't be parsed as the expected JSON shape."""


def _build_prompt(transcript: TranscriptData, news: NewsData) -> str:
    quotes_block = (
        "\n".join(f"- ({quote.speaker}) {quote.quote}" for quote in transcript.quotes)
        or "(no quotes available)"
    )
    news_block = (
        "\n".join(f"- [{article.source}] {article.title}: {article.summary}" for article in news.articles)
        or "(no articles available)"
    )

    return f"""Analyze the following earnings call transcript and recent news for {transcript.ticker} and identify market-moving signals.

TRANSCRIPT SUMMARY:
{transcript.summary}

TRANSCRIPT QUOTES:
{quotes_block}

RECENT NEWS:
{news_block}

{_RESPONSE_SCHEMA_HINT}"""


def _get_model():
    """Lazily constructs the Gemini client. Only called from generate_report()."""
    if not settings.gemini_api_key:
        raise GeminiNotConfiguredError(
            "GEMINI_API_KEY is not set. Add it to your environment or .env file "
            "to use gemini_service.generate_report()."
        )

    try:
        import google.generativeai as genai
    except ImportError as exc:  # pragma: no cover - defensive, requirements.txt installs this
        raise RuntimeError(
            "google-generativeai is not installed. Run `pip install -r requirements.txt`."
        ) from exc

    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel(_MODEL_NAME, system_instruction=_SYSTEM_INSTRUCTION)


def generate_report(transcript: TranscriptData, news: NewsData) -> Dict[str, Any]:
    """
    Sends transcript + news content to Gemini and returns the parsed
    structured JSON response (a dict with "summary" and "signals" keys
    — see _RESPONSE_SCHEMA_HINT above for the exact shape).

    Raises:
        GeminiNotConfiguredError: GEMINI_API_KEY isn't set.
        GeminiResponseError: Gemini's response wasn't valid JSON.
    """
    model = _get_model()
    prompt = _build_prompt(transcript, news)

    logger.info("Calling Gemini (%s) for %s", _MODEL_NAME, transcript.ticker)

    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"},
    )

    raw_text = response.text

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise GeminiResponseError(
            f"Gemini returned output that wasn't valid JSON: {raw_text[:200]!r}"
        ) from exc

    if not isinstance(data, dict) or "signals" not in data:
        raise GeminiResponseError(
            f"Gemini's JSON response is missing the expected 'signals' key: {data!r}"
        )

    logger.info("Gemini returned %d signal(s) for %s", len(data.get("signals", [])), transcript.ticker)
    return data
