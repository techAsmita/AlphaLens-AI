import { Card } from "@/components/ui/Card";

/**
 * Pulsing placeholder matching CompanySummary's shape, shown while the
 * dashboard is "loading" a newly selected company's report.
 */
export function CompanySummarySkeleton() {
  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <Card className="flex animate-pulse flex-col gap-5">
        <div>
          <div className="h-3 w-12 rounded bg-white/10" />
          <div className="mt-2 h-5 w-32 rounded bg-white/10" />
          <div className="mt-1.5 h-3 w-24 rounded bg-white/5" />
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="h-3 w-20 rounded bg-white/5" />
        </div>

        <div>
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="mt-2 h-7 w-16 rounded bg-white/10" />
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <div className="h-9 w-full rounded-md bg-white/5" />
          <div className="h-9 w-full rounded-md bg-white/5" />
        </div>
      </Card>
    </aside>
  );
}
