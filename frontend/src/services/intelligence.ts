import type { LucideIcon } from "lucide-react";
import {
  TrendingDown,
  MessageSquare,
  Percent,
  Compass,
  Handshake,
  Users,
  Building2,
  Smartphone,
  LineChart,
  ShieldAlert,
  Truck,
  Server,
  Globe,
  Swords,
  Factory,
  ShoppingBag,
  Flame,
  Radio,
} from "lucide-react";
import type { Company } from "@/lib/companies";
import type { EvidenceSource, SignalStatus } from "@/lib/signals";
import type { TimelineEntry } from "@/lib/dashboardTimeline";

/**
 * This module is the single data-loading layer for the Intelligence
 * Dashboard. It calls the real backend (POST /analyze) — no local mock
 * JSON, no simulated delay. Every consumer of this service (Dashboard,
 * Evidence panel, etc.) only ever sees the resolved CompanyReport shape
 * below, exactly as before; only this file's internals changed.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export interface ReportSignal {
  id: string;
  title: string;
  status: SignalStatus;
  confidence: number;
  summary: string;
  icon: LucideIcon;
}

export interface ReportEvidence {
  signalId: string;
  source: EvidenceSource;
  quote: string;
  whyItMatters: string;
  relatedEvidence: string[];
}

export interface CompanyReport {
  company: string;
  ticker: string;
  sector: string;
  marketStatus: string;
  confidence: number;
  summary: string;
  signals: ReportSignal[];
  evidence: ReportEvidence[];
  timeline: TimelineEntry[];
}

/** Raw shape of a signal entry exactly as POST /analyze returns it (no icon — that's a frontend presentation detail). */
interface RawAnalyzeSignal {
  id: string;
  title: string;
  status: SignalStatus;
  confidence: number;
  summary: string;
}

/** Raw shape of an evidence entry exactly as POST /analyze returns it (snake_case, as FastAPI/Pydantic serialize it). */
interface RawAnalyzeEvidence {
  signal_id: string;
  source: EvidenceSource;
  quote: string;
  why_it_matters: string;
  related_evidence: string[];
}

interface RawAnalyzeResponse {
  ticker: string;
  company: string;
  sector: string;
  market_status: string;
  confidence: number;
  summary: string;
  signals: RawAnalyzeSignal[];
  evidence: RawAnalyzeEvidence[];
  timeline: TimelineEntry[];
  generated_at: string;
}

/**
 * Maps known signal ids to an icon. The backend doesn't send icon
 * data (icons are a presentation concern, not a data concern) — this
 * keeps that mapping entirely on the frontend, with a sensible
 * fallback for any signal id it doesn't recognize.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  "revenue-guidance": TrendingDown,
  "earnings-tone": MessageSquare,
  "margin-pressure": Percent,
  "forward-sentiment": Compass,
  "deal-pipeline": Handshake,
  "attrition-trend": Users,
  "margin-guidance": Percent,
  "client-concentration": Building2,
  "iphone-demand": Smartphone,
  "services-growth": LineChart,
  "regulatory-scrutiny": ShieldAlert,
  "supply-chain-tone": Truck,
  "data-center-demand": Server,
  "export-policy-exposure": Globe,
  "competitive-landscape": Swords,
  "margin-trajectory": Percent,
  "capex-guidance": Factory,
  "retail-segment-growth": ShoppingBag,
  "refining-margins": Flame,
  "telecom-tariff-outlook": Radio,
};

function mapAnalyzeResponse(raw: RawAnalyzeResponse): CompanyReport {
  return {
    company: raw.company,
    ticker: raw.ticker,
    sector: raw.sector,
    marketStatus: raw.market_status,
    confidence: raw.confidence,
    summary: raw.summary,
    signals: raw.signals.map((signal) => ({
      id: signal.id,
      title: signal.title,
      status: signal.status,
      confidence: signal.confidence,
      summary: signal.summary,
      icon: ICON_MAP[signal.id] ?? Compass,
    })),
    evidence: raw.evidence.map((entry) => ({
      signalId: entry.signal_id,
      source: entry.source,
      quote: entry.quote,
      whyItMatters: entry.why_it_matters,
      relatedEvidence: entry.related_evidence,
    })),
    timeline: raw.timeline,
  };
}

/**
 * Resolves a full intelligence report for a company by calling the
 * backend's POST /analyze endpoint. Throws on network failure, a
 * non-2xx response, or a malformed response body — callers (see
 * CompanyContext) are expected to catch this and surface a failure
 * state rather than let it propagate as an unhandled rejection.
 */
export async function getCompanyReport(company: Company): Promise<CompanyReport> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: company.ticker }),
    });
  } catch {
    throw new Error(
      "Couldn't reach the analysis server. Check that the backend is running and try again."
    );
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body?.detail === "string" ? body.detail : "";
    } catch {
      // Response body wasn't JSON — fall through with no extra detail.
    }
    throw new Error(detail || `Analysis request failed (${response.status}).`);
  }

  const raw = (await response.json()) as RawAnalyzeResponse;
  return mapAnalyzeResponse(raw);
}
