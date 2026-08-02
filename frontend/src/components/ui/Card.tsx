import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds an accent border colored by intent, matching AlphaLens signal flags. */
  accent?: "none" | "primary" | "secondary" | "danger";
}

const accentStyles: Record<NonNullable<CardProps["accent"]>, string> = {
  none: "border-white/10",
  primary: "border-primary/40",
  secondary: "border-secondary/40",
  danger: "border-danger/40",
};

/**
 * Base surface for grouped content: signal tiles, stat panels,
 * evidence blocks, team cards.
 */
export function Card({ children, className, accent = "none", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6",
        accentStyles[accent],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
