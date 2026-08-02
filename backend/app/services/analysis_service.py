"""
Company analysis service — the top of the data pipeline.

analyze_company() pulls a transcript (transcript_service) and recent
news (news_service), then produces a structured AnalysisReport: a set
of detected signals, the evidence backing each one, and a run
timeline. The signal/evidence *definitions* (title, status, confidence,
why-it-matters copy) are still mocked per ticker below, but the actual
quotes attached to "Earnings Call" and "News" evidence are pulled live
from whatever transcript_service and news_service return — so swapping
either of those for a real provider immediately changes what shows up
here, with no changes needed in this module.

The one piece that's still fully mocked in-place (not pulled from a
sub-service) is which signals get flagged and why. A future step could
replace that with a real NLP/LLM pass over the transcript and news
content; analyze_company()'s return shape (AnalysisReport) is designed
to stay the same either way.
"""

from datetime import datetime, timezone
from itertools import cycle
from typing import Iterator, Optional

from app.schemas.analysis import (
    AnalysisEvidence,
    AnalysisReport,
    AnalysisSignal,
    AnalysisTimelineEntry,
)
from app.schemas.news import NewsData
from app.schemas.transcript import TranscriptData
from app.services.news_service import get_news_service
from app.services.transcript_service import get_transcript_service

