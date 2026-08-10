"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, BookOpen, ClipboardList, Briefcase,
  CheckCircle2, Clock, Gift, ChevronRight, Target
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

type QuestId = "lesson" | "quiz" | "job";

interface Quest {
  id: QuestId;
  icon: React.ReactNode;
  label: string;
  description: string;
  xp: number;
  href: string;
}

const QUESTS: Quest[] = [
  {
    id: "lesson",
    icon: <BookOpen size={14} />,
    label: "Watch a Lesson",
    description: "Complete any lesson in your active track",
    xp: 50,
    href: "/learn",
  },
  {
    id: "quiz",
    icon: <ClipboardList size={14} />,
    label: "Score on a Practice Test",
    description: "Score 60%+ on any quiz or mock test",
    xp: 75,
    href: "/mock-tests",
  },
  {
    id: "job",
    icon: <Briefcase size={14} />,
    label: "Explore an Opportunity",
    description: "View a job listing or join a challenge",
    xp: 25,
    href: "/jobs",
  },
];

const STORAGE_KEY = "insyt_daily_quest_completed";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function loadCompletedQuests(): Set<QuestId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: { date: string; completed: QuestId[] } = JSON.parse(raw);
    if (parsed.date === getTodayKey()) return new Set(parsed.completed);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveCompletedQuests(completed: Set<QuestId>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getTodayKey(), completed: Array.from(completed) })
    );
  } catch {
    /* ignore */
  }
}

export function DailyQuestEngine() {
  const { addXP, addNotification } = useUser();
  const [completedQuests, setCompletedQuests] = useState<Set<QuestId>>(() => loadCompletedQuests());
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const todayStr = getTodayKey();
  const completedCount = completedQuests.size;
  const allDone = completedCount >= QUESTS.length;
  const circumference = 2 * Math.PI * 22;

  useEffect(() => {
    if (allDone && !bonusClaimed) {
      const bonusKey = `insyt_quest_bonus_${todayStr}`;
      if (typeof window !== "undefined" && !localStorage.getItem(bonusKey)) {
        localStorage.setItem(bonusKey, "1");
        setBonusClaimed(true);
        setTimeout(() => {
          addXP(200, "🎯 Daily Quest Bonus — All 3 Completed!");
          addNotification({
            type: "achievement",
            title: "🎯 All Quests Complete! +200 XP Bonus",
            message: "You crushed all 3 daily quests today!",
          });
        }, 600);
      } else {
        setBonusClaimed(true);
      }
    }
  }, [allDone, bonusClaimed, todayStr, addXP, addNotification]);

  useEffect(() => {
    const bonusKey = `insyt_quest_bonus_${todayStr}`;
    if (typeof window !== "undefined" && localStorage.getItem(bonusKey)) {
      setBonusClaimed(true);
    }
  }, [todayStr]);

  const handleCompleteQuest = useCallback(
    (quest: Quest) => {
      if (completedQuests.has(quest.id)) return;

      const next = new Set(completedQuests);
      next.add(quest.id);
      setCompletedQuests(next);
      saveCompletedQuests(next);

      addXP(quest.xp, `Daily Quest: ${quest.label}`);

      addNotification({
        type: "achievement",
        title: `+${quest.xp} XP — Quest Complete!`,
        message: `"${quest.label}" done. ${QUESTS.length - next.size > 0
          ? `${QUESTS.length - next.size} quest${QUESTS.length - next.size !== 1 ? "s" : ""} remaining.`
          : "All quests complete!"
          }`,
      });
    },
    [completedQuests, addXP, addNotification]
  );

  return (
    <div className="space-y-3 font-sans">
      {/* Main Quest Card */}
      <div
        className="rounded-xl border-2 overflow-hidden border-[#2563eb]"
        style={{
          background: "var(--corp-surface)",
          boxShadow: "5px 5px 0px 0px #1e3a8a",
        }}
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b-2"
          style={{ borderColor: "var(--corp-border)" }}
        >
          <div className="flex items-center gap-3">
            {/* Progress Circle */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
                <circle cx="24" cy="24" r="22" fill="none" strokeWidth="4" className="text-corp-border" stroke="currentColor" />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="#2563eb"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{
                    strokeDashoffset: circumference * (1 - completedCount / QUESTS.length),
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {allDone ? (
                  <CheckCircle2 size={16} className="text-[#2563eb]" />
                ) : (
                  <span className="text-[11px] font-extrabold font-mono" style={{ color: "var(--corp-text)" }}>
                    {completedCount}/{QUESTS.length}
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-extrabold uppercase font-mono tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <Target size={15} className="text-[#2563eb]" /> Daily Quests
              </p>
              <p className="text-[11px] mt-0.5 font-medium text-corp-text-tertiary">
                {allDone
                  ? "All daily quests complete!"
                  : `Complete ${QUESTS.length - completedCount} more quest${QUESTS.length - completedCount !== 1 ? "s" : ""} for +200 XP bonus`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-extrabold bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30">
            <Zap size={13} className="fill-[#2563eb]" />
            <span>+150</span>
          </div>
        </div>

        {/* Quests List */}
        <div className="divide-y-2 divide-corp-border">
          {QUESTS.map((quest, i) => {
            const done = completedQuests.has(quest.id);
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className={`flex items-center justify-between gap-3 px-5 py-3.5 transition-colors ${done ? "opacity-60 bg-corp-bg-secondary/40" : "hover:bg-corp-bg-secondary/50"
                  }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 border-2 ${done
                      ? "bg-[#2563eb] text-white border-[#2563eb]"
                      : "bg-corp-bg-secondary text-corp-text border-corp-border"
                      }`}
                  >
                    {done ? <CheckCircle2 size={14} /> : quest.icon}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-mono font-extrabold ${done ? "line-through" : ""}`}
                      style={{ color: "var(--corp-text)" }}
                    >
                      {quest.label}
                    </p>
                    <p className="text-[10px] mt-0.5 font-medium text-corp-text-tertiary">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                  <span className="text-[10px] font-extrabold text-[#2563eb] flex items-center gap-0.5">
                    <Zap size={11} className="fill-[#2563eb]" />+{quest.xp}
                  </span>
                  {done ? (
                    <div className="px-3 py-1.5 rounded-md text-[10px] font-extrabold bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]">
                      Done ✓
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteQuest(quest)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-extrabold text-white bg-[#2563eb] hover:bg-blue-600 transition-all border border-blue-300 uppercase tracking-wider flex items-center gap-1"
                      style={{ boxShadow: "2px 2px 0px 0px #1e3a8a" }}
                    >
                      Mark Done
                      <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bonus XP Reveal Strip */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t-2 border-corp-border"
            >
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
