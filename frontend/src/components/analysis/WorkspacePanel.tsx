import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStateIllustration } from "@/components/analysis/EmptyStateIllustration";
import { useCompany } from "@/context/CompanyContext";
import type { Company } from "@/lib/companies";

interface WorkspacePanelProps {
  selectedCompany: Company | null;
}

/**
 * Center column of the Analysis Workspace. Shows the page heading, an
 * empty state until a company is selected from the watchlist, and the
 * primary "Analyze Company" action (disabled until a selection exists).
 * Clicking it selects the company in CompanyContext — which kicks off
 * the real report fetch through the intelligence service right away —
 * then moves to the cinematic processing page at "/analysis/process".
 * By the time that sequence finishes, the report is typically already
 * resolved and waiting on the Dashboard.
 */
export function WorkspacePanel({ selectedCompany }: WorkspacePanelProps) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  const handleAnalyze = () => {
    if (!selectedCompany) return;
    selectCompany(selectedCompany);
    navigate("/analysis/process");
  };

  return (
    <div className="min-w-0 flex-1">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold text-text sm:text-3xl">
          Market Intelligence Workspace
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Choose a company to begin AI-powered financial signal analysis.
        </p>
      </motion.div>

      <div className="mt-8 flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-white/10 bg-card/60 p-10 text-center">
        <AnimatePresence mode="wait">
          {!selectedCompany ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <EmptyStateIllustration />
              <h3 className="mt-6 text-lg font-medium text-text">No company selected</h3>
              <p className="mt-1 text-sm text-muted">
                Select a company from the watchlist.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCompany.ticker}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="font-mono-tight text-xs tracking-widest text-primary">
                {selectedCompany.ticker}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-text">
                {selectedCompany.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{selectedCompany.sector}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center lg:justify-start">
        <Button
          type="button"
          variant="primary"
          disabled={!selectedCompany}
          icon={<ArrowRight size={16} />}
          onClick={handleAnalyze}
          className={!selectedCompany ? "cursor-not-allowed opacity-40" : ""}
        >
          Analyze Company
        </Button>
      </div>
    </div>
  );
}
