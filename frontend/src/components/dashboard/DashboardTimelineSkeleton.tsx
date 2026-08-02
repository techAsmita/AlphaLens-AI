/**
 * Pulsing placeholder matching DashboardTimeline's shape, shown while
 * the dashboard is "loading" a newly selected company's report.
 */
export function DashboardTimelineSkeleton() {
  return (
    <div className="border-t border-white/10 bg-background/60">
      <div className="mx-auto w-full max-w-container px-6 py-5 sm:px-8 lg:px-10">
        <div className="mb-4 font-mono-tight text-xs tracking-widest text-muted">
          TIMELINE
        </div>
        <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-1 items-center gap-3">
              <div className="h-6 w-6 shrink-0 rounded-full bg-white/5" />
              <div className="flex-1">
                <div className="h-3 w-10 rounded bg-white/10" />
                <div className="mt-1.5 h-3 w-20 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
