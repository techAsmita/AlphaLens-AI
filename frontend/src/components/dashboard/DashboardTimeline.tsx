import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { TimelineEntry } from "@/lib/dashboardTimeline";

interface DashboardTimelineProps {
  entries: TimelineEntry[];
}

/**
 * Static bottom timeline summarizing the completed analysis run. Not
 * live-generated — a record of the steps that produced this report.
 * Entries come from the selected company's dataset, so they change when
 * you switch companies.
 */
export function DashboardTimeline({ entries }: DashboardTimelineProps) {
  return (
    <div className="border-t border-white/10 bg-background/60">
      <div className="mx-auto w-full max-w-container px-6 py-5 sm:px-8 lg:px-10">
        <div className="mb-4 font-mono-tight text-xs tracking-widest text-muted">
          TIMELINE
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
          {entries.map((entry, index) => (
            <div key={`${entry.time}-${entry.label}`} className="flex flex-1 items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <Check size={12} />
                </span>
                <div className="leading-tight">
                  <div className="font-mono-tight text-xs text-text">{entry.time}</div>
                  <div className="text-xs text-muted">{entry.label}</div>
                </div>
              </motion.div>

              {index < entries.length - 1 && (
                <div className="hidden h-px flex-1 bg-white/10 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
