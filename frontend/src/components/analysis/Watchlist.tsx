import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { CompanyCard } from "@/components/analysis/CompanyCard";
import type { Company } from "@/lib/companies";

interface WatchlistProps {
  companies: Company[];
  selectedTicker: string | null;
  onSelect: (ticker: string) => void;
}

/**
 * Left sidebar of the Analysis Workspace: a searchable list of watchlist
 * companies. Selection is single-select and lifted to the parent page so
 * the center workspace can react to it.
 */
export function Watchlist({ companies, selectedTicker, onSelect }: WatchlistProps) {
  const [query, setQuery] = useState("");

  const filtered = companies.filter((company) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      company.name.toLowerCase().includes(needle) ||
      company.ticker.toLowerCase().includes(needle)
    );
  });

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono-tight text-xs tracking-widest text-muted">
          WATCHLIST
        </span>
        <span className="font-mono-tight text-[11px] text-muted">
          {filtered.length}
        </span>
      </div>

      <div className="relative mb-4">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search companies..."
          aria-label="Search watchlist"
          className="w-full rounded-md border border-white/10 bg-card py-2 pl-9 pr-3 text-sm text-text placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2.5 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
        <AnimatePresence>
          {filtered.map((company) => (
            <CompanyCard
              key={company.ticker}
              company={company}
              isSelected={company.ticker === selectedTicker}
              onSelect={() => onSelect(company.ticker)}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">No matches found.</p>
        )}
      </div>
    </aside>
  );
}
