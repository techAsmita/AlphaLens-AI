import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { Watchlist } from "@/components/analysis/Watchlist";
import { WorkspacePanel } from "@/components/analysis/WorkspacePanel";
import { RecentAnalyses } from "@/components/analysis/RecentAnalyses";
import { COMPANIES } from "@/lib/companies";

/**
 * The "/analysis" route: a 3-column workspace (watchlist, center
 * workspace, recent analyses) beneath a sticky header. Columns stack on
 * mobile/tablet and sit side by side from the `lg` breakpoint up.
 */
export function Analysis() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const selectedCompany = COMPANIES.find((c) => c.ticker === selectedTicker) ?? null;

  return (
    <div className="relative min-h-screen pb-16">
      <AnalysisHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Container className="pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <Watchlist
              companies={COMPANIES}
              selectedTicker={selectedTicker}
              onSelect={setSelectedTicker}
            />
            <WorkspacePanel selectedCompany={selectedCompany} />
            <RecentAnalyses />
          </div>
        </Container>
      </motion.div>
    </div>
  );
}
