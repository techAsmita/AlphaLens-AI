import { motion } from "framer-motion";
import { Mic, FileText, Newspaper } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { SIGNALS, type EvidenceSource } from "@/lib/signals";

const SOURCE_ICONS: Record<EvidenceSource, typeof Mic> = {
  "Earnings Call": Mic,
  "SEC Filing": FileText,
  News: Newspaper,
};

const SOURCES: EvidenceSource[] = ["Earnings Call", "SEC Filing", "News"];

const featuredSignal = SIGNALS[0];

/**
 * "Evidence" section of the landing page: shows exactly what backs up a
 * signal, echoing the same Source / Quote / Why It Matters pattern used
 * in the real Evidence panel on the dashboard.
 */
export function EvidenceSection() {
  return (
    <Section id="evidence" data-nav-section="evidence" className="scroll-mt-8 lg:pl-72">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-primary">
            04 · EVIDENCE
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Every flag traces back to the exact line.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted">
            No summaries you have to take on faith — just the source, the
            quote, and why it matters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
          <Card>
            <div className="mb-4 flex flex-wrap gap-2">
              {SOURCES.map((source) => {
                const SourceIcon = SOURCE_ICONS[source];
                const isActive = source === featuredSignal.evidence.source;
                return (
                  <span
                    key={source}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-tight text-[10px] tracking-wide",
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
            <div className="text-[11px] uppercase tracking-widest text-muted">Quote</div>
            <p className="mt-2 text-base italic leading-relaxed text-text">
              &ldquo;{featuredSignal.evidence.quote}&rdquo;
            </p>
          </Card>

          <Card>
            <div className="text-[11px] uppercase tracking-widest text-muted">
              Why It Matters
            </div>
            <p className="mt-2 text-base leading-relaxed text-muted">
              {featuredSignal.evidence.whyItMatters}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {featuredSignal.evidence.relatedEvidence.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted/80"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-muted/50" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
}
