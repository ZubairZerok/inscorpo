"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sparkles, ChevronRight, Zap, Target } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  xp: number;
  href: string;
  isCompleted: boolean;
}

export function GettingStartedChecklist() {
  const { state } = useUser();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const hasPassedInterview = state.completedChallengeIds.length > 0;
    const hasCompletedCourse = state.courseProgress.some((c) => c.progress > 0);
    const hasCustomizedPassport = !!(state.passportProfile?.headline || state.passportProfile?.university);

    setItems([
      {
        id: "profile",
        label: "Complete Passport Profile",
        description: "Add your university, degree, and corporate target roles",
        xp: 50,
        href: "/career-passport",
        isCompleted: hasCustomizedPassport,
      },
      {
        id: "ai-interview",
        label: "Take 1st AI STAR Mock Interview",
        description: "Get evaluated by corporate recruiter AI for STAR score",
        xp: 150,
        href: "/mock-interviews",
        isCompleted: hasPassedInterview,
      },
      {
        id: "excel-lesson",
        label: "Complete 1st Learning Lesson",
        description: "Master XLOOKUP or NPV modeling in the interactive simulator",
        xp: 80,
        href: "/learn",
        isCompleted: hasCompletedCourse,
      },
      {
        id: "daily-quest",
        label: "Check-in & Claim Daily Quest",
        description: "Maintain your active study streak for bonus XP",
        xp: 30,
        href: "/dashboard",
        isCompleted: state.streak > 0,
      },
    ]);
  }, [state]);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  if (completedCount === totalCount) return null; // Hide when 100% completed!

  return (
    <div
      className="p-5 rounded-xl border-2 border-[#2563eb] font-mono space-y-4 shadow-[5px_5px_0px_0px_#1e3a8a]"
      style={{ background: "var(--corp-surface)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[#2563eb]" />
          <h2 className="text-sm font-black uppercase text-corp-text tracking-wide">
            Getting Started Checklist ({completedCount}/{totalCount})
          </h2>
        </div>
        <span className="text-xs font-extrabold text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          {progressPct}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-corp-bg-secondary overflow-hidden border border-corp-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-[#2563eb]"
        />
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`p-3 rounded-lg border-2 flex items-start gap-3 transition-all ${
              item.isCompleted
                ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 opacity-80"
                : "bg-corp-bg-secondary border-corp-border hover:border-[#2563eb] text-corp-text"
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {item.isCompleted ? (
                <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle size={16} className="text-corp-text-tertiary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-black uppercase truncate ${item.isCompleted ? "line-through text-emerald-800" : "text-corp-text"}`}>
                  {item.label}
                </span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex-shrink-0">
                  +{item.xp} XP
                </span>
              </div>
              <p className="text-[11px] text-corp-text-secondary truncate mt-0.5">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
