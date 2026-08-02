/**
 * Pulsing placeholder matching EvidencePanel's shape, shown while the
 * dashboard is "loading" a newly selected company's dataset.
 */
export function EvidencePanelSkeleton() {
  return (
    <aside className="w-full lg:w-[320px] lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono-tight text-xs tracking-widest text-muted">
          EVIDENCE
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-6 w-24 animate-pulse rounded-full bg-white/5" />
        ))}
      </div>

      <div className="flex animate-pulse flex-col gap-3">
        <div className="rounded-xl border border-white/10 bg-card p-6">
          <div className="h-5 w-28 rounded-full bg-white/10" />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="h-3 w-12 rounded bg-white/5" />
              <div className="mt-2 h-4 w-20 rounded bg-white/10" />
            </div>
            <div>
              <div className="h-3 w-16 rounded bg-white/5" />
              <div className="mt-2 h-4 w-10 rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-6">
          <div className="h-3 w-12 rounded bg-white/5" />
          <div className="mt-3 h-4 w-full rounded bg-white/10" />
          <div className="mt-1.5 h-4 w-3/4 rounded bg-white/10" />
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-6">
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="mt-3 h-4 w-full rounded bg-white/10" />
          <div className="mt-1.5 h-4 w-2/3 rounded bg-white/10" />
        </div>
      </div>
    </aside>
  );
}
