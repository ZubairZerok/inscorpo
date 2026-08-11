"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Building2, GraduationCap, Banknote, Calendar, ShieldCheck,
  Sparkles, CheckCircle2, AlertCircle, ExternalLink, Award,
  TrendingUp, Compass, Check, Tag, ArrowRight
} from "lucide-react";
import Link from "next/link";
import {
  GovJob, checkDegreeEligibility, calculateGovJobSkillGap,
  getSkillBundles
} from "@/lib/data/gov-jobs-db";
import { CompanyLogo } from "./company-logo";

import { CvFitModal } from "./cv-fit-modal";

interface GovJobModalProps {
  job: GovJob | null;
  onClose: () => void;
}

const ORG_BRAND_BG: Record<string, string> = {
  BARI: "bg-blue-600 text-white",
  BINA: "bg-purple-600 text-white",
  BJRI: "bg-amber-500 text-amber-950",
  BRRI: "bg-blue-600 text-white",
  BTRI: "bg-rose-600 text-white",
  BSRI: "bg-cyan-600 text-white",
};

export function GovJobModal({ job, onClose }: GovJobModalProps) {
  const [userDegreeInput, setUserDegreeInput] = useState("");
  const [selectedUserSkills, setSelectedUserSkills] = useState<string[]>([]);
  const [showCvFit, setShowCvFit] = useState(false);
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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-lg border-2 border-blue-400 shadow-[6px_6px_0px_0px_#2563eb] overflow-hidden my-8 font-mono bg-corp-surface text-corp-text"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-amber-950 border-2 border-amber-500 shadow-sm transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>

          {/* 1. DISTINCT INSTITUTIONAL BRAND HEADER BANNER */}
          <div className={`p-5 ${brandBg} border-b-2 border-blue-400 space-y-1`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider opacity-90">
              <Building2 className="w-4 h-4" />
              <span>{job.ministry}</span>
            </div>
            <div className="flex items-center gap-2">
              <CompanyLogo company={job.organizationName} acronym={job.organizationAcronym} size={36} />
              <span className="px-2.5 py-0.5 rounded-md bg-blue-900/40 text-white font-black text-sm border border-white/20">
                {job.organizationAcronym}
              </span>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                {job.organizationName}
              </h3>
            </div>
          </div>

          <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-5">
            {/* 2. DISTINCT JOB TITLE BLOCK */}
            <div className="p-4 rounded-md border-2 border-blue-400 shadow-[3px_3px_0px_0px_#2563eb] space-y-2 bg-corp-bg-secondary">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#2563eb] text-white border border-blue-400">
                  Grade {job.grade} (National Pay Scale 2015)
                </span>
                {/* Vacancy tag strictly yellow */}
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {job.vacancy} {job.vacancy === 1 ? "Vacancy" : "Vacancies"}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-500/15 text-[#2563eb] border border-blue-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {job.family}
                </span>
              </div>

              {/* High Contrast Job Title */}
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-corp-text">
                {job.title}
              </h2>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1 text-corp-text-tertiary">
                  <Banknote className="w-4 h-4 text-[#2563eb]" />
                  Basic Salary Scale
                </div>
                <div className="text-sm font-black text-corp-text"><span className="font-bangla">৳{job.salary_scale_bdt}</span></div>
                <div className="text-[10px] font-medium text-corp-text-tertiary">Plus Govt Allowances</div>
              </div>

              <div className="p-4 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1 text-corp-text-tertiary">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                  Application Deadline
                </div>
                <div className="text-sm font-black text-corp-text">{job.applicationDeadline}</div>
                <div className="text-[10px] font-medium text-corp-text-tertiary">{job.applicationMode}</div>
              </div>

              <div className="p-4 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
                <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mb-1 text-corp-text-tertiary">
                  <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                  Selection Process
                </div>
                <div className="text-sm font-black truncate text-corp-text">{job.selectionProcess || "Written & Viva"}</div>
                <div className="text-[10px] font-medium text-corp-text-tertiary">Fee: {job.applicationFee || "Per circular"}</div>
              </div>
            </div>

            {/* Educational Requirements */}
            <div className="p-5 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-corp-text">
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                Educational Requirements & Eligibility
              </h3>
              <p className="text-sm font-sans leading-relaxed p-3.5 rounded-md border-2 border-blue-400 bg-corp-surface text-corp-text-secondary">
                {job.requirements}
              </p>
              <div className="mt-3 text-[11px] font-sans font-medium flex items-center gap-2 text-corp-text-tertiary">
                <span className="font-bold text-corp-text-secondary">Experience:</span> {job.experience || "Not specifically required for entry grade"}
              </div>
            </div>

            {/* Degree Eligibility Checker — Sky Blue Accent */}
            <div className="p-5 rounded-md border-2 border-sky-400 shadow-[3px_3px_0px_0px_#0284c7] bg-corp-bg-secondary">
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-corp-text">
                <Sparkles className="w-4 h-4 text-sky-500" />
                INSYT Degree Match Engine
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Type your degree (e.g. Agriculture, Library Science, Civil, Statistics)..."
                  value={userDegreeInput}
                  onChange={(e) => setUserDegreeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-md border-2 border-blue-400 text-xs font-mono font-extrabold outline-none focus:border-[#2563eb] transition-all bg-corp-surface text-corp-text"
                />
              </div>

              {userDegreeInput && (
                <div className="p-3.5 rounded-md border-2 border-blue-400 text-xs flex items-start gap-2 bg-corp-surface">
                  {eligibility.status === "HIGHLY_RECOMMENDED" && (
                    <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                  )}
                  {eligibility.status === "POTENTIALLY_ELIGIBLE" && (
                    <Award className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  )}
                  {eligibility.status === "NEEDS_CHECK" && (
                    <AlertCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  )}
                  <div className="font-sans">
                    <div className="font-bold text-corp-text">{eligibility.notes}</div>
                    {eligibility.matchedDegrees.length > 0 && (
                      <div className="mt-1 text-corp-text-tertiary">
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
              <div className="p-5 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
                <h4 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 text-corp-text">
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
                        className={`p-3 rounded-md border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "border-[#2563eb] shadow-[2px_2px_0px_0px_#2563eb] bg-blue-500/10"
                            : "border-blue-400/40 hover:border-blue-400 bg-corp-surface"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-[#2563eb] border-blue-400" : "border-blue-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3] text-white" />}
                        </div>
                        <div className="font-sans">
                          <div className="text-xs font-bold capitalize text-corp-text">{sk.replace(/_/g, " ")}</div>
                          <div className="text-[10px] mt-0.5 leading-snug text-corp-text-tertiary">{description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post-Joining Competency Roadmap */}
              <div className="p-5 rounded-md border-2 border-blue-400 bg-corp-bg-secondary">
                <h4 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 text-corp-text">
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                  Post-Joining Competency Roadmap
                </h4>
                <p className="text-[11px] font-sans mb-3 text-corp-text-tertiary">
                  Skills you will develop at {job.organizationAcronym} for career progression:
                </p>
                <div className="space-y-2">
                  {job.after_skills_inferred.map((sk) => (
                    <div
                      key={sk}
                      className="p-3 rounded-md border-2 border-blue-400/40 bg-corp-surface text-xs flex items-center gap-2 text-corp-text-secondary"
                    >
                      <Compass className="w-4 h-4 text-[#2563eb] shrink-0" />
                      <span className="capitalize font-bold font-sans">{sk.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Gap Score */}
            {selectedUserSkills.length > 0 && (
              <div className="p-4 rounded-md border-2 border-sky-400 shadow-[3px_3px_0px_0px_#0284c7] bg-corp-bg-secondary">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-corp-text">Skill Readiness Score</span>
                  <span className="text-sm font-black font-mono text-[#2563eb]">{skillGap.readinessPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full border border-blue-400 bg-corp-surface">
                  <div className="h-full rounded-full bg-[#2563eb] transition-all duration-500" style={{ width: `${skillGap.readinessPercentage}%` }} />
                </div>
                {skillGap.missingBeforeSkills.length > 0 && (
                  <div className="mt-2 text-[10px] font-sans text-corp-text-tertiary">
                    Missing: {skillGap.missingBeforeSkills.map(s => s.replace(/_/g, " ")).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions — Dedicated Page CTA */}
            <div className="pt-4 border-t-2 border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] font-sans font-medium text-corp-text-tertiary">
                Circular source verified via official {job.organizationAcronym} portal.
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowCvFit(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-md text-xs font-black uppercase text-amber-950 bg-amber-400 border-2 border-amber-500 shadow-sm hover:bg-amber-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                  CV Fit (-10 XP)
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-md text-xs font-black uppercase border-2 border-blue-400 text-corp-text bg-corp-bg-secondary hover:bg-corp-surface transition-colors cursor-pointer"
                >
                  Close
                </button>

                <Link
                  href={`/jobs/${job.id}`}
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-md text-xs font-black uppercase text-white bg-[#2563eb] border border-blue-300 shadow-[3px_3px_0px_0px_#1e3a8a] hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Dedicated Job Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {showCvFit && (
          <CvFitModal isOpen={showCvFit} job={job} onClose={() => setShowCvFit(false)} />
        )}
      </div>
    </AnimatePresence>
  );
}
