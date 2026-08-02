import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Fixed, full-viewport backdrop for the terminal-style landing page:
 * - a faint blueprint grid with a slow ambient drift
 * - a drifting primary-colored glow anchored top-center
 * - a faint secondary-colored glow anchored bottom-right, for depth
 * - a thin scan line that sweeps top to bottom, echoing a terminal readout
 * - a very light animated noise texture for tactile, non-flat depth
 *
 * Purely decorative and non-interactive; sits behind all page content.
 * All motion is disabled when the user prefers reduced motion.
 */
export function GridBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Blueprint grid */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.07]",
          !prefersReducedMotion && "animate-grid-drift"
        )}
        style={{
          backgroundImage:
            "linear-gradient(to right, #5CF2FF 1px, transparent 1px), linear-gradient(to bottom, #5CF2FF 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Primary glow, top-center, slow drift */}
      <div
        className={cn(
          "absolute left-1/2 top-[-10%] h-[560px] w-[860px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]",
          !prefersReducedMotion && "animate-glow-drift"
        )}
        style={{ backgroundColor: "#00F59B" }}
      />

      {/* Secondary glow, bottom-right, stationary and very faint */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[480px] w-[640px] rounded-full opacity-[0.06] blur-[140px]"
        style={{ backgroundColor: "#5CF2FF" }}
      />

      {/* Scan line sweep */}
      {!prefersReducedMotion && (
        <div
          className="animate-scan-line absolute inset-x-0 h-px opacity-50"
          style={{
            background:
              "linear-gradient(to right, transparent, #5CF2FF, transparent)",
            boxShadow: "0 0 8px 1px rgba(92, 242, 255, 0.4)",
          }}
        />
      )}

      {/* Subtle animated noise */}
      <div
        className={cn(
          "absolute inset-0 mix-blend-overlay opacity-[0.03]",
          !prefersReducedMotion && "animate-noise-flicker"
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}
