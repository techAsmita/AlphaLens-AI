import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SIGNAL_STATUS_STYLES } from "@/lib/signals";
import type { ReportSignal } from "@/services/intelligence";

interface SignalCardProps {
  signal: ReportSignal;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * A single signal card in the Intelligence Report grid. Selecting a card
 * drives what's shown in the Evidence panel. Status color (RISK / WATCH /
 * NEUTRAL) is shared with the Evidence panel via SIGNAL_STATUS_STYLES so
 * the two stay visually in sync.
 */
export function SignalCard({ signal, isSelected, onSelect }: SignalCardProps) {
  const Icon = signal.icon;
  const styles = SIGNAL_STATUS_STYLES[signal.status];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-pressed={isSelected}
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-5 text-left transition-colors duration-200",
        isSelected ? styles.border : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border",
            styles.badge
          )}
        >
          <Icon size={16} />
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono-tight text-[10px] tracking-widest",
            styles.badge
          )}
        >
          {signal.status}
        </span>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text">{signal.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{signal.summary}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono-tight text-[11px] tracking-wide text-muted">
          Confidence
        </span>
        <span className="font-mono-tight text-sm text-text">{signal.confidence}%</span>
      </div>
    </motion.button>
  );
}
