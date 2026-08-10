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
      className="rounded-xl border-2 border-blue-400 p-6 sm:p-7 text-white font-sans relative overflow-hidden"
      style={{
        background: "#2563eb",
        boxShadow: "5px 5px 0px 0px #1e3a8a",
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

      <div className="relative z-10 space-y-5">
        {/* Top Header Row: Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm flex items-center gap-1.5">
              <ShieldCheck size={14} /> VERIFIED CANDIDATE
            </span>

            {/* Interactive Rank-colored badge */}
            {(() => {
              const { current: rankData } = getRankInfo(state.xp);
              const rankTextCol = getContrastColor(rankData.color);
              return (
                <div
                  onClick={() => setRankModalOpen(true)}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    background: rankData.gradient,
                    color: rankTextCol,
                    boxShadow: `0 2px 8px ${rankData.shadowColor}55`,
                    border: `1px solid ${rankData.shadowColor}66`,
                  }}
                  title="Click to view Rank Tiers & Perks"
                >
                  <RankBadge rank={rankData} size="xs" />
                  {rankData.name} Rank
                </div>
              );
            })()}

            <span className="px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-blue-900/80 text-blue-100 border border-white/20 flex items-center gap-1">
              <Zap size={13} className="fill-amber-300 text-amber-300" /> Level {state.level} ({state.xp.toLocaleString()} XP)
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono font-bold text-blue-100">
            <Building2 size={13} /> INSYT Corporate Scholar
          </div>
        </div>

        {/* Middle Row: Avatar + Name + Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white text-[#2563eb] flex items-center justify-center text-2xl font-black flex-shrink-0 border-2 border-white shadow-md overflow-hidden">
            {pp?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pp.photoUrl} alt={state.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono">{initials}</span>
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-black font-bangla text-white flex items-center gap-2">
              স্বাগতম, {firstName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-blue-100 line-clamp-2 font-mono">
              {headline}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-blue-200 pt-1">
              <span className="flex items-center gap-1 font-bold">
                <MapPin size={13} /> {location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold">
                <GraduationCap size={13} /> {university}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Actions Bar */}
        <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-950 animate-pulse" />
            <span>Open to Corporate & MTO Opportunities</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href={`/learn/${activeSlug}`}
              className="px-5 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 flex items-center gap-1.5 cursor-pointer"
              style={{ boxShadow: "3px 3px 0px 0px #78350f" }}
            >
              <Play size={12} fill="currentColor" /> Resume Track
            </Link>

            <Link
              href="/career-passport"
              className="px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-white bg-blue-900/90 hover:bg-blue-900 transition-all border border-white/30 flex items-center gap-1.5 cursor-pointer"
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
