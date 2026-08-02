import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { CompanyReport } from "@/services/intelligence";

interface CompanySummaryProps {
  report: CompanyReport;
}

/**
 * Left sidebar of the Intelligence Dashboard: which company this report
 * is for, whether the market is open, the overall AI confidence, and
 * actions to start over or head back to the workspace. Every field here
 * comes straight from the CompanyReport returned by the intelligence
 * service — nothing is hardcoded.
 */
export function CompanySummary({ report }: CompanySummaryProps) {
  const navigate = useNavigate();
  const isMarketOpen = report.marketStatus.toLowerCase().includes("open");

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <Card className="flex flex-col gap-5">
        <div>
          <div className="font-mono-tight text-xs tracking-widest text-primary">
            {report.ticker}
          </div>
          <div className="mt-1 text-lg font-semibold text-text">{report.company}</div>
          <div className="mt-0.5 text-sm text-muted">{report.sector}</div>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Market Status</span>
          <span className="flex items-center gap-2 text-text">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isMarketOpen ? "animate-pulse-dot bg-primary" : "bg-muted/50"
              )}
            />
            {report.marketStatus}
          </span>
        </div>

        <div>
          <div className="text-[11px] text-muted">AI Confidence</div>
          <div className="font-mono-tight text-2xl text-text">
            {report.confidence.toFixed(1)}%
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Button
            type="button"
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/analysis")}
            className="w-full"
          >
            New Analysis
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Back
          </Button>
        </div>
      </Card>
    </aside>
  );
}
