import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Removes the default vertical padding when a page needs custom spacing. */
  noPadding?: boolean;
}

/**
 * A full-width section wrapper with consistent vertical rhythm.
 * Compose with <Container> inside for constrained content.
 */
export function Section({ children, className, noPadding = false, ...props }: SectionProps) {
  return (
    <section
      className={cn(!noPadding && "py-20 sm:py-28", "relative", className)}
      {...props}
    >
      {children}
    </section>
  );
}
