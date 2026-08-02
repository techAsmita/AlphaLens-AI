import { motion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessStepDefinition } from "@/lib/processSteps";

export type ProcessStepState = "pending" | "active" | "done";

interface ProcessStepRowProps {
  step: ProcessStepDefinition;
  state: ProcessStepState;
}

/**
 * A single row in the AI analysis terminal-style timeline: a topic icon
 * on the left (dimmed while pending, glowing green once done), the step
 * label, and a status indicator on the right (spinner while active,
 * checkmark once done).
 */
export function ProcessStepRow({ step, state }: ProcessStepRowProps) {
  const Icon = step.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: state === "pending" ? 0.4 : 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3 border-b border-white/5 py-3 last:border-b-0"
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-300",
          state === "done"
            ? "border-primary/40 bg-primary/10 text-primary"
            : state === "active"
              ? "border-secondary/40 bg-secondary/10 text-secondary"
              : "border-white/10 text-muted/40"
        )}
      >
        <Icon size={14} />
      </span>

      <span
        className={cn(
          "flex-1 font-mono-tight text-sm transition-colors duration-300",
          state === "pending" ? "text-muted/40" : "text-text"
        )}
      >
        {step.label}
      </span>

      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {state === "active" && (
          <LoaderCircle size={14} className="animate-spin text-secondary" />
        )}
        {state === "done" && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <Check size={14} className="text-primary" />
          </motion.span>
        )}
      </span>
    </motion.li>
  );
}
