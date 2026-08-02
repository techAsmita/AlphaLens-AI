import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useClock, formatClock } from "@/hooks/useClock";

/**
 * Sticky top bar for the Analysis Workspace route: a way back to the
 * landing page, the page title, a READY status pill, and a live clock.
 */
export function AnalysisHeader() {
  const now = useClock();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Back to landing page"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="truncate text-sm font-semibold tracking-wide text-text sm:text-base">
            Analysis Workspace
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono-tight text-[10px] tracking-widest text-primary sm:text-[11px]">
              READY
            </span>
          </span>
          <span className="font-mono-tight text-xs tabular-nums text-muted sm:text-sm">
            {formatClock(now)}
          </span>
        </div>
      </Container>
    </header>
  );
}
