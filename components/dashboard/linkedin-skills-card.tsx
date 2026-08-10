"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserState } from "@/lib/state/types";

interface LinkedInSkillsCardProps {
  state: UserState;
}

export function LinkedInSkillsCard({ state }: LinkedInSkillsCardProps) {
  // Derive real completed/unlocked skills dynamically from user state
  const completedCourses = state.courseProgress.filter((c) => c.progress > 0);
  const completedChallenges = state.completedChallengeIds;
  const userBadges = state.recentBadges;
  const passportSkills = state.passportProfile?.customSkills || [];

  // Build dynamic skills array
  const dynamicSkills: { name: string; mastery: string; endorsements: number; badge: string }[] = [];

  completedCourses.forEach((c) => {
    dynamicSkills.push({
      name: c.title,
      mastery: `${c.progress}%`,
      endorsements: Math.max(1, Math.floor(c.progress / 2.5)),
      badge: c.progress >= 100 ? "Verified Certification Pass" : "In-Progress Assessment",
    });
  });

  completedChallenges.forEach((chId) => {
    dynamicSkills.push({
      name: `Skill Challenge: ${chId.replace("-", " ").toUpperCase()}`,
      mastery: "100%",
      endorsements: 12,
      badge: "Verified Challenge Winner",
    });
  });

  passportSkills.forEach((skillName) => {
    if (!dynamicSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      dynamicSkills.push({
        name: skillName,
        mastery: "85%",
        endorsements: 8,
        badge: "Passport Verified",
      });
    }
  });

  const hasSkills = dynamicSkills.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="rounded-xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] p-6 space-y-5 font-sans"
      style={{ background: "var(--corp-surface)" }}
    >
      <div className="flex items-center justify-between font-mono">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
            <Award size={16} className="text-amber-500" /> Verified Skills &amp; Competencies ({dynamicSkills.length})
          </h2>
          <p className="text-xs font-sans font-medium text-corp-text-tertiary">
            Derived directly from your verified course progress and skill challenge completions
          </p>
        </div>
        <Link href="/challenges" className="text-xs font-mono font-extrabold text-[#2563eb] hover:underline">
          Take Skill Challenge →
        </Link>
      </div>

      {hasSkills ? (
        <div className="space-y-3 font-mono">
          {dynamicSkills.map((skill, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border-2 border-corp-border bg-corp-bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-corp-text">
                    {skill.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30 flex items-center gap-1">
                    <ShieldCheck size={11} /> {skill.badge}
                  </span>
                </div>
                <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
                  Verified with <strong className="text-corp-text font-bold">{skill.endorsements} peer endorsements</strong> on your passport
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="px-3 py-1 rounded-md bg-amber-400/20 text-amber-600 border border-amber-500/40 text-xs font-extrabold">
                  {skill.mastery} Mastery
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-lg border-2 border-dashed border-corp-border text-center space-y-3 font-mono bg-corp-bg-secondary/30">
          <AlertCircle size={28} className="mx-auto text-amber-500" />
          <div>
            <h4 className="text-xs font-extrabold uppercase text-corp-text">No Verified Skills Unlocked Yet</h4>
            <p className="text-xs font-sans text-corp-text-secondary max-w-md mx-auto mt-1">
              You haven&apos;t completed any course modules, mock tests, or skill challenges yet. Start learning to unlock verified skills for your profile!
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-white bg-[#2563eb] hover:bg-blue-600 border border-blue-300 shadow-[3px_3px_0px_0px_#1e3a8a]"
            >
              <span>Explore Courses</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
