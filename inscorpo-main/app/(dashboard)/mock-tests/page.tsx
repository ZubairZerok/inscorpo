"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Landmark, Briefcase, GraduationCap, Languages,
  Clock, Play, Sparkles, ChevronRight, Trophy,
  Zap, Flame, Target, CheckCircle2, Brain, AlertTriangle, FileSpreadsheet, BarChart3
} from "lucide-react";
import Link from "next/link";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { DailyDrillModal } from "@/components/mock-tests/daily-drill-modal";
import { RankExplainerModal } from "@/components/dashboard/rank-explainer-modal";
import { useUser } from "@/components/providers/user-context";
import { MOCK_TESTS_DATABASE, MockTestDetail } from "@/lib/data/mock-tests-db";

const DRILL_CHALLENGE_ID = "daily-skill-rapid-drill";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function MockTestsPage() {
  const { state } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const todayKey = `${DRILL_CHALLENGE_ID}-${new Date().toISOString().split("T")[0]}`;
  const isDrillCompletedToday = state.completedChallengeIds.includes(todayKey);

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type?: "error" | "warning" | "info" | "success" | "xp";
    requiredXP?: number;
    currentXP?: number;
    actionText?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    message: "",
  });

  const categories = ["All", "Banking", "Corporate", "GRE", "GMAT", "Excel"];

  const testsList = useMemo(() => {
    return Object.values(MOCK_TESTS_DATABASE);
  }, []);

  const filteredTests = useMemo(() => {
    return testsList.filter((test) => {
      const matchesCategory =
        activeCategory === "All" || test.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [testsList, activeCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "banking":
        return Landmark;
      case "corporate":
        return Briefcase;
      case "gre":
        return GraduationCap;
      case "gmat":
        return BarChart3;
      case "excel":
        return FileSpreadsheet;
      default:
        return Brain;
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6 font-sans pb-16"
    >
      {/* Top Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
            <Brain className="w-8 h-8 text-[#2563eb]" /> Mock Test Assessment Center
          </h1>
          <p className="text-sm font-medium text-corp-text-secondary">
            Timed corporate assessments, real negative marking penalties, and step-by-step solution analytics.
          </p>
        </div>

        {/* Silver / Current Rank Badge trigger */}
        <div
          onClick={() => setRankModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 border-2 border-slate-950 font-black text-xs font-mono uppercase cursor-pointer hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 self-start sm:self-auto"
        >
          <Trophy size={16} />
          <span>Rank Info &amp; Perks</span>
        </div>
      </motion.div>

      {/* Daily Practice Drill Banner */}
      <motion.div
        variants={item}
        className="rounded-2xl p-6 sm:p-7 overflow-hidden relative border-4 border-blue-500 text-white font-mono"
        style={{
          background: isDrillCompletedToday
            ? "linear-gradient(135deg, #059669 0%, #064e3b 100%)"
            : "linear-gradient(135deg, #2563eb 0%, #1e1b4b 100%)",
          boxShadow: isDrillCompletedToday ? "6px 6px 0px 0px #064e3b" : "6px 6px 0px 0px #1e3a8a",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white bg-white/20 shadow-md cursor-pointer"
            >
              <Zap className="w-8 h-8 text-amber-300 fill-amber-300 animate-pulse" />
            </motion.div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                  Daily Challenge
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-white/20 text-white border border-white/30 flex items-center gap-1">
                  <Sparkles size={12} /> +25 XP
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-white/20 text-white border border-white/30 flex items-center gap-1">
                  <Flame size={12} className="fill-amber-300 text-amber-300" /> {state.streak}-Day Streak
                </span>
                {isDrillCompletedToday && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-emerald-900 text-emerald-100 border border-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Completed Today
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  5-Minute Corporate Skill Rapid Drill
                </h3>
                <p className="text-xs sm:text-sm mt-1 font-sans font-medium text-blue-100">
                  Test your speed with 3 rapid questions on Excel formulas, financial statement analysis &amp; logical reasoning.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 font-sans font-medium">
                <span className="flex items-center gap-1.5"><Target size={13} /> 3 Questions</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> 5 Mins</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Instant Analytics</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 flex-shrink-0">
            <button
              onClick={() => setIsDrillOpen(true)}
              className="px-6 py-3.5 rounded-xl text-xs font-mono font-extrabold uppercase flex items-center justify-center gap-2 transition-all bg-amber-400 text-amber-950 border-2 border-slate-950 shadow-[4px_4px_0px_0px_#000] hover:bg-amber-300 cursor-pointer"
            >
              <Play size={14} className="fill-amber-950" />
              <span>{isDrillCompletedToday ? "Retry Drill" : "Begin Drill Now"}</span>
              <ChevronRight size={14} />
            </button>
            <span className="text-[11px] text-blue-100 font-mono text-center">
              {isDrillCompletedToday ? "Completed! Resets tomorrow" : "Resets every 24 hours"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search & Category Filter Controls */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2563eb]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by title, keyword, or organization..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold border-2 border-blue-400 bg-corp-surface text-corp-text focus:outline-none focus:border-[#2563eb] shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all border-2 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Test List Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTests.map((test) => {
          const IconComp = getCategoryIcon(test.category);
          return (
            <div
              key={test.id}
              className="rounded-2xl overflow-hidden flex flex-col justify-between transition-all border-2 border-blue-500 p-5 space-y-4 shadow-[5px_5px_0px_0px_#2563eb]"
              style={{ background: "var(--corp-surface)" }}
            >
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                    {test.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-[#2563eb] border border-blue-300">
                    {test.difficulty}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2563eb]/15 text-[#2563eb] flex items-center justify-center flex-shrink-0 border-2 border-blue-400">
                    <IconComp size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-corp-text leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs font-sans text-corp-text-secondary line-clamp-2">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* Metadata Pill Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl border border-blue-400/40 bg-blue-50/20">
                    <span className="text-[9px] font-extrabold uppercase text-[#2563eb] block">Questions</span>
                    <span className="text-xs font-black text-corp-text mt-0.5 block">{test.questions.length} Qs</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-blue-400/40 bg-blue-50/20">
                    <span className="text-[9px] font-extrabold uppercase text-[#2563eb] block">Duration</span>
                    <span className="text-xs font-black text-corp-text mt-0.5 block">{test.durationMins} Mins</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-blue-400/40 bg-blue-50/20">
                    <span className="text-[9px] font-extrabold uppercase text-[#2563eb] block">Penalty</span>
                    <span className="text-xs font-black text-rose-500 mt-0.5 block">
                      {test.negativeMarking > 0 ? `-${test.negativeMarking}` : "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t-2 border-blue-400/40 flex items-center justify-between font-mono">
                <div className="flex items-center gap-1 text-xs font-black text-[#2563eb]">
                  <Sparkles size={14} />
                  +{test.xpReward} XP
                </div>

                <Link
                  href={`/mock-tests/${test.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-black text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-400 uppercase tracking-wider shadow-[3px_3px_0px_0px_#1e3a8a] cursor-pointer"
                >
                  Start Assessment <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </motion.div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-blue-400 rounded-2xl p-6 font-mono text-corp-text-tertiary space-y-2">
          <Brain size={36} className="mx-auto text-[#2563eb]" />
          <h3 className="text-base font-bold text-corp-text">No Mock Tests Match Your Search</h3>
          <p className="text-xs">Try selecting another category or clearing your search filter.</p>
        </div>
      )}

      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog((prev) => ({ ...prev, isOpen: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        requiredXP={alertDialog.requiredXP}
        currentXP={alertDialog.currentXP}
        actionText={alertDialog.actionText}
        onAction={alertDialog.onAction}
      />

      <DailyDrillModal
        isOpen={isDrillOpen}
        onClose={() => setIsDrillOpen(false)}
        isCompletedToday={isDrillCompletedToday}
      />

      <RankExplainerModal
        isOpen={rankModalOpen}
        onClose={() => setRankModalOpen(false)}
        state={state}
      />
    </motion.div>
  );
}
