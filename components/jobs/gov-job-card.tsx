"use client";

import { motion } from "framer-motion";
import {
  Building2, GraduationCap, Banknote, Calendar, ChevronRight, ShieldCheck, Tag
} from "lucide-react";
import Link from "next/link";
import { GovJob } from "@/lib/data/gov-jobs-db";
import { CompanyLogo } from "./company-logo";
import { JobMatchBadge } from "./job-match-badge";

interface GovJobCardProps {
  job: GovJob;
  onSelect?: (job: GovJob) => void;
}

const ORG_BRAND_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  BARI: { bg: "bg-blue-600 text-white border-blue-400", text: "text-blue-600", border: "border-blue-400" },
  BINA: { bg: "bg-purple-600 text-white border-purple-400", text: "text-purple-600", border: "border-purple-400" },
  BJRI: { bg: "bg-amber-500 text-amber-950 border-amber-600", text: "text-amber-600", border: "border-amber-500" },
  BRRI: { bg: "bg-blue-600 text-white border-blue-400", text: "text-blue-600", border: "border-blue-400" },
  BTRI: { bg: "bg-rose-600 text-white border-rose-400", text: "text-rose-600", border: "border-rose-400" },
  BSRI: { bg: "bg-cyan-600 text-white border-cyan-400", text: "text-cyan-600", border: "border-cyan-400" },
};

export function GovJobCard({ job, onSelect }: GovJobCardProps) {
  const brand = ORG_BRAND_STYLES[job.organizationAcronym] || {
    bg: "bg-[#2563eb] text-white border-blue-400",
    text: "text-[#2563eb]",
    border: "border-blue-400",
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group rounded-sm p-5 border-2 border-blue-400 shadow-[3px_3px_0px_0px_#2563eb] transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between font-mono relative overflow-hidden block"
      style={{ background: "var(--corp-surface)" }}
    >
      <div>
        {/* Top Header: Institute Badge with Logo vs Vacancy & Grade */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-blue-400/30">
          <div className="flex items-center gap-2">
            <CompanyLogo company={job.organizationName} acronym={job.organizationAcronym} size={28} />
            <span className={`px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-wider shadow-sm border ${brand.bg} flex items-center gap-1`}>
              {job.organizationAcronym}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border-2 border-blue-400 bg-corp-bg-secondary text-corp-text-secondary">
              Grade {job.grade}
            </span>
          </div>

          {/* Vacancy tag strictly yellow */}
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-sm bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            {job.vacancy} {job.vacancy === 1 ? "Vacancy" : "Vacancies"}
          </span>
        </div>

        {/* Full Institute Name Subheader */}
        <div className="text-[10px] font-sans font-bold uppercase tracking-wider mb-2 text-corp-text-tertiary">
          {job.organizationName}
        </div>

        {/* Job Title — PROMINENT Typography */}
        <h3 className="text-base font-black uppercase tracking-tight mb-2 group-hover:text-[#2563eb] transition-colors leading-snug text-corp-text">
          {job.title}
        </h3>

        {/* Post Family Tag & Match Fit Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-blue-500/10 text-[#2563eb] border border-blue-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {job.family}
          </span>
          <JobMatchBadge jobId={job.id} />
        </div>

        {/* Educational Requirements Snippet */}
        <div className="mb-3 p-3 rounded-sm border-2 border-blue-400 text-[11px] font-sans leading-relaxed bg-corp-bg-secondary text-corp-text-secondary">
          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <strong className="text-corp-text">Requirement:</strong> {job.requirements}
            </p>
          </div>
        </div>

        {/* Pre-joining Required Skills */}
        {job.before_skills && job.before_skills.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1 text-corp-text-tertiary">
              <ShieldCheck className="w-3 h-3 text-[#2563eb]" />
              Screening Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.before_skills.map((sk) => (
                <span
                  key={sk}
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border-2 border-blue-400/40 bg-corp-bg-secondary text-corp-text-secondary"
                >
                  {sk.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Salary + Details Link */}
      <div className="pt-3 border-t-2 border-blue-400/30 flex items-center justify-between gap-2 mt-2">
        <div>
          <div className="text-xs font-black flex items-center gap-1 text-[#2563eb]">
            <Banknote className="w-3.5 h-3.5" />
            <span className="font-bangla">৳{job.salary_scale_bdt}</span>
          </div>
          <div className="text-[10px] font-medium flex items-center gap-1 mt-0.5 text-corp-text-tertiary">
            <Calendar className="w-3 h-3" />
            Deadline: {job.applicationDeadline.split(" ")[0]}
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase text-white bg-[#2563eb] border border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a] flex items-center gap-1 group-hover:bg-[#1d4ed8] transition-colors">
          View Details
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
