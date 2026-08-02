# AlphaLens AI — Frontend

Step 1 foundation: React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide React.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

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
    layout/   Navbar, GridBackground, and other page-shell pieces
    ui/       Reusable Container, Section, Button, Card primitives
  pages/      Top-level route views (Home is the Step 1 foundation screen)
  hooks/      Shared hooks (e.g. useReducedMotion)
  lib/        Utilities (e.g. cn class helper)
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
