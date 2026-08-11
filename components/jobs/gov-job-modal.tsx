"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Building2, GraduationCap, Banknote, Calendar, ShieldCheck,
  Sparkles, CheckCircle2, AlertCircle, ExternalLink, Award,
  TrendingUp, Compass, Check, Tag
} from "lucide-react";
import {
  GovJob, checkDegreeEligibility, calculateGovJobSkillGap,
  getSkillBundles
} from "@/lib/data/gov-jobs-db";

interface GovJobModalProps {
  job: GovJob | null;
  onClose: () => void;
}

const ORG_BRAND_BG: Record<string, string> = {
  BARI: "bg-emerald-700 text-white",
  BINA: "bg-purple-700 text-white",
  BJRI: "bg-amber-700 text-white",
  BRRI: "bg-blue-700 text-white",
  BTRI: "bg-rose-700 text-white",
  BSRI: "bg-teal-700 text-white",
};

export function GovJobModal({ job, onClose }: GovJobModalProps) {
  const [userDegreeInput, setUserDegreeInput] = useState("");
  const [selectedUserSkills, setSelectedUserSkills] = useState<string[]>([]);
  const skillBundles = getSkillBundles();

  if (!job) return null;

  const eligibility = checkDegreeEligibility(job, userDegreeInput || undefined);
  const skillGap = calculateGovJobSkillGap(job, selectedUserSkills);
  const brandBg = ORG_BRAND_BG[job.organizationAcronym] || "bg-[#2563eb] text-white";

  const toggleSkill = (skill: string) => {
    if (selectedUserSkills.includes(skill)) {
      setSelectedUserSkills(selectedUserSkills.filter((s) => s !== skill));
    } else {
      setSelectedUserSkills([...selectedUserSkills, skill]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-2xl border-2 border-blue-500 shadow-[6px_6px_0px_0px_#2563eb] overflow-hidden my-8 font-mono"
          style={{ background: "var(--corp-surface)" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg border-2 border-blue-400 transition-colors z-20 shadow-md"
            style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* 1. DISTINCT INSTITUTIONAL BRAND HEADER BANNER */}
          <div className={`p-5 ${brandBg} border-b-4 border-blue-500 space-y-1`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider opacity-90">
              <Building2 className="w-4 h-4" />
              <span>{job.ministry}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-black/30 text-white font-black text-sm border border-white/20">
                {job.organizationAcronym}
              </span>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                {job.organizationName}
              </h3>
            </div>
          </div>

          <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-5">
            {/* 2. DISTINCT JOB TITLE BLOCK */}
            <div className="p-4 rounded-xl border-2 border-blue-500 shadow-[3px_3px_0px_0px_#2563eb] space-y-2" style={{ background: "var(--corp-bg-secondary)" }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#2563eb] text-white border border-blue-400">
                  Grade {job.grade} (National Pay Scale 2015)
                </span>
                {/* Vacancy tag is strictly yellow */}
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {job.vacancy} {job.vacancy === 1 ? "Vacancy" : "Vacancies"}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-500/15 text-[#2563eb] border border-blue-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {job.family}
                </span>
              </div>

              {/* High Contrast Job Title */}
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight" style={{ color: "var(--corp-text)" }}>
                {job.title}
              </h2>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: "var(--corp-text-tertiary)" }}>
                  <Banknote className="w-4 h-4 text-[#2563eb]" />
                  Basic Salary Scale
                </div>
                <div className="text-sm font-black" style={{ color: "var(--corp-text)" }}>৳{job.salary_scale_bdt}</div>
                <div className="text-[10px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>Plus Govt Allowances</div>
              </div>

              <div className="p-4 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: "var(--corp-text-tertiary)" }}>
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                  Application Deadline
                </div>
                <div className="text-sm font-black" style={{ color: "var(--corp-text)" }}>{job.applicationDeadline}</div>
                <div className="text-[10px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>{job.applicationMode}</div>
              </div>

              <div className="p-4 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: "var(--corp-text-tertiary)" }}>
                  <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                  Selection Process
                </div>
                <div className="text-sm font-black truncate" style={{ color: "var(--corp-text)" }}>{job.selectionProcess || "Written & Viva"}</div>
                <div className="text-[10px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>Fee: {job.applicationFee || "Per circular"}</div>
              </div>
            </div>

            {/* Educational Requirements */}
            <div className="p-5 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                Educational Requirements & Eligibility
              </h3>
              <p className="text-sm font-sans leading-relaxed p-3.5 rounded-lg border-2 border-blue-400" style={{ background: "var(--corp-surface)", color: "var(--corp-text-secondary)" }}>
                {job.requirements}
              </p>
              <div className="mt-3 text-[11px] font-sans font-medium flex items-center gap-2" style={{ color: "var(--corp-text-tertiary)" }}>
                <span className="font-bold" style={{ color: "var(--corp-text-secondary)" }}>Experience:</span> {job.experience || "Not specifically required for entry grade"}
              </div>
            </div>

            {/* Degree Eligibility Checker — Sky Blue Accent */}
            <div className="p-5 rounded-xl border-2 border-sky-400 shadow-[3px_3px_0px_0px_#0284c7]" style={{ background: "var(--corp-bg-secondary)" }}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <Sparkles className="w-4 h-4 text-sky-500" />
                INSYT Degree Match Engine
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Type your degree (e.g. Agriculture, Library Science, Civil, Statistics)..."
                  value={userDegreeInput}
                  onChange={(e) => setUserDegreeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border-2 border-blue-400 text-xs font-mono font-extrabold outline-none focus:border-[#2563eb] transition-all"
                  style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
                />
              </div>

              {userDegreeInput && (
                <div className="p-3.5 rounded-lg border-2 text-xs flex items-start gap-2" style={{ borderColor: "var(--corp-border)", background: "var(--corp-surface)" }}>
                  {eligibility.status === "HIGHLY_RECOMMENDED" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  )}
                  {eligibility.status === "POTENTIALLY_ELIGIBLE" && (
                    <Award className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  )}
                  {eligibility.status === "NEEDS_CHECK" && (
                    <AlertCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  )}
                  <div className="font-sans">
                    <div className="font-bold" style={{ color: "var(--corp-text)" }}>{eligibility.notes}</div>
                    {eligibility.matchedDegrees.length > 0 && (
                      <div className="mt-1" style={{ color: "var(--corp-text-tertiary)" }}>
                        Matched Domain: {eligibility.matchedDegrees.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pre-Joining & Post-Joining Skill Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pre-Joining */}
              <div className="p-5 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                <h4 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "var(--corp-text)" }}>
                  <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                  Pre-Joining Required Skills
                </h4>
                <div className="space-y-2">
                  {job.before_skills.map((sk) => {
                    const isSelected = selectedUserSkills.includes(sk);
                    const description = skillBundles[sk] || "Core functional skill required for initial screening.";
                    return (
                      <div
                        key={sk}
                        onClick={() => toggleSkill(sk)}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "border-[#2563eb] shadow-[2px_2px_0px_0px_#2563eb]"
                            : "hover:border-blue-400"
                        }`}
                        style={{
                          background: isSelected ? "var(--corp-accent-light, #EEF2FF)" : "var(--corp-surface)",
                          borderColor: isSelected ? "#2563eb" : "var(--corp-border)",
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-[#2563eb] border-blue-400" : ""
                          }`}
                          style={{ borderColor: isSelected ? "#2563eb" : "var(--corp-border)" }}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3] text-white" />}
                        </div>
                        <div className="font-sans">
                          <div className="text-xs font-bold capitalize" style={{ color: "var(--corp-text)" }}>{sk.replace(/_/g, " ")}</div>
                          <div className="text-[10px] mt-0.5 leading-snug" style={{ color: "var(--corp-text-tertiary)" }}>{description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post-Joining Competency Roadmap */}
              <div className="p-5 rounded-xl border-2 border-blue-400" style={{ background: "var(--corp-bg-secondary)" }}>
                <h4 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: "var(--corp-text)" }}>
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                  Post-Joining Competency Roadmap
                </h4>
                <p className="text-[11px] font-sans mb-3" style={{ color: "var(--corp-text-tertiary)" }}>
                  Skills you will develop at {job.organizationAcronym} for career progression:
                </p>
                <div className="space-y-2">
                  {job.after_skills_inferred.map((sk) => (
                    <div
                      key={sk}
                      className="p-3 rounded-lg border-2 text-xs flex items-center gap-2"
                      style={{ borderColor: "var(--corp-border)", background: "var(--corp-surface)", color: "var(--corp-text-secondary)" }}
                    >
                      <Compass className="w-4 h-4 text-[#2563eb] shrink-0" />
                      <span className="capitalize font-bold font-sans">{sk.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Gap Score — Sky Blue Accent */}
            {selectedUserSkills.length > 0 && (
              <div className="p-4 rounded-xl border-2 border-sky-400 shadow-[3px_3px_0px_0px_#0284c7]" style={{ background: "var(--corp-bg-secondary)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--corp-text)" }}>Skill Readiness Score</span>
                  <span className="text-sm font-black font-mono text-[#2563eb]">{skillGap.readinessPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "var(--corp-border)" }}>
                  <div className="h-full rounded-full bg-[#2563eb] transition-all duration-500" style={{ width: `${skillGap.readinessPercentage}%` }} />
                </div>
                {skillGap.missingBeforeSkills.length > 0 && (
                  <div className="mt-2 text-[10px] font-sans" style={{ color: "var(--corp-text-tertiary)" }}>
                    Missing: {skillGap.missingBeforeSkills.map(s => s.replace(/_/g, " ")).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "var(--corp-border)" }}>
              <div className="text-[10px] font-sans font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                Circular source verified via official {job.organizationAcronym} portal.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-black uppercase border-2 transition-colors"
                  style={{ borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)", background: "var(--corp-bg-secondary)" }}
                >
                  Close
                </button>

                <a
                  href={`https://${job.organizationAcronym.toLowerCase()}.teletalk.com.bd`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-black uppercase text-white bg-[#2563eb] border border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-1.5"
                >
                  Apply via Teletalk
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
