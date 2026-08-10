export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-36 rounded-2xl" style={{ background: "var(--corp-surface)" }} />

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl" style={{ background: "var(--corp-surface)" }} />
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 rounded-xl" style={{ background: "var(--corp-surface)" }} />
          <div className="h-48 rounded-xl" style={{ background: "var(--corp-surface)" }} />
        </div>
        <div className="space-y-4">
          <div className="h-36 rounded-xl" style={{ background: "var(--corp-surface)" }} />
          <div className="h-36 rounded-xl" style={{ background: "var(--corp-surface)" }} />
        </div>
      </div>
    </div>
  );
}
