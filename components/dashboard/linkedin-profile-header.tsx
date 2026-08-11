"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play, ShieldCheck, Share2, MapPin, Building2, GraduationCap,
  Award, Sparkles, CheckCircle2, ArrowRight, Flame, Target, Zap, Trophy
} from "lucide-react";
import Link from "next/link";
import { UserState } from "@/lib/state/types";
import { RankBadge, getRankInfo, getContrastColor } from "@/components/ui/rank-badge";
import { RankExplainerModal } from "@/components/dashboard/rank-explainer-modal";

interface LinkedInProfileHeaderProps {
  state: UserState;
  currentRank: { name: string; color?: string; gradient?: string; shadowColor?: string };
  xpProgress: number;
  nextLevelXp: number;
}

export function LinkedInProfileHeader({
  state,
  currentRank,
  xpProgress,
  nextLevelXp,
}: LinkedInProfileHeaderProps) {
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const activeSlug = state.enrolledPathSlugs[0] || "corporate-mto";
  const firstName = state.name ? state.name.split(" ")[0] : "হাসান";
  const initials = state.name ? state.name.substring(0, 2).toUpperCase() : "EX";
  const pp = state.passportProfile;

  const headline = pp?.headline || "Management Trainee Candidate | Business Analytics & Excel Specialist";
  const university = pp?.university || "Bangladesh Agricultural University (BAU)";
  const location = pp?.location || "Dhaka, Bangladesh";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border-2 border-blue-400 p-4 sm:p-5 text-white font-sans relative overflow-hidden"
      style={{
        background: "#2563eb",
        boxShadow: "4px 4px 0px 0px #1e3a8a",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Side: Avatar + Details */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white text-[#2563eb] flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0 border-2 border-white shadow-md overflow-hidden">
              {pp?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pp.photoUrl} alt={state.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono">{initials}</span>
              )}
            </div>

            {/* Main Text Content */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-bangla text-white">
                  স্বাগতম, {firstName}
                </h1>

                {/* Interactive Rank Badge */}
                {(() => {
                  const { current: rankData } = getRankInfo(state.xp);
                  const rankTextCol = getContrastColor(rankData.color);
                  return (
                    <div
                      onClick={() => setRankModalOpen(true)}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-extrabold uppercase flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        background: rankData.gradient,
                        color: rankTextCol,
                        boxShadow: `0 2px 6px ${rankData.shadowColor}44`,
                        border: `2px solid ${rankData.shadowColor}66`,
                      }}
                      title="Click to view Rank Tiers & Perks"
                    >
                      <RankBadge rank={rankData} size="xs" />
                      {rankData.name} Rank
                    </div>
                  );
                })()}

                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-950 animate-pulse" />
                  Open to Opportunities
                </span>
              </div>

              <p className="text-xs font-semibold text-blue-100 line-clamp-1 font-mono">
                {headline}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-mono text-blue-200">
                <span className="flex items-center gap-1 font-bold">
                  <MapPin size={12} /> {location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold">
                  <GraduationCap size={12} /> {university}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1 font-bold text-blue-100">
                  <Building2 size={12} /> INSYT Corporate Scholar
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/20">
            <Link
              href={`/learn/${activeSlug}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ boxShadow: "2px 2px 0px 0px #78350f" }}
            >
              <Play size={12} fill="currentColor" /> Resume Track
            </Link>

            <Link
              href="/career-passport"
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-white bg-blue-900/90 hover:bg-blue-900 transition-all border border-white/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Career Passport <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <RankExplainerModal isOpen={rankModalOpen} onClose={() => setRankModalOpen(false)} state={state} />
    </motion.div>
  );
}
