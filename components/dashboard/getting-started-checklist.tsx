"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Sparkles, ChevronRight, Zap, Target, 
  ArrowRight, ShieldCheck, Award, BookOpen, Brain, Trophy 
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  xp: number;
  href: string;
  isCompleted: boolean;
  isVerified: boolean; // Requirements met, ready to claim
  requirementText: string;
}

export function GettingStartedChecklist() {
  const { state, completeChecklistTask } = useUser();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [celebratedId, setCelebratedId] = useState<string | null>(null);

  useEffect(() => {
    const completedIds = state.completedChecklistTaskIds || [];

    // 1. Passport Verification (Headline >= 5, university provided, or skills >= 2)
    const passportMet = !!(
      (state.passportProfile?.headline && state.passportProfile.headline.trim().length >= 5) ||
      state.passportProfile?.university ||
      (state.passportProfile?.topSkills && state.passportProfile.topSkills.length >= 2)
    );

    // 2. Path Enrollment Verification (At least 1 enrolled path slug or course progress > 0)
    const pathMet = state.enrolledPathSlugs.length > 0 || state.courseProgress.some((c) => c.progress > 0);

    // 3. Mock Test Verification (Completed test attempt or completed challenge ID)
    const testMet = state.completedChallengeIds.length > 0 || state.courseProgress.some((c) => c.category === "tests");

    // 4. AI Interview / Assistant Verification (Attempted AI interview or used AI tools)
    const aiMet = state.completedChallengeIds.some((id) => id.includes("interview") || id.includes("ai"));

    setItems([
      {
        id: "passport",
        label: "Build & Verify Career Passport",
        description: "Add your headline, university, degree, or core technical skills",
        xp: 50,
        href: "/career-passport",
        isCompleted: completedIds.includes("passport"),
        isVerified: passportMet,
        requirementText: "Requires headline or university in profile",
      },
      {
        id: "path-enrollment",
        label: "Enroll in Executive Career Track",
        description: "Select Management Trainee (MTO), Analytics, or Finance track",
        xp: 50,
        href: "/learn",
        isCompleted: completedIds.includes("path-enrollment"),
        isVerified: pathMet,
        requirementText: "Requires active enrollment in 1 career path",
      },
      {
        id: "mock-test",
        label: "Attempt Timed Mock Assessment",
        description: "Complete 1 timed assessment with percentile rankings",
        xp: 50,
        href: "/mock-tests",
        isCompleted: completedIds.includes("mock-test"),
        isVerified: testMet,
        requirementText: "Requires 1 mock test attempt submission",
      },
      {
        id: "ai-interview",
        label: "Run AI STAR Executive Mock Interview",
        description: "Get evaluated by recruiter AI for STAR interview scoring",
        xp: 50,
        href: "/mock-interviews",
        isCompleted: completedIds.includes("ai-interview"),
        isVerified: aiMet,
        requirementText: "Requires 1 AI STAR mock interview response",
      },
    ]);
  }, [state]);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const handleClaimXP = (e: React.MouseEvent, item: ChecklistItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.isCompleted) return;

    const success = completeChecklistTask(item.id, item.label, item.xp);
    if (success) {
      setCelebratedId(item.id);
      setTimeout(() => setCelebratedId(null), 3000);
    }
  };

  if (completedCount === totalCount) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl border-2 border-[#3DAA78] bg-[#3DAA78]/10 text-white font-mono flex items-center justify-between gap-4 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3DAA78] flex items-center justify-center text-white font-bold shadow-lg shadow-[#3DAA78]/30">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-emerald-950 flex items-center gap-2">
              Onboarding Checklist Complete! 🎉
            </h3>
            <p className="text-xs text-emerald-800">
              You have claimed all 4 milestones (+200 XP earned). Your profile is fully verified for corporate recruiters!
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#3DAA78] hover:bg-[#2D7D5A] text-white transition-colors flex-shrink-0"
        >
          View Executive Standings
        </Link>
      </motion.div>
    );
  }

  return (
    <div
      className="p-5 rounded-xl border-2 border-[#3B5BDB] font-mono space-y-4 shadow-[5px_5px_0px_0px_#1E3A8A] bg-[#0E1117]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[#5B7CF6]" />
          <h2 className="text-sm font-black uppercase text-white tracking-wide">
            Getting Started Checklist ({completedCount}/{totalCount})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#5B7CF6] bg-[#3B5BDB]/20 px-2.5 py-1 rounded-md border border-[#5B7CF6]/40">
            {progressPct}% Completed &bull; {completedCount * 50}/200 XP Earned
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-[#161B27] overflow-hidden border border-[#262F45]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-[#3B5BDB] to-[#5B7CF6]"
        />
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {items.map((item) => {
          const canClaim = !item.isCompleted && item.isVerified;
          const isPending = !item.isCompleted && !item.isVerified;

          return (
            <div
              key={item.id}
              className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between gap-3 transition-all ${item.isCompleted
                ? "bg-[#3DAA78]/10 border-[#3DAA78]/40 text-[#E8ECF4]"
                : canClaim
                  ? "bg-[#3B5BDB]/15 border-[#5B7CF6] text-white shadow-md shadow-[#3B5BDB]/20"
                  : "bg-[#161B27] border-[#262F45] hover:border-[#5B7CF6]/60 text-[#E8ECF4]"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {item.isCompleted ? (
                    <CheckCircle2 size={18} className="text-[#3DAA78] fill-[#3DAA78]/20" />
                  ) : canClaim ? (
                    <Sparkles size={18} className="text-[#5B7CF6] animate-pulse" />
                  ) : (
                    <Circle size={18} className="text-[#626C80]" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-black uppercase tracking-tight truncate ${item.isCompleted ? "line-through text-[#3DAA78]" : "text-white"}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold text-[#E09C28] bg-[#E09C28]/15 px-2 py-0.5 rounded border border-[#E09C28]/30 flex-shrink-0">
                      +{item.xp} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-[#A0ABBC] leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-[10px] text-[#626C80] font-mono">
                    {item.isCompleted ? "✓ Milestone Verified" : item.requirementText}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#262F45]/60 flex items-center justify-between gap-2 text-xs">
                {item.isCompleted ? (
                  <span className="text-[11px] font-bold text-[#3DAA78] flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Completed (+{item.xp} XP)
                  </span>
                ) : canClaim ? (
                  <button
                    onClick={(e) => handleClaimXP(e, item)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-extrabold text-white bg-[#3B5BDB] hover:bg-[#2F4AC0] border border-[#5B7CF6]/60 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                  >
                    <Sparkles size={13} />
                    <span>Requirements Met — Claim +{item.xp} XP!</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-[#5B7CF6] bg-[#3B5BDB]/10 hover:bg-[#3B5BDB]/20 border border-[#5B7CF6]/30 flex items-center justify-between transition-colors"
                  >
                    <span>Go to Task</span>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