# Per-ticker mock analysis profiles: company metadata plus the signals
# to flag and the (non-quote) evidence copy for each. "Earnings Call"
# and "News" sourced signals borrow their quote from the fetched
# transcript/news data; "SEC Filing" signals use a static quote since
# there's no filing service (yet).
_COMPANY_PROFILES: dict[str, dict] = {
    "INFY": {
        "company": "Infosys Ltd.",
        "sector": "IT Services",
        "market_status": "Market Open",
        "confidence": 98.2,
        "summary": "Cautious language across the call and filing points to downside risk in near-term revenue guidance.",
        "signals": [
            {
                "id": "revenue-guidance", "title": "Revenue Guidance", "status": "RISK", "confidence": 98,
                "summary": "Revenue guidance revised downward.", "source": "Earnings Call",
                "why_it_matters": "Historically, similar language patterns have preceded weaker forward guidance.",
                "related_evidence": ["Quarterly filing reference", "News coverage correlated with the same theme"],
            },
            {
                "id": "earnings-tone", "title": "Earnings Tone", "status": "WATCH", "confidence": 95,
                "summary": "Management language more cautious.", "source": "Earnings Call",
                "why_it_matters": "Increased hedging language in management remarks often precedes guidance revisions.",
                "related_evidence": ["Earnings call Q&A transcript", "Analyst commentary flagged the same shift in tone"],
            },
            {
                "id": "margin-pressure", "title": "Margin Pressure", "status": "WATCH", "confidence": 93,
                "summary": "Analysts repeatedly questioned margins.", "source": "SEC Filing",
                "static_quote": "Operating margins may compress due to input cost pressures…",
                "why_it_matters": "Repeated analyst focus on margins in the same filing period signals emerging cost concerns.",
                "related_evidence": ["Quarterly filing, risk factors section", "Q&A transcript, margin questions from three analysts"],
            },
            {
                "id": "forward-sentiment", "title": "Forward Sentiment", "status": "NEUTRAL", "confidence": 90,
                "summary": "Forward-looking language softer than previous quarter.", "source": "News",
                "why_it_matters": "Softer external sentiment often mirrors shifts already present in internal guidance.",
                "related_evidence": ["Financial news coverage, post-earnings roundup", "Peer comparison coverage in the same cycle"],
            },
        ],
        "timeline": [
            {"time": "08:42", "label": "Transcript Parsed"},
            {"time": "08:43", "label": "Sentiment Detected"},
            {"time": "08:44", "label": "Guidance Flagged"},
            {"time": "08:45", "label": "Report Generated"},
        ],
    },
    "TCS": {
        "company": "Tata Consultancy Services",
        "sector": "IT Services",
        "market_status": "Market Open",
        "confidence": 91.4,
        "summary": "Deal momentum is cooling while workforce and margin metrics stay broadly stable.",
        "signals": [
            {
                "id": "deal-pipeline", "title": "Deal Pipeline", "status": "WATCH", "confidence": 91,
                "summary": "Large-deal bookings growth decelerating.", "source": "Earnings Call",
                "why_it_matters": "Slowing large-deal wins can lead revenue growth softness by a couple of quarters.",
                "related_evidence": ["Investor call transcript, deal-bookings segment", "Analyst commentary flagged the same deceleration"],
            },
            {
                "id": "attrition-trend", "title": "Attrition Trend", "status": "NEUTRAL", "confidence": 88,
                "summary": "Voluntary attrition stabilizing near historical lows.", "source": "Earnings Call",
                "why_it_matters": "Stable attrition typically supports steadier delivery margins going forward.",
                "related_evidence": ["Quarterly filing, workforce metrics section", "HR disclosure trend versus prior three quarters"],
            },
            {
                "id": "margin-guidance", "title": "Margin Guidance", "status": "WATCH", "confidence": 90,
                "summary": "Management flagged wage-hike related margin pressure.", "source": "SEC Filing",
                "static_quote": "We expect some near-term margin impact from the upcoming wage revisions…",
                "why_it_matters": "Pre-announced wage hikes are a recurring seasonal margin headwind worth tracking.",
                "related_evidence": ["Earnings call Q&A, margin outlook segment", "Prior-year wage-hike cycle comparison"],
            },
            {
                "id": "client-concentration", "title": "Client Concentration", "status": "NEUTRAL", "confidence": 85,
                "summary": "Top client revenue share little changed.", "source": "News",
                "why_it_matters": "Stable concentration reduces near-term single-client risk relative to peers.",
                "related_evidence": ["Financial news coverage, client mix analysis", "Peer comparison on account concentration"],
            },
        ],
        "timeline": [
            {"time": "09:10", "label": "Transcript Parsed"},
            {"time": "09:12", "label": "Sentiment Detected"},
            {"time": "09:13", "label": "Guidance Flagged"},
            {"time": "09:15", "label": "Report Generated"},
        ],
    },
    "AAPL": {
        "company": "Apple Inc.",
        "sector": "Consumer Technology",
        "market_status": "Market Closed",
        "confidence": 93.6,
        "summary": "Demand language has softened slightly while regulatory attention keeps building across key markets.",
        "signals": [
            {
                "id": "iphone-demand", "title": "iPhone Demand", "status": "WATCH", "confidence": 92,
                "summary": "Commentary on iPhone demand turned more measured.", "source": "Earnings Call",
                "why_it_matters": "Measured demand language has preceded softer unit guidance in prior cycles.",
                "related_evidence": ["Earnings call Q&A, regional demand segment", "Supply-chain commentary aligned with the same theme"],
            },
            {
                "id": "services-growth", "title": "Services Growth", "status": "NEUTRAL", "confidence": 87,
                "summary": "Services growth roughly in line with expectations.", "source": "Earnings Call",
                "why_it_matters": "In-line services growth suggests the segment isn't yet offsetting hardware softness.",
                "related_evidence": ["Quarterly filing, segment revenue breakdown", "Prior-quarter services growth comparison"],
            },
            {
                "id": "regulatory-scrutiny", "title": "Regulatory Scrutiny", "status": "RISK", "confidence": 94,
                "summary": "Increased regulatory scrutiny across key markets.", "source": "News",
                "why_it_matters": "Rising regulatory attention has historically preceded compliance costs and policy changes.",
                "related_evidence": ["Financial news coverage, regulatory roundup", "Cross-region policy tracker mentions"],
            },
            {
                "id": "supply-chain-tone", "title": "Supply Chain Tone", "status": "WATCH", "confidence": 89,
                "summary": "Supply chain commentary hedged more than usual.", "source": "SEC Filing",
                "static_quote": "We're closely monitoring component costs and logistics timelines…",
                "why_it_matters": "Extra hedging on supply chain typically signals near-term margin uncertainty.",
                "related_evidence": ["Earnings call Q&A, operations segment", "Component cost trend versus previous quarter"],
            },
        ],
        "timeline": [
            {"time": "07:58", "label": "Transcript Parsed"},
            {"time": "08:00", "label": "Sentiment Detected"},
            {"time": "08:02", "label": "Guidance Flagged"},
            {"time": "08:04", "label": "Report Generated"},
        ],
    },
    "NVDA": {
        "company": "NVIDIA Corporation",
        "sector": "Semiconductors",
        "market_status": "Market Closed",
        "confidence": 99.1,
        "summary": "Demand commentary remains strong, though export policy language is becoming a more active theme.",
        "signals": [
            {
                "id": "data-center-demand", "title": "Data Center Demand", "status": "NEUTRAL", "confidence": 96,
                "summary": "Demand commentary remained consistently strong.", "source": "Earnings Call",
                "why_it_matters": "Consistent demand-outpacing-supply language has historically supported continued upside.",
                "related_evidence": ["Earnings call Q&A, data center segment", "Supply-constraint commentary across the last three quarters"],
            },
            {
                "id": "export-policy-exposure", "title": "Export Policy Exposure", "status": "WATCH", "confidence": 90,
                "summary": "Increased mentions of export policy risk.", "source": "Earnings Call",
                "why_it_matters": "Rising disclosure emphasis on export policy often precedes guidance caveats.",
                "related_evidence": ["Quarterly filing, risk factors section", "Cross-reference with prior filing's export language"],
            },
            {
                "id": "competitive-landscape", "title": "Competitive Landscape", "status": "NEUTRAL", "confidence": 88,
                "summary": "Competitive references stayed steady quarter over quarter.", "source": "News",
                "why_it_matters": "Stable competitive framing suggests no near-term share-shift signal.",
                "related_evidence": ["Financial news coverage, competitive roundup", "Analyst notes on market share trend"],
            },
            {
                "id": "margin-trajectory", "title": "Margin Trajectory", "status": "WATCH", "confidence": 92,
                "summary": "Gross margin commentary turned slightly more cautious.", "source": "SEC Filing",
                "static_quote": "We expect some near-term puts and takes on gross margin…",
                "why_it_matters": "Even modest hedging on margins from a high base is worth monitoring closely.",
                "related_evidence": ["Earnings call Q&A, margin outlook segment", "Sequential gross margin trend versus guidance"],
            },
        ],
        "timeline": [
            {"time": "06:30", "label": "Transcript Parsed"},
            {"time": "06:31", "label": "Sentiment Detected"},
            {"time": "06:33", "label": "Guidance Flagged"},
            {"time": "06:34", "label": "Report Generated"},
        ],
    },
    "RELIANCE": {
        "company": "Reliance Industries",
        "sector": "Conglomerate",
        "market_status": "Market Open",
        "confidence": 92.5,
        "summary": "Refining margin pressure is the standout concern, while retail growth and telecom tariffs remain the ones to watch.",
        "signals": [
            {
                "id": "capex-guidance", "title": "Capex Guidance", "status": "WATCH", "confidence": 90,
                "summary": "Capex plans flagged as more back-half loaded than expected.", "source": "Earnings Call",
                "why_it_matters": "Delayed capex often signals near-term caution on demand or project timelines.",
                "related_evidence": ["Earnings call Q&A, capex segment", "Analyst notes on phasing shift"],
            },
            {
                "id": "retail-segment-growth", "title": "Retail Segment Growth", "status": "NEUTRAL", "confidence": 87,
                "summary": "Retail segment growth broadly matched estimates.", "source": "SEC Filing",
                "static_quote": "Retail segment revenue grew in line with our internal projections…",
                "why_it_matters": "In-line retail growth suggests no major surprise in consumer segment momentum.",
                "related_evidence": ["Quarterly filing, segment revenue breakdown", "Prior-quarter retail growth comparison"],
            },
            {
                "id": "refining-margins", "title": "Refining Margins", "status": "RISK", "confidence": 94,
                "summary": "Refining margins commentary turned notably more cautious.", "source": "Earnings Call",
                "why_it_matters": "Explicit margin-pressure guidance in refining has historically preceded weaker segment earnings.",
                "related_evidence": ["Earnings call Q&A, refining segment", "Sequential refining margin trend versus guidance"],
            },
            {
                "id": "telecom-tariff-outlook", "title": "Telecom Tariff Outlook", "status": "WATCH", "confidence": 89,
                "summary": "Coverage flagged uncertainty around telecom tariff timing.", "source": "News",
                "why_it_matters": "Delayed tariff action directly affects near-term telecom segment revenue assumptions.",
                "related_evidence": ["Financial news coverage, telecom regulatory roundup", "Analyst commentary on tariff timing risk"],
            },
        ],
        "timeline": [
            {"time": "10:05", "label": "Transcript Parsed"},
            {"time": "10:06", "label": "Sentiment Detected"},
            {"time": "10:08", "label": "Guidance Flagged"},
            {"time": "10:10", "label": "Report Generated"},
        ],
    },
}

