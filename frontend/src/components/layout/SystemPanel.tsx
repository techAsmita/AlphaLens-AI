import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FeedStatus {
  label: string;
  status: "READY" | "SYNCING";
}

const FEEDS: FeedStatus[] = [
  { label: "Earnings", status: "READY" },
  { label: "Filings", status: "READY" },
  { label: "News", status: "READY" },
];

const CONFIDENCE_BASELINE = 98.2;
const LATENCY_BASELINE = 0.43;

/**
 * Floating "SYSTEM STATUS" card, styled after a terminal telemetry panel.
 * Confidence and latency values drift within a tight, believable band to
 * read as a live system rather than a static mock — purely cosmetic,
 * no real backend behind it yet.
 *
 * This panel is decoration for the hero only. Because it's fixed to the
 * viewport, it would otherwise float over every section below the hero
 * as the page scrolls — so it watches the "#signal" hero section and
 * fades out (without unmounting) once that section is no longer in view.
 */
export function SystemPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [confidence, setConfidence] = useState(CONFIDENCE_BASELINE);
  const [latency, setLatency] = useState(LATENCY_BASELINE);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setConfidence(CONFIDENCE_BASELINE + (Math.random() * 0.4 - 0.2));
      setLatency(LATENCY_BASELINE + (Math.random() * 0.06 - 0.03));
    }, 2600);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const heroSection = document.getElementById("signal");
    if (!heroSection) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: isHeroVisible ? 1 : 0, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-none fixed right-8 top-1/2 z-40 hidden w-[280px] -translate-y-1/2 rounded-xl border border-white/10 bg-card/80 p-5 backdrop-blur-md xl:block"
      style={{ boxShadow: "0 0 0 1px rgba(0, 245, 155, 0.06), 0 20px 60px -20px rgba(0,0,0,0.6)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono-tight text-[11px] tracking-widest text-muted">
          SYSTEM STATUS
        </span>
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
      </div>

      <ul className="mb-4 flex flex-col gap-2.5">
        {FEEDS.map((feed) => (
          <li key={feed.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
              {feed.label}
            </span>
            <span className="font-mono-tight text-[11px] tracking-wide text-primary">
              {feed.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-4 h-px w-full bg-white/10" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted">Signal Engine</span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono-tight text-[10px] tracking-widest text-primary">
          ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] text-muted">AI Confidence</div>
          <div className="font-mono-tight text-xl text-text">
            {confidence.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[11px] text-muted">Latency</div>
          <div className="font-mono-tight text-xl text-text">
            {latency.toFixed(2)}s
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
