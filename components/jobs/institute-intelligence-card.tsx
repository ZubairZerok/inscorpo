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

interface InstituteIntelligenceCardProps {
  institute: InstituteCard;
  onSelectJob: (job: GovJob) => void;
  onRunCvFit?: (job: GovJob, e: React.MouseEvent) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function InstituteIntelligenceCard({ institute, onSelectJob, onRunCvFit, isExpanded, onToggle }: InstituteIntelligenceCardProps) {
  const jobs = getGovJobsByOrg(institute.acronym);

  return (
    <div className="font-mono">
      {/* Card Header */}
      <div
        onClick={onToggle}
        className={`rounded-2xl p-5 border-2 transition-all cursor-pointer group ${
          isExpanded
            ? "border-[#2563eb] shadow-[4px_4px_0px_0px_#2563eb]"
            : "border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] hover:-translate-y-0.5"
        }`}
        style={{ background: "var(--corp-surface)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#2563eb] text-white border border-blue-400">
                {institute.acronym}
              </span>
              {/* Vacancy tag is strictly yellow */}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                {institute.totalVacancies} Vacancies
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-black uppercase tracking-tight mb-1" style={{ color: "var(--corp-text)" }}>
              {institute.name}
            </h3>

            {/* Ministry & HQ */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium mb-3" style={{ color: "var(--corp-text-tertiary)" }}>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {institute.ministry}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {institute.headquarters}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--corp-text-secondary)" }}>
                <Briefcase className="w-3.5 h-3.5 text-[#2563eb]" />
                {institute.jobCount} Job Categories
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--corp-text-secondary)" }}>
                <Banknote className="w-3.5 h-3.5 text-[#2563eb]" />
                {institute.salaryRange}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "var(--corp-text-secondary)" }}>
                <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
                Deadline: {institute.deadline.split(" ")[0]}
              </div>
            </div>

            {/* High Value Degrees — Sky Blue Tags */}
            <div className="flex flex-wrap gap-1.5">
              {institute.highValueDegrees.slice(0, 5).map((deg) => (
                <span
                  key={deg}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-400/30"
                >
                  {deg}
                </span>
              ))}
              {institute.highValueDegrees.length > 5 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ color: "var(--corp-text-tertiary)" }}>
                  +{institute.highValueDegrees.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Expand Arrow */}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-blue-400 shrink-0 transition-transform" style={{ background: "var(--corp-bg-secondary)" }}>
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
                  onRunCvFit={onRunCvFit}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stats Overview Bar ──────────────────────────────────────────────────────

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
    <div className="grid grid-cols-3 gap-3 font-mono">
      {stats.map((s) => (
        <div
          key={s.label}
          className="p-4 rounded-xl border-2 border-blue-500 shadow-[3px_3px_0px_0px_#2563eb] text-center"
          style={{ background: "var(--corp-surface)" }}
        >
          <div className="flex items-center justify-center mb-1">
            {s.icon}
          </div>
          <div className="text-xl font-black" style={{ color: "var(--corp-text)" }}>{s.value}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--corp-text-tertiary)" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