_DEFAULT_PROFILE: dict = {
    "company": None,  # filled in with the ticker itself when used
    "sector": "Unknown",
    "market_status": "Market Open",
    "confidence": 90.0,
    "summary": "AI-detected signals across earnings calls, filings, and news for this company.",
    "signals": [
        {
            "id": "revenue-guidance", "title": "Revenue Guidance", "status": "RISK", "confidence": 98,
            "summary": "Revenue guidance revised downward.", "source": "Earnings Call",
            "why_it_matters": "Historically, similar language patterns have preceded weaker forward guidance.",
            "related_evidence": ["Quarterly filing reference", "News coverage correlated with the same theme"],
        },
        {
            "id": "earnings-tone", "title": "Earnings Tone", "status": "WATCH", "confidence": 95,
            "summary": "Management language more cautious.", "source": "Earnings Call",
            "why_it_matters": "Increased hedging language in management remarks often precedes guidance revisions.",
            "related_evidence": ["Earnings call Q&A transcript", "Analyst commentary flagged the same shift in tone"],
        },
        {
            "id": "margin-pressure", "title": "Margin Pressure", "status": "WATCH", "confidence": 93,
            "summary": "Analysts repeatedly questioned margins.", "source": "SEC Filing",
            "static_quote": "Operating margins may compress due to input cost pressures…",
            "why_it_matters": "Repeated analyst focus on margins in the same filing period signals emerging cost concerns.",
            "related_evidence": ["Quarterly filing, risk factors section", "Q&A transcript, margin questions from three analysts"],
        },
        {
            "id": "forward-sentiment", "title": "Forward Sentiment", "status": "NEUTRAL", "confidence": 90,
            "summary": "Forward-looking language softer than previous quarter.", "source": "News",
            "why_it_matters": "Softer external sentiment often mirrors shifts already present in internal guidance.",
            "related_evidence": ["Financial news coverage, post-earnings roundup", "Peer comparison coverage in the same cycle"],
        },
    ],
    "timeline": [
        {"time": "08:42", "label": "Transcript Parsed"},
        {"time": "08:43", "label": "Sentiment Detected"},
        {"time": "08:44", "label": "Guidance Flagged"},
        {"time": "08:45", "label": "Report Generated"},
    ],
}


