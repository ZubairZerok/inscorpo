"use client";

import { motion } from "framer-motion";
import {
  Building2, GraduationCap, Banknote, Calendar, ChevronRight, ShieldCheck, Tag, Sparkles
} from "lucide-react";
import { GovJob } from "@/lib/data/gov-jobs-db";

interface GovJobCardProps {
  job: GovJob;
  onSelect: (job: GovJob) => void;
  onRunCvFit?: (job: GovJob, e: React.MouseEvent) => void;
}

// Distinct institutional brand visual tokens
const ORG_BRAND_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  BARI: { bg: "bg-emerald-600 text-white border-emerald-400", text: "text-emerald-500", border: "border-emerald-500" },
  BINA: { bg: "bg-purple-600 text-white border-purple-400", text: "text-purple-500", border: "border-purple-500" },
  BJRI: { bg: "bg-amber-600 text-white border-amber-400", text: "text-amber-500", border: "border-amber-500" },
  BRRI: { bg: "bg-blue-600 text-white border-blue-400", text: "text-blue-500", border: "border-blue-500" },
  BTRI: { bg: "bg-rose-600 text-white border-rose-400", text: "text-rose-500", border: "border-rose-500" },
  BSRI: { bg: "bg-teal-600 text-white border-teal-400", text: "text-teal-500", border: "border-teal-500" },
};

export function GovJobCard({ job, onSelect, onRunCvFit }: GovJobCardProps) {
  const brand = ORG_BRAND_STYLES[job.organizationAcronym] || {
    bg: "bg-indigo-600 text-white border-indigo-400",
    text: "text-indigo-500",
    border: "border-indigo-500",
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className="group rounded-2xl p-5 border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between font-mono relative overflow-hidden"
      style={{ background: "var(--corp-surface)" }}
    >
      <div>
        {/* Top Header: Unmistakable Institute Badge vs Vacancy & Grade */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b-2" style={{ borderColor: "var(--corp-border)" }}>
          {/* Institute Pill — Solid Colored Box */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-sm border ${brand.bg} flex items-center gap-1`}>
              <Building2 className="w-3.5 h-3.5" />
              {job.organizationAcronym}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border-2 border-blue-400" style={{ color: "var(--corp-text-secondary)", background: "var(--corp-bg-secondary)" }}>
              Grade {job.grade}
            </span>
          </div>

          {/* Vacancy tag is strictly yellow */}
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            {job.vacancy} {job.vacancy === 1 ? "Vacancy" : "Vacancies"}
          </span>
        </div>

        {/* Full Institute Name Subheader */}
        <div className="text-[10px] font-sans font-bold uppercase tracking-wider mb-2" style={{ color: "var(--corp-text-tertiary)" }}>
          {job.organizationName}
        </div>

        {/* Job Title — PROMINENT, HIGH CONTRAST Typography */}
        <h3 className="text-base font-black uppercase tracking-tight mb-2 group-hover:text-[#2563eb] transition-colors leading-snug" style={{ color: "var(--corp-text)" }}>
          {job.title}
        </h3>

        {/* Post Family Tag */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-[#2563eb] border border-blue-400/40 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {job.family}
          </span>
        </div>

        {/* Educational Requirements Snippet */}
        <div className="mb-3 p-3 rounded-xl border-2 border-blue-400 text-[11px] font-sans leading-relaxed" style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text-secondary)" }}>
          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <strong style={{ color: "var(--corp-text)" }}>Requirement:</strong> {job.requirements}
            </p>
          </div>
        </div>

        {/* Pre-joining Required Skills */}
        {job.before_skills && job.before_skills.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "var(--corp-text-tertiary)" }}>
              <ShieldCheck className="w-3 h-3 text-[#2563eb]" />
              Screening Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.before_skills.map((sk) => (
                <span
                  key={sk}
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border"
                  style={{ borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)", background: "var(--corp-bg-secondary)" }}
                >
                  {sk.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Salary + CV Fit Check & View Circular Actions */}
      <div className="pt-3 border-t-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2" style={{ borderColor: "var(--corp-border)" }}>
        <div>
          <div className="text-xs font-black flex items-center gap-1 text-[#2563eb]">
            <Banknote className="w-3.5 h-3.5" />
            ৳{job.salary_scale_bdt}
          </div>
          <div className="text-[10px] font-medium flex items-center gap-1 mt-0.5" style={{ color: "var(--corp-text-tertiary)" }}>
            <Calendar className="w-3 h-3" />
            Deadline: {job.applicationDeadline.split(" ")[0]}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {onRunCvFit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRunCvFit(job, e);
              }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase text-sky-950 bg-sky-400 border border-sky-500 shadow-sm flex items-center gap-1 hover:bg-sky-300 transition-colors"
              title="Run AI CV Fit Check (10 XP)"
            >
              <Sparkles className="w-3 h-3 text-sky-950" />
              CV Fit (-10 XP)
            </button>
          )}

          <div className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white bg-[#2563eb] border border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a] flex items-center gap-1 group-hover:bg-[#1d4ed8] transition-colors">
            Details
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
