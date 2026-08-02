# AlphaLens AI — Backend

FastAPI backend: app structure, CORS, logging, environment
configuration, a mock data pipeline (transcript → news → analysis),
a POST /analyze endpoint the frontend calls, and a Gemini integration
service ready to plug into that pipeline.

## Getting started

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env        # optional — defaults work out of the box

uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

- Interactive docs: `http://localhost:8000/docs`
- Health check: `GET /health` → `{"status": "healthy"}`
- Analysis: `POST /analyze` with body `{"ticker": "INFY"}` → a structured `AnalysisReport`

## Project structure

```
backend/
  app/
    main.py            FastAPI app construction, middleware, startup/shutdown logging
    api/
      router.py         Aggregates all route modules into one router
      health.py          GET /health
      analyze.py          POST /analyze
    services/
      health_service.py     Health-check business logic
      transcript_service.py Earnings call transcript retrieval (mock provider, swappable)
      news_service.py       Financial news retrieval (mock provider, swappable)
      analysis_service.py   analyze_company(ticker) — composes the two above into a report
      gemini_service.py     Gemini integration — generate_report(transcript, news)
    models/              Domain/persistence models (empty — no DB yet)
    schemas/
      health.py            Pydantic response schema for /health
      transcript.py         TranscriptData / TranscriptQuote
      news.py               NewsData / NewsArticle
      analysis.py           AnalysisReport, AnalyzeRequest, and nested signal/evidence/timeline shapes
    utils/
      config.py           Environment-variable-backed Settings (pydantic-settings)
      logging.py          Logging configuration (root + uvicorn loggers)
  requirements.txt
  .env.example
```

## Configuration

All configuration is environment-variable-driven via `app/utils/config.py`,
loaded through `pydantic-settings` (process env vars take priority, then
`.env`, then the defaults below):

| Variable             | Default                                                              | Purpose                        |
| -------------------- | --------------------------------------------------------------------- | ------------------------------- |
| `APP_NAME`           | `AlphaLens AI API`                                                    | Shown in `/docs` and `/`        |
| `APP_VERSION`        | `0.1.0`                                                                | Shown in `/docs` and `/`        |
| `ENVIRONMENT`        | `development`                                                          | Logged at startup                |
| `DEBUG`              | `true`                                                                 | FastAPI debug mode               |
| `HOST`               | `0.0.0.0`                                                              | Informational (uvicorn sets its own via CLI/flags) |
| `PORT`               | `8000`                                                                 | Informational (uvicorn sets its own via CLI/flags) |
| `ALLOWED_ORIGINS`    | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000`    | Comma-separated CORS allow-list |
| `LOG_LEVEL`          | `INFO`                                                                 | Root + uvicorn logger level     |
| `TRANSCRIPT_PROVIDER`| `mock`                                                                 | Which transcript provider to use |
| `NEWS_PROVIDER`      | `mock`                                                                 | Which news provider to use       |
| `GEMINI_API_KEY`     | *(unset)*                                                              | Required only for `gemini_service.generate_report()` |

## Architecture notes

- **Routes → Services → (future) Models.** Route handlers in `app/api`
  stay thin; business logic lives in `app/services`. Even the trivial
  health check follows this so the pattern is established before real
  endpoints are added.
- **Single source of config truth.** No module reads `os.environ`
  directly — everything imports `settings` from `app/utils/config.py`.
- **Logging.** `configure_logging()` runs once at import time in
  `app/main.py`, giving root and uvicorn loggers a consistent format.
  Every request is also logged (method, path, status, duration) via
  middleware in `app/main.py`.

## Data pipeline (transcript → news → analysis)

`analysis_service.analyze_company(ticker)` is the entry point for the
whole pipeline. It:

1. Calls `transcript_service.get_transcript_service().fetch(ticker)`
2. Calls `news_service.get_news_service().fetch(ticker)`
3. Combines both with a per-ticker set of mock signal definitions into
   a structured `AnalysisReport` (Pydantic model — JSON via
   `.model_dump()` / `.model_dump_json()`)

Try it from a Python shell (with the venv active):

```python
from app.services.analysis_service import analyze_company
report = analyze_company("INFY")
print(report.model_dump_json(indent=2))
```

**Swapping mocks for real providers.** Both `transcript_service.py` and
`news_service.py` follow the same pattern: an abstract `*Provider` base
class, a `Mock*Provider` implementation, and a `get_*_service()`
factory that branches on a setting (`TRANSCRIPT_PROVIDER` /
`NEWS_PROVIDER`). To add a real provider:

1. Implement a new class (e.g. `SeekingAlphaTranscriptProvider`)
   satisfying the same `fetch(ticker) -> TranscriptData` interface.
2. Add a branch for it in the corresponding `get_*_service()` function.
3. Set the environment variable to select it.

`analysis_service.py` — and anything else that calls these services —
never needs to change.

## POST /analyze

The frontend calls this endpoint to run the pipeline for a company:

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker": "INFY"}'
```

Returns an `AnalysisReport` (200), a validation error (422) for a
missing/empty ticker, or a clean `{"detail": "..."}` error body (500)
if something unexpected fails inside the pipeline — never a raw
traceback.

## Gemini integration

`gemini_service.generate_report(transcript, news)` sends real
transcript + news content to Gemini and returns a parsed JSON dict of
signals it identified — grounded in that content, not the static mock
definitions `analysis_service` uses today.

```python
from app.services.gemini_service import generate_report
from app.services.transcript_service import get_transcript_service
from app.services.news_service import get_news_service

transcript = get_transcript_service().fetch("INFY")
news = get_news_service().fetch("INFY")
report = generate_report(transcript, news)  # requires GEMINI_API_KEY
```

Without `GEMINI_API_KEY` set, calling `generate_report()` raises
`GeminiNotConfiguredError` — a normal, catchable exception. Importing
the module, and running the app generally, never fails just because
the key is missing.

This isn't wired into `analyze_company()` yet — that still runs
entirely on mock data. Swapping it in later (e.g. behind a "use real
analysis" setting) is the natural next step, and won't require
changing `POST /analyze`'s contract.

