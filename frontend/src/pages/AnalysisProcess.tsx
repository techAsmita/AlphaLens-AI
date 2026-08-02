import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ProcessStepRow } from "@/components/analysis/ProcessStep";
import { PROCESS_STEPS } from "@/lib/processSteps";
import { useCompany } from "@/context/CompanyContext";

const COMPLETE_HOLD_MS = 900;
const MIN_STEP_DELAY_MS = 700;
const STEP_DELAY_JITTER_MS = 300;

/**
 * The "/analysis/process" route: a cinematic, terminal-style sequence
 * that walks through the 10 analysis steps one at a time, then
 * automatically navigates to "/dashboard" once the sequence finishes.
 *
 * The selected company comes from CompanyContext (set by the Analysis
 * Workspace's "Analyze Company" button, which also kicks off the real
 * report fetch in the background so it's typically ready well before
 * this cinematic sequence finishes). If no company is selected — e.g.
 * this URL was opened directly — it redirects back to "/analysis".
 */
export function AnalysisProcess() {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSteps = PROCESS_STEPS.length;

  useEffect(() => {
    if (!selectedCompany) {
      navigate("/analysis", { replace: true });
    }
  }, [selectedCompany, navigate]);

  useEffect(() => {
    if (!selectedCompany) return undefined;

    if (activeIndex >= totalSteps) {
      const holdTimer = window.setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, COMPLETE_HOLD_MS);
      return () => window.clearTimeout(holdTimer);
    }

    const delay = MIN_STEP_DELAY_MS + Math.random() * STEP_DELAY_JITTER_MS;
    const stepTimer = window.setTimeout(() => {
      setActiveIndex((current) => current + 1);
    }, delay);

    return () => window.clearTimeout(stepTimer);
  }, [activeIndex, selectedCompany, navigate, totalSteps]);

  if (!selectedCompany) return null;

  const completedCount = Math.min(activeIndex, totalSteps);
  const progress = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="relative min-h-screen pb-24 pt-24">
      <Container className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-muted">
            ANALYZING
          </span>
          <h1 className="mt-1 text-xl font-semibold text-text sm:text-2xl">
            {selectedCompany.ticker} <span className="text-muted">·</span>{" "}
            {selectedCompany.name}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex shrink-0 flex-col items-end gap-1"
        >
          <span className="font-mono-tight text-[11px] tracking-widest text-muted">
            AI STATUS
          </span>
          <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono-tight text-[11px] tracking-widest text-primary">
              ACTIVE
            </span>
          </span>
        </motion.div>
      </Container>

      <Container className="mt-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="rounded-xl border border-white/10 bg-card/70 p-6 backdrop-blur-sm"
        >
          <ul className="flex flex-col">
            {PROCESS_STEPS.map((step, index) => {
              const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";
              return <ProcessStepRow key={step.id} step={step} state={state} />;
            })}
          </ul>
        </motion.div>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 backdrop-blur-md">
        <Container className="flex items-center gap-4 py-4">
          <span className="shrink-0 font-mono-tight text-xs tracking-widest text-muted">
            OVERALL PROGRESS
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono-tight text-xs tabular-nums text-text">
            {progress}%
          </span>
        </Container>
      </div>
    </div>
  );
}
