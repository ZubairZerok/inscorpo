"use client";

import { useEffect } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-8 py-16">
      {/* #45: Branded SVG illustration */}
      <div className="relative">

        <div
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(145deg, #060F24, #0F2040)",
            border: "1px solid rgba(37,99,235,0.3)",
          }}
        >
          {/* Animated scan line */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div
              className="absolute inset-x-0 h-px opacity-60"
              style={{
                background: "linear-gradient(90deg, transparent, #2563EB, transparent)",
                animation: "shimmer 2s linear infinite",
                top: "40%",
              }}
            />
          </div>
          <AlertTriangle size={32} className="text-red-400 relative z-10" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.15)" }}>
          Error Encountered
        </div>
        {/* #62: Proper h1 hierarchy */}
        <h1 className="text-[22px] font-bold" style={{ color: "var(--corp-text)" }}>
          Something went wrong
        </h1>
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
          We had trouble loading this page. This is usually caused by a temporary network issue or a database timeout. Your data is safe.
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono px-3 py-1.5 rounded-lg inline-block"
            style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text-tertiary)" }}>
            ref: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* #97: Minimum 44×44px touch target */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all active:scale-[0.97] min-h-[44px]"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold transition-colors hover:bg-corp-accent-light dark:hover:bg-white/5 min-h-[44px]"
          style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text-secondary)" }}
        >
          <Home size={14} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
