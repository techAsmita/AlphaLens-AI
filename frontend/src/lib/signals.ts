import type { LucideIcon } from "lucide-react";
import { TrendingDown, MessageSquare, Percent, Compass } from "lucide-react";

export type SignalStatus = "RISK" | "WATCH" | "NEUTRAL";
export type EvidenceSource = "Earnings Call" | "SEC Filing" | "News";

export interface SignalEvidence {
  source: EvidenceSource;
  quote: string;
  whyItMatters: string;
  relatedEvidence: string[];
}

export interface SignalDefinition {
  id: string;
  title: string;
  status: SignalStatus;
  confidence: number;
  summary: string;
  icon: LucideIcon;
  evidence: SignalEvidence;
}

/** Tailwind class fragments shared by anything rendering a status badge/border. */
export const SIGNAL_STATUS_STYLES: Record<
  SignalStatus,
  { badge: string; border: string; dot: string; text: string }
> = {
  RISK: {
    badge: "border-danger/30 bg-danger/10 text-danger",
    border: "border-danger/40",
    dot: "bg-danger",
    text: "text-danger",
  },
  WATCH: {
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    border: "border-amber-400/40",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  NEUTRAL: {
    badge: "border-white/15 bg-white/5 text-muted",
    border: "border-white/15",
    dot: "bg-muted",
    text: "text-muted",
  },
};

/**
 * The default / fallback signal set — used by the Intelligence section
 * preview on the landing page. The real Dashboard no longer uses this
 * directly; it loads per-company data through
 * src/services/intelligence.ts, which has its own fallback for
 * watchlist companies without a dedicated mock dataset.
 */
export const SIGNALS: SignalDefinition[] = [
  {
    id: "revenue-guidance",
    title: "Revenue Guidance",
    status: "RISK",
    confidence: 98,
    summary: "Revenue guidance revised downward.",
    icon: TrendingDown,
    evidence: {
      source: "Earnings Call",
      quote: "We remain cautious about demand recovery…",
      whyItMatters:
        "Historically, similar language patterns have preceded weaker forward guidance.",
      relatedEvidence: [
        "Quarterly filing reference",
        "News coverage correlated with the same theme",
      ],
    },
  },
  {
    id: "earnings-tone",
    title: "Earnings Tone",
    status: "WATCH",
    confidence: 95,
    summary: "Management language more cautious.",
    icon: MessageSquare,
    evidence: {
      source: "Earnings Call",
      quote: "We're taking a more measured approach this quarter…",
      whyItMatters:
        "Increased hedging language in management remarks often precedes guidance revisions.",
      relatedEvidence: [
        "Earnings call Q&A transcript",
        "Analyst commentary flagged the same shift in tone",
      ],
    },
  },
  {
    id: "margin-pressure",
    title: "Margin Pressure",
    status: "WATCH",
    confidence: 93,
    summary: "Analysts repeatedly questioned margins.",
    icon: Percent,
    evidence: {
      source: "SEC Filing",
      quote: "Operating margins may compress due to input cost pressures…",
      whyItMatters:
        "Repeated analyst focus on margins in the same filing period signals emerging cost concerns.",
      relatedEvidence: [
        "Quarterly filing, risk factors section",
        "Q&A transcript, margin questions from three analysts",
      ],
    },
  },
  {
    id: "forward-sentiment",
    title: "Forward Sentiment",
    status: "NEUTRAL",
    confidence: 90,
    summary: "Forward-looking language softer than previous quarter.",
    icon: Compass,
    evidence: {
      source: "News",
      quote: "Coverage described the outlook as measured rather than optimistic…",
      whyItMatters:
        "Softer external sentiment often mirrors shifts already present in internal guidance.",
      relatedEvidence: [
        "Financial news coverage, post-earnings roundup",
        "Peer comparison coverage in the same cycle",
      ],
    },
  },
];
