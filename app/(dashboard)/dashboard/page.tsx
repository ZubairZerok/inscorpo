"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, BookOpen, Trophy,
  ChevronRight, Check, Sparkles, ShieldCheck,
  TrendingUp, Users, Calendar, ArrowRight, CheckCircle2, Award
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

import { LinkedInProfileHeader } from "@/components/dashboard/linkedin-profile-header";
import { LinkedInExperienceCard } from "@/components/dashboard/linkedin-experience-card";
import { LinkedInSkillsCard } from "@/components/dashboard/linkedin-skills-card";
import { WeeklyVelocityChart } from "@/components/dashboard/weekly-velocity-chart";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { DailyQuestEngine } from "@/components/dashboard/daily-quest-engine";
import { DashboardRegisteredWorkshopsWidget } from "@/components/dashboard/dashboard-registered-workshops-widget";
import { XpExplainerModal } from "@/components/dashboard/xp-explainer-modal";
import { StreakExplainerModal } from "@/components/dashboard/streak-explainer-modal";
import { getRankInfo } from "@/components/ui/rank-badge";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Animated Noto emoji URLs
const FIRE_EMOJI_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp";
const LIGHTNING_EMOJI_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp";

const rankLeaderBgs = ["#F59E0B", "#2563EB", "#1D4ED8"];

