import { motion, AnimatePresence } from "framer-motion";
import { Mic, FileText, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { SIGNAL_STATUS_STYLES, type EvidenceSource } from "@/lib/signals";
import type { ReportEvidence, ReportSignal } from "@/services/intelligence";

interface EvidencePanelProps {
  signal: ReportSignal;
  evidence: ReportEvidence;
}

const SOURCE_ICONS: Record<EvidenceSource, typeof Mic> = {
  "Earnings Call": Mic,
  "SEC Filing": FileText,
  News: Newspaper,
};

const SOURCES: EvidenceSource[] = ["Earnings Call", "SEC Filing", "News"];

/**
 * Right sidebar of the Intelligence Dashboard. Shows the evidence behind
 * whichever signal card is currently selected: which source it came
 * from, the supporting quote, and why it matters. Signal and evidence
 * are normalized/separate in the data layer (joined by signalId), so
 * both are passed in explicitly by the caller.
 */
export function EvidencePanel({ signal, evidence }: EvidencePanelProps) {
  const styles = SIGNAL_STATUS_STYLES[signal.status];

  return (
    <aside className="w-full lg:w-[320px] lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono-tight text-xs tracking-widest text-muted">
          EVIDENCE
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {SOURCES.map((source) => {
          const SourceIcon = SOURCE_ICONS[source];
          const isActive = source === evidence.source;
          return (
            <span
              key={source}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-tight text-[10px] tracking-wide transition-colors duration-200",
                isActive
                  ? "border-secondary/40 bg-secondary/10 text-secondary"
                  : "border-white/10 text-muted/50"
              )}
            >
              <SourceIcon size={11} />
              {source}
            </span>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={cn("mb-3 rounded-xl border bg-card p-6", styles.border)}>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono-tight text-[10px] tracking-widest",
                styles.badge
              )}
            >
              {signal.title}
            </span>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted">
                  Source
                </div>
                <div className="mt-1 text-sm text-text">{evidence.source}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-widest text-muted">
                  Confidence
                </div>
                <div className="mt-1 font-mono-tight text-sm text-text">
                  {signal.confidence}%
                </div>
              </div>
            </div>
          </div>

          <Card accent="secondary" className="mb-3">
            <div className="text-[11px] uppercase tracking-widest text-muted">
              Quote
            </div>
            <p className="mt-2 text-sm italic leading-relaxed text-text">
              &ldquo;{evidence.quote}&rdquo;
            </p>
          </Card>

          <Card className="mb-3">
            <div className="text-[11px] uppercase tracking-widest text-muted">
              Why It Matters
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {evidence.whyItMatters}
            </p>
          </Card>

          <Card>
            <div className="text-[11px] uppercase tracking-widest text-muted">
              Related Evidence
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {evidence.relatedEvidence.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted/50" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
