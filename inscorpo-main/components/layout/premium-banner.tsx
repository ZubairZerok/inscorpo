"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

const ROUTE_MESSAGES: { route: string; text: string; cta: string }[] = [
  { route: "/mock-tests", text: "Unlock unlimited practice tests & detailed analytics", cta: "Go Pro" },
  { route: "/mock-interviews", text: "Get unlimited AI-powered mock interview sessions", cta: "Go Pro" },
  { route: "/ai", text: "Access the full 12-tool AI Suite — the ultimate career arsenal", cta: "Go Pro" },
  { route: "/certificates", text: "Generate verified, employer-trusted digital certificates", cta: "Go Pro" },
  { route: "/career-passport", text: "Export ATS-optimized executive PDF resumes instantly", cta: "Go Pro" },
  { route: "/learn", text: "Unlock all 8+ executive learning paths & career tracks", cta: "Go Pro" },
  { route: "/leaderboard", text: "See your true global rank with advanced leaderboard filters", cta: "Go Pro" },
];

const DEFAULT = {
  text: "Upgrade to unlock all learning paths, certificates & AI tools —",
  brand: "INSYT Pro",
  cta: "Upgrade Now",
};

export function PremiumBanner() {
  const pathname = usePathname();
  const { state } = useUser();

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("insyt-premium-banner-dismissed") === "true";
    }
    return false;
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isStarter = !state.subscriptionTier || state.subscriptionTier === "starter";
  if (!isStarter || dismissed || !mounted) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("insyt-premium-banner-dismissed", "true");
    }
  };

  const match = ROUTE_MESSAGES.find((item) => pathname.startsWith(item.route));

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden flex-shrink-0 relative z-30 hidden sm:block"
        >
          <div
            className="relative flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 text-[11px] sm:text-[12px] font-medium overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #0a0f1e 0%, #0d1b2a 25%, #162032 50%, #0d1b2a 75%, #0a0f1e 100%)",
              color: "rgba(255,255,255,0.88)",
              borderBottom: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            {/* Animated shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.06) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 4s linear infinite",
              }}
            />

            {/* Crown icon */}
            <Crown size={13} className="flex-shrink-0 relative z-10" style={{ color: "#F59E0B" }} />

            {/* Message */}
            <span className="relative z-10 text-center max-w-[400px] sm:max-w-none leading-tight">
              {match ? (
                <>
                  <span className="text-white/80">{match.text} — </span>
                  <span className="font-black text-[#F59E0B]">INSYT Pro</span>
                </>
              ) : (
                <>
                  <span className="text-white/80">{DEFAULT.text} </span>
                  <span className="font-black text-[#F59E0B]">{DEFAULT.brand}</span>
                </>
              )}
            </span>

            {/* CTA */}
            <Link
              href="/subscription"
              className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wide transition-all hover:opacity-90 hover:scale-105 flex-shrink-0 ml-1"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                color: "#0a0f1e",
                boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
              }}
            >
              <Zap size={10} className="fill-current" />
              {match ? match.cta : DEFAULT.cta}
              <ChevronRight size={10} />
            </Link>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="relative z-10 w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0 ml-0.5 active:scale-95"
              aria-label="Dismiss banner"
            >
              <X size={13} className="text-white/50" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
