"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, AlertCircle, CheckCircle2, Award, ArrowRight,
  BookOpen, GraduationCap, ShieldCheck, Zap, Coins, Building2
} from "lucide-react";
import Link from "next/link";
import { GovJob, analyzeCvFit, CvFitResult } from "@/lib/data/gov-jobs-db";
import { useUser } from "@/components/providers/user-context";

interface CvFitModalProps {
  job: GovJob | null;
  onClose: () => void;
}

export function CvFitModal({ job, onClose }: CvFitModalProps) {
  const { state, addXP, addNotification } = useUser();

  const passportProfile: any = state.passportProfile || {};
  const [customDegree, setCustomDegree] = useState<string>(
    passportProfile.education?.[0]?.degree || passportProfile.degree || ""
  );
  const [customSkillsInput, setCustomSkillsInput] = useState<string>(
    Array.isArray(passportProfile.skills) ? passportProfile.skills.join(", ") : ""
  );
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CvFitResult | null>(null);

  if (!job) return null;

  const userXp = state.xp;
  const hasEnoughXp = userXp >= 10;

  const handleRunAnalysis = () => {
    if (!hasEnoughXp) return;

    // Parse user skills
    const skillsArray = customSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Deduct 10 XP
    addXP(-10, `CV Fit Check: ${job.title} (${job.organizationAcronym})`);

    // Run AI / Rule Engine analysis
    const result = analyzeCvFit(job, {
      degree: customDegree,
      skills: skillsArray,
    });

    setAnalysisResult(result);
    setIsAnalyzed(true);

    addNotification({
      type: "achievement",
      title: "CV Fit Check Complete (-10 XP)",
      message: `Analyzed alignment for ${job.title}. Match score: ${result.matchScore}%`,
    });
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-2xl border-2 border-blue-500 shadow-[6px_6px_0px_0px_#2563eb] overflow-hidden my-8 font-mono"
          style={{ background: "var(--corp-surface)" }}
        >
          {/* Top Accent Bar */}
          <div className="h-2 bg-[#2563eb]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg border-2 border-blue-400 transition-colors z-20 shadow-md"
            style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8 space-y-5">
            {/* Header Block */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#2563eb] text-white border border-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-300" />
                  INSYT AI CV Fit Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Cost: 10 XP
                </span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: "var(--corp-text)" }}>
                CV Fit Check — {job.title}
              </h2>
              <p className="text-xs font-sans font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                {job.organizationAcronym} · Grade {job.grade} · National Pay Scale 2015
              </p>
            </div>

            {/* 1. INITIAL MISSING DATA INPUT / XP CHECK FORM */}
            {!isAnalyzed ? (
              <div className="space-y-4">
                {/* XP Balance Indicator */}
                <div
                  className={`p-4 rounded-xl border-2 flex items-center justify-between font-mono text-xs ${
                    hasEnoughXp ? "border-blue-400" : "border-rose-500 bg-rose-500/10 text-rose-600"
                  }`}
                  style={{ background: hasEnoughXp ? "var(--corp-bg-secondary)" : undefined }}
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Your XP Balance: <strong className="font-black text-sm">{userXp} XP</strong></span>
                  </div>
                  {hasEnoughXp ? (
                    <span className="text-[10px] font-black uppercase text-green-600">Sufficient XP</span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-rose-600">Need 10 XP</span>
                  )}
                </div>

                {!hasEnoughXp && (
                  <div className="p-3 rounded-lg border-2 border-rose-500 bg-rose-500/10 text-rose-600 text-xs font-sans">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    You need at least 10 XP to run a CV Fit Check. Claim your daily check-in or complete quests to earn XP!
                  </div>
                )}

                {/* Profile Data Inputs */}
                <div className="p-5 rounded-xl border-2 border-blue-400 space-y-4" style={{ background: "var(--corp-bg-secondary)" }}>
                  <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                    <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                    Verify / Add Your Profile Data for Accuracy
                  </div>

                  {/* Degree Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--corp-text-secondary)" }}>
                      Degree / Major (e.g. Agriculture, Library Science, Civil, CSE, Statistics)
                    </label>
                    <input
                      type="text"
                      placeholder="Type your degree major..."
                      value={customDegree}
                      onChange={(e) => setCustomDegree(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border-2 border-blue-400 text-xs font-mono font-extrabold outline-none focus:border-[#2563eb]"
                      style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
                    />
                  </div>

                  {/* Skills Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--corp-text-secondary)" }}>
                      Key Technical &amp; Screening Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. research, statistics_data, computer, agriscience..."
                      value={customSkillsInput}
                      onChange={(e) => setCustomSkillsInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border-2 border-blue-400 text-xs font-mono font-extrabold outline-none focus:border-[#2563eb]"
                      style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
                    />
                  </div>
                </div>

                {/* Requirements Reminder */}
                <div className="p-3.5 rounded-lg border-2 border-sky-400 text-xs font-sans" style={{ background: "var(--corp-surface)" }}>
                  <span className="font-bold font-mono text-sky-600 uppercase text-[10px] block mb-1">Circular Prerequisite:</span>
                  <p style={{ color: "var(--corp-text-secondary)" }}>{job.requirements}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-lg text-xs font-black uppercase border-2 transition-colors"
                    style={{ borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)" }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!hasEnoughXp}
                    onClick={handleRunAnalysis}
                    className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase text-white border border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] transition-all flex items-center gap-1.5 ${
                      hasEnoughXp ? "bg-[#2563eb] hover:bg-[#1d4ed8]" : "bg-slate-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>Execute Fit Analysis (-10 XP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* 2. ANALYSIS RESULTS VIEW */
              analysisResult && (
                <div className="space-y-5">
                  {/* Score Meter Banner */}
                  <div
                    className="p-5 rounded-xl border-2 border-sky-400 shadow-[4px_4px_0px_0px_#0284c7] font-mono space-y-3"
                    style={{ background: "var(--corp-bg-secondary)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-sky-500" />
                        <span className="text-xs font-black uppercase text-corp-text">CV Fit Analysis Verdict</span>
                      </div>
                      <span className="text-2xl font-black text-[#2563eb]">{analysisResult.matchScore}%</span>
                    </div>

                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--corp-border)" }}>
                      <div
                        className="h-full bg-[#2563eb] transition-all duration-700 rounded-full"
                        style={{ width: `${analysisResult.matchScore}%` }}
                      />
                    </div>

                    <p className="text-xs font-sans font-medium leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                      {analysisResult.guidanceText}
                    </p>
                  </div>

                  {/* Skill & Prerequisite Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Matched Skills */}
                    <div className="p-4 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                      <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Matched Prerequisites ({analysisResult.matchedSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.matchedSkills.length > 0 ? (
                          analysisResult.matchedSkills.map((sk) => (
                            <span key={sk} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30">
                              {sk.replace(/_/g, " ")}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-sans italic text-corp-text-tertiary">No direct skill matches logged</span>
                        )}
                      </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="p-4 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                      <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mb-2 text-sky-600">
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        Skills to Bridge ({analysisResult.missingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.missingSkills.length > 0 ? (
                          analysisResult.missingSkills.map((sk) => (
                            <span key={sk} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/30">
                              {sk.replace(/_/g, " ")}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-sans font-bold text-green-600">All screening skills matched!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SAAS Internal Course Recommendations */}
                  <div className="p-5 rounded-xl border-2 border-blue-500 shadow-[3px_3px_0px_0px_#2563eb] space-y-3" style={{ background: "var(--corp-surface)" }}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#2563eb]" />
                      <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--corp-text)" }}>
                        Recommended SAAS Learning Tracks
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {analysisResult.recommendedCourses.map((c) => (
                        <div
                          key={c.slug}
                          className="p-3 rounded-lg border-2 border-blue-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#2563eb] transition-all"
                          style={{ background: "var(--corp-bg-secondary)" }}
                        >
                          <div>
                            <h5 className="text-xs font-black uppercase text-[#2563eb]">{c.title}</h5>
                            <p className="text-[11px] font-sans font-medium text-corp-text-tertiary mt-0.5">{c.reason}</p>
                          </div>

                          <Link
                            href={c.url}
                            className="px-3 py-1.5 rounded text-[10px] font-black uppercase text-white bg-[#2563eb] border border-blue-300 shadow-sm flex items-center gap-1 shrink-0 self-start sm:self-auto hover:bg-[#1d4ed8] transition-colors"
                          >
                            Enroll Course
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Re-analyze or Close */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => setIsAnalyzed(false)}
                      className="px-4 py-2.5 rounded-lg text-xs font-black uppercase border-2 transition-colors"
                      style={{ borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)" }}
                    >
                      Modify CV Data
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-lg text-xs font-black uppercase text-white bg-[#2563eb] border border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