def _quote_cycle(transcript: TranscriptData) -> Optional[Iterator[str]]:
    if not transcript.quotes:
        return None
    return cycle(quote.quote for quote in transcript.quotes)


def _news_cycle(news: NewsData) -> Optional[Iterator[str]]:
    if not news.articles:
        return None
    return cycle(article.summary for article in news.articles)


def analyze_company(ticker: str) -> AnalysisReport:
    """
    Runs the full (mock) analysis pipeline for a ticker: fetches a
    transcript and recent news, then produces a structured
    AnalysisReport combining both with the mocked signal definitions
    for that company.

    Unknown tickers fall back to a generic profile rather than raising,
    so this never breaks for a company outside the mocked set.
    """
    ticker = ticker.upper()

    transcript = get_transcript_service().fetch(ticker)
    news = get_news_service().fetch(ticker)

    profile = _COMPANY_PROFILES.get(ticker, _DEFAULT_PROFILE)
    company_name = profile.get("company") or ticker

    quotes = _quote_cycle(transcript)
    headlines = _news_cycle(news)

    signals: list[AnalysisSignal] = []
    evidence: list[AnalysisEvidence] = []

    for signal_def in profile["signals"]:
        signals.append(
            AnalysisSignal(
                id=signal_def["id"],
                title=signal_def["title"],
                status=signal_def["status"],
                confidence=signal_def["confidence"],
                summary=signal_def["summary"],
            )
        )

        source = signal_def["source"]
        if source == "Earnings Call" and quotes is not None:
            quote_text = next(quotes)
        elif source == "News" and headlines is not None:
            quote_text = next(headlines)
        else:
            quote_text = signal_def.get("static_quote", transcript.summary)

        evidence.append(
            AnalysisEvidence(
                signal_id=signal_def["id"],
                source=source,
                quote=quote_text,
                why_it_matters=signal_def["why_it_matters"],
                related_evidence=signal_def["related_evidence"],
            )
        )

    return AnalysisReport(
        ticker=ticker,
        company=company_name,
        sector=profile["sector"],
        market_status=profile["market_status"],
        confidence=profile["confidence"],
        summary=profile["summary"],
        signals=signals,
        evidence=evidence,
        timeline=[AnalysisTimelineEntry(**entry) for entry in profile["timeline"]],
        generated_at=datetime.now(timezone.utc).isoformat(),
        sources={
            "transcript": transcript.model_dump(),
            "news": news.model_dump(),
        },
    )
