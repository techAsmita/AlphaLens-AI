import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/companies";

interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * A single selectable watchlist entry. Renders ticker, name, sector, and
 * last-updated time, with a subtle lift on hover and a highlighted,
 * checked state when selected.
 */
export function CompanyCard({ company, isSelected, onSelect }: CompanyCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-pressed={isSelected}
      className={cn(
        "w-full rounded-lg border p-3.5 text-left transition-colors duration-200",
        isSelected
          ? "border-primary/50 bg-primary/5"
          : "border-white/10 bg-card hover:border-white/25"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-mono-tight text-xs tracking-wide",
            isSelected ? "text-primary" : "text-text"
          )}
        >
          {company.ticker}
        </span>
        {isSelected && <Check size={12} className="text-primary" />}
      </div>
      <div className="mt-1 truncate text-sm text-text">{company.name}</div>
      <div className="mt-0.5 text-xs text-muted">{company.sector}</div>
      <div className="mt-3 text-[11px] text-muted/70">Updated {company.lastUpdated}</div>
    </motion.button>
  );
}
