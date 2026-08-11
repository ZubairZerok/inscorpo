"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ChevronDown, ChevronRight, GraduationCap,
  Banknote, Calendar, ShieldCheck, Sparkles, Briefcase,
  Users, MapPin
} from "lucide-react";
import { InstituteCard, GovJob, getGovJobsByOrg } from "@/lib/data/gov-jobs-db";
import { GovJobCard } from "./gov-job-card";
import { CompanyLogo } from "./company-logo";

interface InstituteIntelligenceCardProps {
  institute: InstituteCard;
  onSelectJob?: (job: GovJob) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function InstituteIntelligenceCard({ institute, onSelectJob, isExpanded, onToggle }: InstituteIntelligenceCardProps) {
  const jobs = getGovJobsByOrg(institute.acronym);

  return (
    <div className="font-mono">
      {/* Card Header — Crisp formal styling with subtle corner radius (~10%) */}
      <div
        onClick={onToggle}
        className={`rounded-sm p-5 border-2 transition-all cursor-pointer group ${
          isExpanded
            ? "border-[#2563eb] shadow-[3px_3px_0px_0px_#2563eb]"
            : "border-blue-400 shadow-[3px_3px_0px_0px_#2563eb] hover:-translate-y-0.5"
        }`}
        style={{ background: "var(--corp-surface)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CompanyLogo company={institute.name} acronym={institute.acronym} size={32} />
              <span className="px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider bg-[#2563eb] text-white border border-blue-400">
                {institute.acronym}
              </span>
              {/* Vacancy tag strictly yellow */}
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                {institute.totalVacancies} Vacancies
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-black uppercase tracking-tight mb-1 text-corp-text">
              {institute.name}
            </h3>

            {/* Ministry & HQ */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium mb-3 text-corp-text-tertiary">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#2563eb]" />
                {institute.ministry}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2563eb]" />
                {institute.headquarters}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-corp-text-secondary">
                <Briefcase className="w-3.5 h-3.5 text-[#2563eb]" />
                {institute.jobCount} Job Categories
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-corp-text-secondary">
                <Banknote className="w-3.5 h-3.5 text-[#2563eb]" />
                <span className="font-bangla">{institute.salaryRange}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-corp-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
                Deadline: {institute.deadline.split(" ")[0]}
              </div>
            </div>

            {/* High Value Degrees — Sky Blue Tags */}
            <div className="flex flex-wrap gap-1.5">
              {institute.highValueDegrees.slice(0, 5).map((deg) => (
                <span
                  key={deg}
                  className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30"
                >
                  {deg}
                </span>
              ))}
              {institute.highValueDegrees.length > 5 && (
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold text-corp-text-tertiary">
                  +{institute.highValueDegrees.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Expand Arrow */}
          <div className="flex items-center justify-center w-10 h-10 rounded-sm border-2 border-blue-400 shrink-0 transition-transform bg-corp-bg-secondary">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-[#2563eb]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#2563eb]" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Job List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jobs.map((job) => (
                <GovJobCard
                  key={job.id}
                  job={job}
                  onSelect={onSelectJob}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Plain & Formal Stats Overview Bar (Non-card style) ──────────────────────

interface StatsOverviewBarProps {
  totalOrgs: number;
  totalJobs: number;
  totalVacancies: number;
}

export function StatsOverviewBar({ totalOrgs, totalJobs, totalVacancies }: StatsOverviewBarProps) {
  const stats = [
    { label: "Organizations", value: totalOrgs, icon: <Building2 className="w-4 h-4 text-[#2563eb]" /> },
    { label: "Job Categories", value: totalJobs, icon: <Briefcase className="w-4 h-4 text-[#2563eb]" /> },
    { label: "Total Vacancies", value: totalVacancies, icon: <Users className="w-4 h-4 text-[#2563eb]" /> },
  ];

  return (
    <div className="flex flex-wrap items-center justify-around gap-4 py-3.5 px-6 rounded-sm border-y-2 border-blue-400/40 bg-blue-500/5 font-mono text-xs shadow-sm">
      {stats.map((s, idx) => (
        <div key={s.label} className="flex items-center gap-3">
          <div className="p-1.5 rounded-sm bg-blue-500/10 border border-blue-400/40">{s.icon}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-corp-text">{s.value}</span>
            <span className="text-[11px] font-bold uppercase text-corp-text-tertiary tracking-wider">{s.label}</span>
          </div>
          {idx < stats.length - 1 && (
            <div className="hidden md:block h-6 w-px bg-blue-400/30 ml-6" />
          )}
        </div>
      ))}
    </div>
  );
}
