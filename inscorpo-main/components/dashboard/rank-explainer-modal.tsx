"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Zap, ShieldCheck, Crown, Star, Sparkles, Flame, CheckCircle2, ChevronRight, Award, MessageSquare } from "lucide-react";
import { UserState } from "@/lib/state/types";
import { getRankInfo } from "@/components/ui/rank-badge";

interface RankExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: UserState;
}

const RANK_DETAILS = [
  {
    name: "Bronze",
    minXp: 0,
    color: "#CD7F32",
    badgeBg: "bg-amber-800 text-amber-100",
    border: "border-amber-700",
    shadow: "shadow-[5px_5px_0px_0px_#78350f]",
    perk: "Access to Standard Practice Tests & Learning Paths",
    speech: "ROOKIE ANALYST"
  },
  {
    name: "Silver",
    minXp: 2500,
    color: "#9CA3AF",
    badgeBg: "bg-slate-300 text-slate-900",
    border: "border-slate-400",
    shadow: "shadow-[5px_5px_0px_0px_#334155]",
    perk: "Unlocks Silver Passport Badge + AI Resume Evaluator + Challenge Submissions",
    speech: "CORPORATE STRATEGIST"
  },
  {
    name: "Gold",
    minXp: 7500,
    color: "#F59E0B",
    badgeBg: "bg-amber-400 text-amber-950",
    border: "border-amber-500",
    shadow: "shadow-[5px_5px_0px_0px_#78350f]",
    perk: "Unlocks Executive Gold Badge + Priority PPI Interview Queue + 1.25x XP Multiplier",
    speech: "EXECUTIVE CONTENDER"
  },
  {
    name: "Platinum",
    minXp: 15000,
    color: "#38BDF8",
    badgeBg: "bg-sky-400 text-sky-950",
    border: "border-sky-500",
    shadow: "shadow-[5px_5px_0px_0px_#0369a1]",
    perk: "Direct Recruiter Referral + Masterclass Invites + Verified Passport Certification",
    speech: "LEAD ARCHITECT"
  },
  {
    name: "Diamond",
    minXp: 30000,
    color: "#818CF8",
    badgeBg: "bg-indigo-400 text-indigo-950",
    border: "border-indigo-500",
    shadow: "shadow-[5px_5px_0px_0px_#3730a3]",
    perk: "VIP Recruiter Spotlight + Top 1% Hall of Fame Badge + Custom Profile Frame",
    speech: "MNC MASTER DIRECTOR"
  },
  {
    name: "Elite",
    minXp: 50000,
    color: "#F97316",
    badgeBg: "bg-orange-500 text-white",
    border: "border-orange-600",
    shadow: "shadow-[5px_5px_0px_0px_#7c2d12]",
    perk: "1-on-1 Executive Office Hours + Direct MNC Fast-Track Shortlists",
    speech: "INDUSTRY TITAN"
  },
  {
    name: "Legend",
    minXp: 100000,
    color: "#EC4899",
    badgeBg: "bg-pink-500 text-white",
    border: "border-pink-600",
    shadow: "shadow-[5px_5px_0px_0px_#831843]",
    perk: "Lifetime Pro Access + Hall of Fame Trophy + Permanent Executive Endorsement",
    speech: "CORPORATE ROYALTY"
  }
];

export function RankExplainerModal({ isOpen, onClose, state }: RankExplainerModalProps) {
  if (!isOpen) return null;

  const rankInfo = getRankInfo(state.xp);
  const currentRankName = rankInfo.current.name;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 font-mono">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-slate-950 bg-white text-slate-950 p-6 sm:p-8 space-y-6 z-10 shadow-[10px_10px_0px_0px_#2563eb]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] font-black transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000]">
              <Trophy size={16} /> CORPORATE RANKING TIER SYSTEM
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
              <span>UNLOCK YOUR EXECUTIVE RANK</span>
            </h2>
            <p className="text-xs font-sans font-bold text-slate-700 leading-relaxed">
              Earn XP across courses, daily drills, and corporate challenges to level up your corporate rank tier and unlock recruitment referral perks.
            </p>
          </div>

          {/* Current Rank Hero Card */}
          <div className="p-6 rounded-2xl border-4 border-slate-950 bg-blue-600 text-white space-y-4 shadow-[6px_6px_0px_0px_#1e3a8a] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-400 text-amber-950 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000]">
                  YOUR CURRENT TIER
                </span>
                <h3 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2 pt-1 text-white">
                  <span>{currentRankName.toUpperCase()} RANK</span>
                  <span className="text-amber-300 text-sm">({state.xp.toLocaleString()} XP)</span>
                </h3>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-amber-300 text-amber-950 border-2 border-slate-950 font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5">
                <MessageSquare size={14} /> {RANK_DETAILS.find(r => r.name === currentRankName)?.speech || "LEVELING UP"}
              </div>
            </div>

            {/* Rank Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-black">
                <span>PROGRESS TO {rankInfo.next ? rankInfo.next.name.toUpperCase() : "MAX TIER"}</span>
                <span>{rankInfo.progress}%</span>
              </div>
              <div className="h-4 rounded-xl border-2 border-slate-950 bg-slate-900 p-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rankInfo.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-lg bg-amber-400"
                />
              </div>
              {rankInfo.next && (
                <p className="text-[11px] font-bold text-blue-100 text-right">
                  Earn {(rankInfo.next.minXp - state.xp).toLocaleString()} more XP to reach {rankInfo.next.name} Rank
                </p>
              )}
            </div>
          </div>

          {/* All Ranks Breakdown Showcase Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-2">
              <Award size={16} className="text-blue-600" /> COMPLETE RANK TIER DIRECTORY &amp; UNLOCKS
            </h3>

            <div className="space-y-3">
              {RANK_DETAILS.map((r) => {
                const isCurrent = r.name.toLowerCase() === currentRankName.toLowerCase();
                const isUnlocked = state.xp >= r.minXp;

                return (
                  <div
                    key={r.name}
                    className={`p-4 rounded-2xl border-3 border-slate-950 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-amber-300 text-slate-950 border-4 shadow-[5px_5px_0px_0px_#000]"
                        : isUnlocked
                        ? "bg-slate-50 text-slate-900 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000]"
                        : "bg-slate-100 text-slate-400 border-2 border-slate-300 opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase border-2 border-slate-950 ${r.badgeBg}`}>
                        {r.name}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs uppercase text-slate-950">{r.name} Rank</span>
                          <span className="text-[11px] font-bold text-blue-600 font-mono">({r.minXp.toLocaleString()} XP)</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-600 text-white border border-slate-950">
                              ACTIVE TIER
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans font-semibold text-slate-700 mt-0.5">
                          {r.perk}
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto flex-shrink-0">
                      {isUnlocked ? (
                        <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-emerald-500 text-white border-2 border-slate-950 flex items-center gap-1 shadow-[2px_2px_0px_0px_#000]">
                          <CheckCircle2 size={13} /> Unlocked
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-slate-200 text-slate-600 border border-slate-400">
                          Locked ({r.minXp.toLocaleString()} XP)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase text-white bg-blue-600 hover:bg-blue-700 transition-all border-4 border-slate-950 shadow-[6px_6px_0px_0px_#000] cursor-pointer"
          >
            CONTINUE LEARNING
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
