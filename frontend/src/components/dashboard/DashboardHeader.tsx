import { Container } from "@/components/ui/Container";
import { useClock, formatClock } from "@/hooks/useClock";

/**
 * Sticky top bar for the Intelligence Dashboard: page title on the left,
 * a live "last updated" clock and an ACTIVE AI status pill on the right.
 */
export function DashboardHeader() {
  const now = useClock();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <h1 className="truncate text-sm font-semibold tracking-wide text-text sm:text-base">
          AlphaLens <span className="text-primary">Intelligence</span>
        </h1>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <div className="hidden flex-col items-end leading-tight sm:flex">
            <span className="font-mono-tight text-[10px] tracking-widest text-muted">
              LAST UPDATED
            </span>
            <span className="font-mono-tight text-xs tabular-nums text-text">
              {formatClock(now)}
            </span>
          </div>

          <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono-tight text-[10px] tracking-widest text-primary sm:text-[11px]">
              AI STATUS · ACTIVE
            </span>
          </span>
        </div>
      </Container>
    </header>
  );
}
