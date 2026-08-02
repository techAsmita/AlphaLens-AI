import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TickerEntry {
  symbol: string;
  change: number;
}

const TICKER_ITEMS: TickerEntry[] = [
  { symbol: "INFY", change: 1.23 },
  { symbol: "TCS", change: -0.83 },
  { symbol: "AAPL", change: 0.52 },
  { symbol: "MSFT", change: -0.12 },
  { symbol: "GOOGL", change: 0.87 },
  { symbol: "AMZN", change: -0.34 },
  { symbol: "NVDA", change: 3.42 },
  { symbol: "RELIANCE", change: 0.65 },
  { symbol: "HDFCBANK", change: -0.28 },
  { symbol: "TSLA", change: -2.11 },
];

function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {TICKER_ITEMS.map((item, index) => {
        const isPositive = item.change >= 0;
        return (
          <span
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-2 px-6 font-mono-tight text-xs tracking-wide"
          >
            <span className="text-muted">{item.symbol}</span>
            <span className={cn(isPositive ? "text-primary" : "text-danger")}>
              {isPositive ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Fixed bottom ticker bar, purely a front-end animation (no live market
 * data). Duplicates the row once so the CSS translateX(-50%) loop reads
 * as a seamless, infinite scroll.
 */
export function Ticker() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 h-11 overflow-hidden border-t border-white/10 bg-background/90 backdrop-blur-md"
      role="marquee"
      aria-label="Illustrative market ticker"
    >
      <div
        className={cn(
          "flex h-full items-center",
          !prefersReducedMotion && "w-max animate-ticker-scroll"
        )}
      >
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
    </div>
  );
}
