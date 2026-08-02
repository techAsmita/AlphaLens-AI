import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { RECENT_ANALYSES } from "@/lib/recentAnalyses";

/**
 * Right sidebar of the Analysis Workspace: a short feed of recently run
 * analyses, each showing ticker, status, relative time, and confidence.
 */
export function RecentAnalyses() {
  return (
    <aside className="w-full lg:w-[300px] lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono-tight text-xs tracking-widest text-muted">
          RECENT ANALYSES
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {RECENT_ANALYSES.map((item, index) => (
          <motion.div
            key={item.ticker}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-tight text-sm text-text">{item.ticker}</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 font-mono-tight text-[10px] tracking-widest",
                    item.status === "Completed"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-secondary/30 bg-secondary/10 text-secondary"
                  )}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{item.time || "Just now"}</span>
                <span className="font-mono-tight text-text">
                  Confidence {item.confidence}%
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
