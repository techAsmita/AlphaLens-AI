/**
 * Pulsing placeholder matching SignalCard's shape, shown while the
 * dashboard is "loading" a newly selected company's dataset.
 */
export function SignalCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-white/10 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-lg bg-white/5" />
        <div className="h-5 w-14 rounded-full bg-white/5" />
      </div>
      <div>
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="mt-2 h-3 w-full rounded bg-white/5" />
        <div className="mt-1.5 h-3 w-4/5 rounded bg-white/5" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-16 rounded bg-white/5" />
        <div className="h-3 w-8 rounded bg-white/5" />
      </div>
    </div>
  );
}
