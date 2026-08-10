"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, FileText, Target, X } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

export function ExecutiveOnboardingWizard() {
  const { state } = useUser();
  const [dismissed, setDismissed] = useState(false);

  // Show onboarding wizard if user has low XP (<500) or incomplete profile
  const isNewUser = state.xp < 500 || state.enrolledPathSlugs.length === 0;
  if (!isNewUser || dismissed) return null;

  const steps = [
    {
      id: "enroll",
      title: "1. Enroll in an Executive Track",
      desc: "Choose from 8+ corporate learning paths",
      completed: state.enrolledPathSlugs.length > 0,
      href: "/learn",
      cta: "Explore Paths",
      icon: BookOpen,
    },
    {
      id: "lesson",
      title: "2. Complete Your First Module",
      desc: "Earn +150 XP and start your learning streak",
      completed: state.courseProgress.some((c) => c.progress > 0),
      href: state.enrolledPathSlugs[0] ? `/learn/${state.enrolledPathSlugs[0]}` : "/learn",
      cta: "Start Lesson",
      icon: Target,
    },
    {
      id: "passport",
      title: "3. Complete Career Passport CV",
      desc: "Set your bio & export verified resume",
      completed: Boolean(state.passportProfile?.headline),
      href: "/career-passport",
      cta: "Edit Passport",
      icon: FileText,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-3xl p-6 border shadow-md relative overflow-hidden mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.04) 100%)",
          borderColor: "var(--corp-border)",
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-corp-bg-secondary text-corp-text-tertiary transition-colors"
          aria-label="Dismiss wizard"
        >
          <X size={15} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-corp-accent" />
              <h2 className="text-base font-bold" style={{ color: "var(--corp-text)" }}>
                Executive Onboarding Checklist
              </h2>
            </div>
            <p className="text-xs" style={{ color: "var(--corp-text-secondary)" }}>
              Complete these 3 steps to activate your corporate profile & earn your first badge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-corp-text-tertiary">Progress</p>
              <p className="text-xs font-mono font-bold" style={{ color: "var(--corp-text)" }}>
                {completedCount} of 3 Complete ({progressPercent}%)
              </p>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-corp-accent/30 flex items-center justify-center font-mono text-xs font-bold text-corp-accent relative overflow-hidden bg-corp-surface shadow-sm">
              <div
                className="absolute inset-0 bg-corp-accent/15"
                style={{ height: `${progressPercent}%` }}
              />
              <span className="relative z-10">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all"
                style={{
                  background: "var(--corp-surface)",
                  borderColor: step.completed ? "rgba(16,185,129,0.3)" : "var(--corp-border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                        : "bg-corp-accent/10 text-corp-accent"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold" style={{ color: "var(--corp-text)" }}>
                      {step.title}
                    </h3>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--corp-text-tertiary)" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>

                {!step.completed && (
                  <Link
                    href={step.href}
                    className="w-full py-1.5 px-3 rounded-xl text-[11px] font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-colors flex items-center justify-center gap-1.5 mt-1"
                  >
                    <span>{step.cta}</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
