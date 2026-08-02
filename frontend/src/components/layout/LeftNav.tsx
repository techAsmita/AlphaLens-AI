import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  index: string;
  label: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { index: "01", label: "Signal", id: "signal" },
  { index: "02", label: "Analysis", id: "analysis" },
  { index: "03", label: "Intelligence", id: "intelligence" },
  { index: "04", label: "Evidence", id: "evidence" },
  { index: "05", label: "Timeline", id: "timeline" },
  { index: "06", label: "Team", id: "team" },
];

/**
 * Fixed vertical navigation for the terminal-style landing page, styled
 * after a Bloomberg/Linear-esque section index. Tracks whichever
 * `[data-nav-section]` element is currently most in view via
 * IntersectionObserver and animates a glowing indicator to match.
 *
 * Only sections that exist in the DOM are ever marked active — items
 * without a matching section simply act as a preview of what's coming
 * next, without breaking anything.
 */
export function LeftNav() {
  const [activeId, setActiveId] = useState<string>("signal");

  useEffect(() => {
    const sections = document.querySelectorAll("[data-nav-section]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const id = visible.target.getAttribute("data-nav-section");
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 pl-8 lg:block"
    >
      <ul className="flex w-44 flex-col gap-5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group relative flex items-center gap-3 py-1"
                aria-current={isActive ? "true" : undefined}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  {isActive && (
                    <motion.span
                      layoutId="left-nav-active-ring"
                      className="absolute inset-0 rounded-full border border-primary/50"
                      transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    />
                  )}
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                      isActive ? "bg-primary" : "bg-white/20 group-hover:bg-white/40"
                    )}
                  />
                </span>

                <span
                  className={cn(
                    "font-mono-tight text-[11px] transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted/70 group-hover:text-muted"
                  )}
                >
                  {item.index}
                </span>

                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isActive ? "text-text" : "text-muted/60 group-hover:text-muted"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
