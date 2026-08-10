"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, User, Palette, Cpu, Briefcase, HelpCircle, Code, GraduationCap,
  Trophy, ChevronDown, Database, ShieldCheck
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { cn } from "@/lib/utils";
import { getRankInfo, RankBadge, getContrastColor } from "@/components/ui/rank-badge";

const CATEGORIES = [
  { id: "global", label: "Global Ranking", icon: Globe },
  { id: "female", label: "Female Leaders", icon: User },
  { id: "arts", label: "Arts & Science", icon: Palette },
  { id: "engineering", label: "Engineering", icon: Cpu },
  { id: "management", label: "Management & Business", icon: Briefcase },
  { id: "quiz", label: "Quiz Champions", icon: HelpCircle },
  { id: "hackathon", label: "Hackathon Solvers", icon: Code },
  { id: "college", label: "University & College", icon: GraduationCap },
];

export default function LeaderboardPage() {
  const { state } = useUser();
  const [seasonTab, setSeasonTab] = useState<"live" | "previous">("live");
  const [activeCategory, setActiveCategory] = useState("global");

  const categoryName = CATEGORIES.find((c) => c.id === activeCategory)?.label || "Global Ranking";

  // Filter existing external database profiles from Appwrite DB
  const externalProfiles = state.leaderboard.filter(
    (u) => u.name !== state.name && u.id !== "me"
  );

  // Construct true full leaderboard merging active user state and Appwrite DB records
  const currentUserEntry = {
    id: "me",
    name: state.name || "Executive Learner",
    university: state.passportProfile?.university || "Bangladesh Agricultural University (BAU), Mymensingh",
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    isUser: true,
    certificates: state.courseProgress.filter((c) => c.progress === 100).length,
  };

  const fullLeaderboard = [...externalProfiles, currentUserEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((u, i) => ({
      ...u,
      rank: i + 1,
      university: (u as any).university || "University of Dhaka (DU), Dhaka",
      certificates: typeof (u as any).certificates === "number" ? (u as any).certificates : Math.max(0, Math.floor((u.xp || 0) / 1000)),
    }));

  const { current: userRank } = getRankInfo(state.xp);
  const userRankTextColor = getContrastColor(userRank.color);
  const myEntry = fullLeaderboard.find((u) => u.isUser);

  // Podium contains up to top 3 real entries from database
  const topThree = fullLeaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Controls Bar: Season Dropdown + Category Selector + Unified Rank Badge */}
      <div
        className="rounded-xl border-2 border-blue-500 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-slate-900"
        style={{ background: "var(--corp-surface)", boxShadow: "5px 5px 0px 0px #2563eb" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Season Dropdown */}
          <div className="relative">
            <label className="text-[10px] uppercase font-black text-corp-text-tertiary block mb-1">
              Select Season
            </label>
            <div className="relative">
              <select
                value={seasonTab}
                aria-label="Select Season"
                onChange={(e) => setSeasonTab(e.target.value as "live" | "previous")}
                className="appearance-none bg-corp-surface text-corp-text font-extrabold text-xs px-4 py-2.5 pr-8 rounded-lg border-2 border-blue-400 focus:outline-none focus:border-[#2563eb] uppercase tracking-wider cursor-pointer min-h-[44px]"
              >
                <option value="live">Live Active Season (2026)</option>
                <option value="previous">Previous Archived Season (2025)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-[#2563eb] pointer-events-none" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <label className="text-[10px] uppercase font-black text-corp-text-tertiary block mb-1">
              Select Category
            </label>
            <div className="relative">
              <select
                value={activeCategory}
                aria-label="Select Category"
                onChange={(e) => setActiveCategory(e.target.value)}
                className="appearance-none bg-corp-surface text-corp-text font-extrabold text-xs px-4 py-2.5 pr-8 rounded-lg border-2 border-blue-400 focus:outline-none focus:border-[#2563eb] uppercase tracking-wider cursor-pointer min-h-[44px]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-[#2563eb] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* User Rank Badge */}
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono font-extrabold uppercase border-2 shadow-sm"
          style={{
            background: userRank.gradient,
            color: userRankTextColor,
            borderColor: userRank.shadowColor,
          }}
        >
          <RankBadge rank={userRank} size="xs" />
          <span>{userRank.name} Rank</span>
          <span className="opacity-80 text-[10px]">• Rank #{myEntry?.rank || 1}</span>
        </div>
      </div>

      {/* Database Verification Notice */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border-2 border-blue-400 bg-corp-surface font-mono text-xs text-corp-text-secondary">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-[#2563eb]" />
          <span>Showing Live Registered Accounts from Appwrite DB ({fullLeaderboard.length} Account{fullLeaderboard.length !== 1 ? "s" : ""})</span>
        </div>
        <span className="text-[10px] font-bold text-[#2563eb] uppercase flex items-center gap-1">
          <ShieldCheck size={12} /> Real DB Query
        </span>
      </div>

      {/* Podium Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
        {topThree.map((user, idx) => {
          const rankPos = idx + 1;
          const { current: entryRank } = getRankInfo(user.xp);

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-5 rounded-xl border-2 shadow-[5px_5px_0px_0px_#2563eb] flex flex-col justify-between space-y-3 relative overflow-hidden",
                user.isUser ? "border-blue-600 bg-blue-50/50" : "bg-corp-surface border-blue-500"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase bg-[#2563eb] text-white">
                  Rank #{rankPos}
                </span>
                <div className="flex items-center gap-1.5">
                  <RankBadge rank={entryRank} size="xs" />
                  <span className="text-[10px] font-extrabold uppercase font-mono" style={{ color: entryRank.color }}>
                    {entryRank.name}
                  </span>
                  {user.isUser && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 ml-1">
                      YOU
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-black text-base uppercase text-corp-text truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-corp-text-tertiary truncate">
                  {user.university}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-blue-400/40">
                <span className="font-black text-[#2563eb]">{user.xp.toLocaleString()} XP</span>
                <span className="text-corp-text-tertiary">Level {user.level || Math.floor(user.xp / 200) + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] overflow-hidden font-mono" style={{ background: "var(--corp-surface)" }}>
        <div className="p-4 border-b-2 border-blue-400/40 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-corp-text flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" /> Database Standings — {categoryName}
          </h2>
          <span className="text-[10px] font-bold text-corp-text-tertiary">
            Sorted by XP Score
          </span>
        </div>

        <div className="divide-y-2 divide-blue-400/30">
          {fullLeaderboard.map((entry) => {
            const { current: rankData } = getRankInfo(entry.xp);

            return (
              <div
                key={entry.id}
                className={cn(
                  "p-4 flex items-center justify-between gap-4 transition-colors",
                  entry.isUser ? "bg-blue-500/10 font-bold" : "hover:bg-blue-500/5"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border-2 flex-shrink-0",
                    entry.rank === 1 ? "bg-amber-400 text-amber-950 border-amber-500" :
                    entry.rank === 2 ? "bg-blue-500 text-white border-blue-600" :
                    entry.rank === 3 ? "bg-slate-300 text-slate-950 border-slate-500" :
                    "bg-corp-surface text-corp-text border-blue-400"
                  )}>
                    #{entry.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase text-corp-text truncate">
                        {entry.name}
                      </span>
                      {entry.isUser && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-corp-text-tertiary truncate">
                      {entry.university}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <RankBadge rank={rankData} size="xs" />
                    <span className="text-[11px] font-extrabold uppercase font-mono hidden sm:inline" style={{ color: rankData.color }}>
                      {rankData.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#2563eb]">{entry.xp.toLocaleString()} XP</p>
                    <p className="text-[10px] text-corp-text-tertiary">Level {entry.level || 1} · {entry.streak || 0}d streak</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
