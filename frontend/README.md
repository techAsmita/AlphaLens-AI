# AlphaLens AI — Frontend

React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide React. Talks to the FastAPI backend in `../backend` (`POST /analyze`).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

The backend must be running at `http://localhost:8000` (override with `VITE_API_BASE_URL` — copy `.env.example` to `.env`).

## Stack

- **React 18 + TypeScript** — app framework
- **Vite** — dev server & build tool
- **Tailwind CSS** — styling, themed with the AlphaLens design tokens
- **Framer Motion** — page-load and interaction animation
- **Lucide React** — icon set

## Structure

```
src/
  components/
    landing/    Sections of the landing page
    analysis/   Watchlist, workspace panel, recent analyses
    dashboard/  Signal cards, evidence panel, timeline (+ loading skeletons)
    layout/     GridBackground, LeftNav, Ticker, SystemPanel, CursorGlow
    ui/         Reusable Container, Section, Button, Card primitives
  pages/      Routes: Landing (/), Analysis (/analysis), AnalysisProcess (/analysis/process), Dashboard (/dashboard)
  context/    CompanyContext — selected company + analysis result
  services/   intelligence.ts — API client for POST /analyze
  hooks/      Shared hooks (e.g. useReducedMotion, useClock)
  lib/        Utilities and data (companies, signals, process steps)
  styles/     Reserved for additional stylesheets beyond index.css
  assets/     Static assets imported by components
```

## Path alias

`@/*` resolves to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Design tokens

| Token      | Value     |
| ---------- | --------- |
| background | `#090909` |
| card       | `#111111` |
| primary    | `#00F59B` |
| secondary  | `#5CF2FF` |
| danger     | `#FF4D6D` |
| text       | `#F7F7F7` |
| muted      | `#8A8A8A` |

Fonts: **Inter** (sans, default body/display) and **IBM Plex Mono** (via the `font-mono` /
`font-mono-tight` utility, used for labels and technical detail).
