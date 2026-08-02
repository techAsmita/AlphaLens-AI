import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TriangleAlert, RefreshCcw, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanySummary } from "@/components/dashboard/CompanySummary";
import { CompanySummarySkeleton } from "@/components/dashboard/CompanySummarySkeleton";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { SignalCardSkeleton } from "@/components/dashboard/SignalCardSkeleton";
import { EvidencePanel } from "@/components/dashboard/EvidencePanel";
import { EvidencePanelSkeleton } from "@/components/dashboard/EvidencePanelSkeleton";
import { DashboardTimeline } from "@/components/dashboard/DashboardTimeline";
import { DashboardTimelineSkeleton } from "@/components/dashboard/DashboardTimelineSkeleton";
import { useCompany } from "@/context/CompanyContext";

/**
 * The "/dashboard" route: the real AlphaLens Intelligence Dashboard.
 *
 * Reads exclusively from CompanyContext, which in turn loads data
 * exclusively through the intelligence service
 * (src/services/intelligence.ts) — this component never calls the
 * backend directly. Requires a company to have been selected (via the
 * Analysis Workspace); if none is selected, it redirects back to
 * "/analysis".
 *
 * Three states, driven entirely by context:
 *  - Loading:  every section shows a skeleton
 *  - Success:  everything animates in from the resolved report
 *  - Failure:  a centered error panel replaces the report, with a
 *              Retry action that re-runs the same request
 */
export function Dashboard() {
  const navigate = useNavigate();
  const { selectedCompany, report, isLoading, error, retry } = useCompany();

  const [selectedSignalId, setSelectedSignalId] = useState<string>("");

  useEffect(() => {
    if (!selectedCompany) {
      navigate("/analysis", { replace: true });
    }
  }, [selectedCompany, navigate]);

  useEffect(() => {
    if (report && report.signals.length > 0) {
      setSelectedSignalId(report.signals[0].id);
    }
  }, [report]);

  if (!selectedCompany) return null;

  if (error && !isLoading) {
    return (
      <div className="relative min-h-screen">
        <DashboardHeader />
        <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex max-w-md flex-col items-center rounded-xl border border-danger/30 bg-card p-8 text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
              <TriangleAlert size={20} />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-text">
              Couldn't load the intelligence report
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button type="button" variant="primary" icon={<RefreshCcw size={16} />} onClick={retry}>
                Retry
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate("/analysis")}
              >
                Back to Workspace
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  const selectedSignal =
    report?.signals.find((signal) => signal.id === selectedSignalId) ??
    report?.signals[0] ??
    null;
  const selectedEvidence =
    report?.evidence.find((entry) => entry.signalId === selectedSignal?.id) ??
    report?.evidence[0] ??
    null;

  const showSkeleton = isLoading || !report || !selectedSignal || !selectedEvidence;

  return (
    <div className="relative min-h-screen pb-4">
      <DashboardHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Container className="pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {showSkeleton || !report ? (
              <CompanySummarySkeleton />
            ) : (
              <motion.div
                key={`summary-${report.ticker}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full lg:w-[280px] lg:shrink-0"
              >
                <CompanySummary report={report} />
              </motion.div>
            )}

            <div className="min-w-0 flex-1">
              <motion.div
                key={`heading-${report?.ticker ?? "loading"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="text-2xl font-semibold text-text sm:text-3xl">
                  Intelligence Report
                </h2>
                <p className="mt-2 text-sm text-muted sm:text-base">
                  {showSkeleton || !report
                    ? `Loading signals for ${selectedCompany.name}...`
                    : report.summary}
                </p>
              </motion.div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {showSkeleton || !report
                  ? report?.signals.map((signal) => (
                      <SignalCardSkeleton key={signal.id} />
                    )) ?? [0, 1, 2, 3].map((index) => <SignalCardSkeleton key={index} />)
                  : report.signals.map((signal, index) => (
                      <motion.div
                        key={signal.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
                      >
                        <SignalCard
                          signal={signal}
                          isSelected={signal.id === selectedSignalId}
                          onSelect={() => setSelectedSignalId(signal.id)}
                        />
                      </motion.div>
                    ))}
              </div>
            </div>

            {showSkeleton || !selectedSignal || !selectedEvidence ? (
              <EvidencePanelSkeleton />
            ) : (
              <EvidencePanel signal={selectedSignal} evidence={selectedEvidence} />
            )}
          </div>
        </Container>
      </motion.div>

      <div className="mt-10">
        {showSkeleton || !report ? (
          <DashboardTimelineSkeleton />
        ) : (
          <motion.div
            key={`timeline-${report.ticker}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <DashboardTimeline entries={report.timeline} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