export default function LinkedInDashboardPage() {
  const { state, claimDailyCheckIn } = useUser();
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [checkInClaimed, setCheckInClaimed] = useState(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [prevLevel] = useState(state.level);
  const [xpModalOpen, setXpModalOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const isCheckedInToday = state.lastCheckInDate === todayStr || checkInClaimed;

  const totalWeeklyMinutes = state.weeklyActivity.reduce((a, b) => a + b, 0);
  const dailyAverageMins = Math.round(totalWeeklyMinutes / 7);
  const { current: currentRank } = getRankInfo(state.xp);

  const filteredLeader = state.leaderboard.filter((u) => u.name !== state.name && u.id !== "me");
  const sortedLeaderboard = [...filteredLeader, { id: "me", name: state.name, xp: state.xp, level: state.level, streak: state.streak, isUser: true }].sort((a, b) => b.xp - a.xp);
  const myRankIndex = sortedLeaderboard.findIndex((u) => u.isUser);
  const leaderboardPreview = [
    ...sortedLeaderboard.slice(0, 3).map((u, i) => ({ rank: i + 1, ...u })),
    ...(myRankIndex >= 3 ? [{ rank: myRankIndex + 1, ...sortedLeaderboard[myRankIndex] }] : []),
  ];

  const nextLevelXp = state.level * 200;
  const prevLevelXp = (state.level - 1) * 200;
  const xpProgress = Math.min(((state.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);

  const handleClaimCheckIn = () => {
    const success = claimDailyCheckIn();
    if (success) {
      setCheckInClaimed(true);
      setShowBonusPopup(true);
      if (state.level > prevLevel) {
        setTimeout(() => setShowLevelUpAnimation(true), 600);
      }
    }
  };

  const totalDaysInGrid = 168;
  const today = new Date();
  const xpLogsByDate: Record<string, number> = {};
  state.xpLogs.forEach((log) => {
    const logDate = new Date(log.date);
    const dateKey = isNaN(logDate.getTime())
      ? log.date.split("T")[0]
      : `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, "0")}-${String(logDate.getDate()).padStart(2, "0")}`;
    xpLogsByDate[dateKey] = (xpLogsByDate[dateKey] || 0) + log.amount;
  });

  const heatmapGrid = Array.from({ length: totalDaysInGrid }).map((_, idx) => {
    const dayOffset = totalDaysInGrid - 1 - idx;
    const d = new Date(today);
    d.setDate(d.getDate() - dayOffset);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const loggedXp = xpLogsByDate[dateStr] || 0;
    const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1;
    const isRecentWeek = dayOffset < 7;
    const weeklyMins = isRecentWeek ? (state.weeklyActivity[dayOfWeek] || 0) : 0;
    let activityLevel = 0;
    if (loggedXp >= 100 || weeklyMins >= 45) activityLevel = 3;
    else if (loggedXp >= 50 || weeklyMins >= 20) activityLevel = 2;
    else if (loggedXp > 0 || weeklyMins > 0) activityLevel = 1;
    return { dateStr, level: activityLevel, totalXp: loggedXp, mins: weeklyMins };
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6 pb-20 font-sans"
    >
      {/* ── 0. Live Workshops & Event Pass Widget ── */}
      <DashboardRegisteredWorkshopsWidget />

      {/* ── 1. LinkedIn Cover Banner & Profile Header ── */}
      <LinkedInProfileHeader
        state={state}
        currentRank={currentRank}
        xpProgress={xpProgress}
        nextLevelXp={nextLevelXp}
      />


      {/* ── 3. Main LinkedIn 2-Column Profile Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (8 Columns) ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Enrolled Tracks (Formatted like LinkedIn Work Experience) */}
          <LinkedInExperienceCard state={state} />

          {/* Activity Heatmap (Full Space 24-Week Commit Graph) */}
          <ActivityHeatmap heatmapGrid={heatmapGrid} totalLogsCount={state.xpLogs.length} />

          {/* Weekly Learning Velocity Chart */}
          <WeeklyVelocityChart
            weeklyActivity={state.weeklyActivity}
            totalWeeklyMinutes={totalWeeklyMinutes}
            dailyAverageMins={dailyAverageMins}
            days={days}
          />

          {/* Verified Skills & Competencies */}
          <LinkedInSkillsCard state={state} />
        </div>

        {/* ── RIGHT SIDEBAR (4 Columns - LinkedIn Profile Sidebar) ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Quests Engine Widget */}
          <DailyQuestEngine />

          {/* Daily Check-in Card */}
          <motion.div
            variants={item}
            className="rounded-xl p-5 space-y-4 border-2 text-slate-900"
            style={{
              background: "linear-gradient(135deg, #FEF08A 0%, #FACC15 60%, #F59E0B 100%)",
              borderColor: "#D97706",
              boxShadow: "5px 5px 0px 0px #92400E",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-amber-900/20 text-amber-900 border border-amber-700/30">
                  Daily Attendance
                </span>
                <h3 className="text-sm font-extrabold font-mono mt-1 text-amber-900">
                  Daily Check-in Streak
                </h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={FIRE_EMOJI_URL}
                  alt="fire"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-xs text-amber-900 font-bold leading-relaxed">
              {isCheckedInToday
                ? "Daily streak claimed! Return tomorrow to keep your multiplier active."
                : "Claim your daily +25 XP bonus and maintain your active streak status."}
            </p>

            <button
              onClick={handleClaimCheckIn}
              disabled={isCheckedInToday}
              className="w-full py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all flex items-center justify-center gap-2 border-2"
              style={{
                background: isCheckedInToday ? "#10B981" : "#92400E",
                color: "#ffffff",
                borderColor: isCheckedInToday ? "#059669" : "#78350F",
                boxShadow: isCheckedInToday ? "3px 3px 0px 0px #064e3b" : "3px 3px 0px 0px #451a03",
              }}
            >
              {isCheckedInToday ? (
                <>
                  <Check size={14} /> Checked In Today
                </>
              ) : (
                <>
                  <Zap size={14} fill="currentColor" /> Claim +25 XP Streak
                </>
              )}
            </button>
          </motion.div>

          {/* Leaderboard Sidebar Card ("Top Candidates Network") */}
          <motion.div
            variants={item}
            className="rounded-xl border-2 border-corp-border p-5 space-y-4 font-sans"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold font-mono uppercase tracking-wider flex items-center gap-2 text-corp-text">
                  <Users size={14} className="text-[#2563eb]" /> Top Candidates Network
                </h3>
                <p className="text-[10px] font-medium text-corp-text-tertiary">
                  People also prepared with in your batch
                </p>
              </div>
              <Link href="/leaderboard" className="text-[11px] font-mono font-extrabold text-[#2563eb] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2">
              {leaderboardPreview.map((user) => (
                <div
                  key={user.id}
                  className={`p-2.5 rounded-lg flex items-center justify-between gap-3 border ${
                    user.isUser ? "bg-[#2563eb]/10 border-[#2563eb]" : "bg-corp-bg-secondary/60 border-corp-border"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-extrabold text-white flex-shrink-0"
                      style={{ background: rankLeaderBgs[user.rank - 1] || "var(--corp-border)" }}
                    >
                      #{user.rank}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${user.isUser ? "text-[#2563eb]" : "text-corp-text"}`}>
                        {user.name} {user.isUser && "(You)"}
                      </p>
                      <p className="text-[10px] text-corp-text-tertiary font-mono">
                        Level {user.level} · {user.streak}d streak
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-500 flex-shrink-0">
                    {user.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Masterclasses Widget */}
          <motion.div
            variants={item}
            className="rounded-xl border-2 border-corp-border p-5 space-y-3 font-sans"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold font-mono uppercase tracking-wider text-corp-text flex items-center gap-2">
                <Calendar size={14} className="text-[#2563eb]" /> Corporate Events
              </h3>
              <Link href="/events" className="text-[11px] font-mono font-extrabold text-[#2563eb] hover:underline">
                All Events →
              </Link>
            </div>
            <div className="p-3 rounded-lg border-2 border-corp-border bg-corp-bg-secondary/60 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-[#2563eb] text-white">
                  AUG 15
                </span>
                <span className="text-xs font-bold text-corp-text truncate">
                  CV Writing &amp; LinkedIn Hacks
                </span>
              </div>
              <p className="text-[10px] text-corp-text-tertiary font-medium">
                Live with Niaz Ahmed (Founder &amp; CEO, Corporate Ask)
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Level Up & Bonus Popups ── */}
      <AnimatePresence>
        {showBonusPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[99999] p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowBonusPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-xl p-8 max-w-sm w-full text-center space-y-4 border-2 border-[#2563eb] bg-white text-slate-900 shadow-[6px_6px_0px_0px_#1e3a8a]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto">
                <img src={FIRE_EMOJI_URL} alt="fire" width={44} height={44} className="object-contain" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-mono uppercase">
                Daily Check-in Claimed!
              </h3>
              <p className="text-xs text-[#2563eb] font-mono font-extrabold">
                +25 XP Added to Your Profile
              </p>
              <button
                onClick={() => setShowBonusPopup(false)}
                className="w-full py-3 rounded-lg text-xs font-mono font-extrabold uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border border-blue-300"
                style={{ boxShadow: "3px 3px 0px 0px #1e3a8a" }}
              >
                Continue Learning 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Duolingo Gamification Modals ── */}
      <XpExplainerModal isOpen={xpModalOpen} onClose={() => setXpModalOpen(false)} state={state} />
      <StreakExplainerModal isOpen={streakModalOpen} onClose={() => setStreakModalOpen(false)} state={state} />
    </motion.div>
  );
}
