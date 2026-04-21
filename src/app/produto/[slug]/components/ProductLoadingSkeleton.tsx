export function ProductLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <div className="mb-10 h-3 w-64 animate-pulse bg-[var(--mist)]/70" />
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div
          className="w-full animate-pulse bg-[var(--mist)]/60"
          style={{ aspectRatio: "4 / 5" }}
        />
        <div className="space-y-6 pt-4">
          <div className="h-3 w-24 animate-pulse bg-[var(--mist)]/70" />
          <div className="h-12 w-full animate-pulse bg-[var(--mist)]/70" />
          <div className="h-12 w-2/3 animate-pulse bg-[var(--mist)]/70" />
          <div className="hairline my-6" />
          <div className="h-10 w-40 animate-pulse bg-[var(--mist)]/70" />
          <div className="h-4 w-full animate-pulse bg-[var(--mist)]/70" />
          <div className="h-4 w-5/6 animate-pulse bg-[var(--mist)]/70" />
          <div className="h-14 w-full animate-pulse bg-[var(--mist)]/70" />
        </div>
      </div>
    </div>
  );
}
