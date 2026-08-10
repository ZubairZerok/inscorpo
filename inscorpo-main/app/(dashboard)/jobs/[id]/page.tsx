"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Calendar,
  CheckCircle2, Clock, ShieldCheck, Share2, UserCheck, Sparkles,
  ChevronRight, Award, Check, FileText, Download
} from "lucide-react";
import Link from "next/link";
import { jobsData, JobListing } from "@/lib/data/jobs";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { createJobApplication } from "@/lib/db";
import { CareerPassportApplyModal } from "@/components/jobs/career-passport-apply-modal";
import { JobPostingSchema } from "@/components/seo/structured-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage(props: PageProps) {
  const { state, addNotification, addXP } = useUser();
  const { user } = useAuth();
  const [applied, setApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  const params = use(props.params);
  const rawId = params?.id || "brac-bank-mtp";

  const job: JobListing = jobsData.find((j) => j.id === rawId || (j as any).slug === rawId) || jobsData[0];

  useEffect(() => {
    const stored = localStorage.getItem(`insyt_job_app_${job.id}`);
    if (stored) {
      try {
        setApplicationData(JSON.parse(stored));
        setApplied(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, [job.id]);

  const handleApplySuccess = async (coverNote: string) => {
    const record = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      refId: `INSYT-PASSPORT-APP-${job.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      coverNote,
    };

    const newDoc = {
      $id: `app_local_${job.id}`,
      jobId: job.id,
      userId: user?.$id || "guest",
      jobTitle: job.title,
      company: job.company,
      status: "applied",
      appliedAt: new Date().toISOString(),
      notes: coverNote || "",
    };

    try {
      localStorage.setItem(`insyt_job_app_${job.id}`, JSON.stringify(record));
      const existingStr = localStorage.getItem("insyt_job_applications") || "[]";
      const existingApps = JSON.parse(existingStr);
      if (!existingApps.some((a: any) => a.jobId === job.id)) {
        localStorage.setItem("insyt_job_applications", JSON.stringify([newDoc, ...existingApps]));
      }
    } catch (e) {
      console.error(e);
    }

    if (user) {
      await createJobApplication(user.$id, job.id, job.title, job.company);
    }

    setApplicationData(record);
    setApplied(true);
    setApplyModalOpen(false);

    addXP(100, `Submitted Career Passport CV for ${job.title}`);

    addNotification({
      type: "achievement",
      title: "Application Transmitted!",
      message: `Your verified INSYT Career Passport CV was submitted directly to ${job.company} Talent Acquisition.`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4 sm:px-6 font-sans">
      <JobPostingSchema
        title={job.title}
        description={job.description}
        company={job.company}
        location={job.location}
        salary={job.salary}
        postedDate={job.postedDate}
        deadline={job.deadline}
        type={job.type}
      />
      
      {/* Back Link */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-corp-text-secondary hover:text-[#10b981] transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Back to All Jobs
        </Link>
      </div>

      {/* Hero Header Card */}
      <div
        className="rounded-xl p-6 sm:p-8 border-2 border-[#10b981] shadow-[6px_6px_0px_0px_#10b981] space-y-6 relative overflow-hidden"
        style={{ background: "var(--corp-surface)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#10b981] text-emerald-950 flex items-center justify-center text-4xl flex-shrink-0 border-2 border-emerald-300 shadow-[3px_3px_0px_0px_#064e3b]">
              {job.logo}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]">
                  {job.department}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-400/15 text-amber-500 border border-amber-500">
                  {job.experienceLevel}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono uppercase tracking-tight" style={{ color: "var(--corp-text)" }}>
                {job.title}
              </h1>

              <p className="text-sm font-mono font-extrabold text-[#10b981]">
                {job.company}
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="w-full sm:w-auto flex-shrink-0 font-mono">
            {applied ? (
              <div className="space-y-2">
                <div className="px-6 py-3 rounded-lg text-xs font-extrabold bg-[#10b981]/15 text-[#10b981] border-2 border-[#10b981] flex items-center justify-center gap-2 shadow-sm uppercase">
                  <CheckCircle2 size={16} /> Application Transmitted
                </div>
                {applicationData?.refId && (
                  <p className="text-[10px] font-mono text-corp-text-tertiary text-center">
                    Ref: {applicationData.refId}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-xs font-extrabold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-[4px_4px_0px_0px_#881337] border-2 border-rose-300 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>Apply with Career Passport</span>
                <Sparkles size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Spec Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-corp-border text-xs font-mono">
          <div className="p-3 rounded-lg bg-corp-bg-secondary space-y-0.5 border-2 border-corp-border">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Location</span>
            <p className="font-extrabold text-corp-text flex items-center gap-1"><MapPin size={12} className="text-[#10b981]" /> {job.location}</p>
          </div>
          <div className="p-3 rounded-lg bg-corp-bg-secondary space-y-0.5 border-2 border-corp-border">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Monthly Compensation</span>
            <p className="font-extrabold text-[#10b981] flex items-center gap-1"><DollarSign size={12} /> {job.salary}</p>
          </div>
          <div className="p-3 rounded-lg bg-corp-bg-secondary space-y-0.5 border-2 border-corp-border">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Employment Type</span>
            <p className="font-extrabold text-corp-text flex items-center gap-1"><Briefcase size={12} /> {job.type}</p>
          </div>
          <div className="p-3 rounded-lg bg-corp-bg-secondary space-y-0.5 border-2 border-corp-border">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Application Deadline</span>
            <p className="font-extrabold text-amber-500 flex items-center gap-1"><Calendar size={12} /> {job.deadline}</p>
          </div>
        </div>
      </div>

      {/* Main Specification Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-corp-border space-y-4 shadow-[4px_4px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase" style={{ color: "var(--corp-text)" }}>Role Description</h2>
            <p className="text-xs sm:text-sm leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-corp-border space-y-4 shadow-[4px_4px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase" style={{ color: "var(--corp-text)" }}>Key Responsibilities</h2>
            <div className="space-y-3">
              {job.responsibilities.map((resp) => (
                <div key={resp} className="flex items-start gap-3 text-xs sm:text-sm font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                  <div className="w-5 h-5 rounded-md bg-[#10b981] text-emerald-950 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    <Check size={12} />
                  </div>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Requirements */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-corp-border space-y-4 shadow-[4px_4px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase" style={{ color: "var(--corp-text)" }}>Candidate Requirements &amp; Skill Criteria</h2>
            <div className="space-y-3">
              {job.requirements.map((req) => (
                <div key={req} className="flex items-start gap-3 text-xs sm:text-sm font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                  <div className="w-5 h-5 rounded-md bg-[#10b981] text-emerald-950 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    <ShieldCheck size={13} />
                  </div>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">

          {/* Perks & Benefits Box */}
          <div className="rounded-xl p-6 border-2 border-[#10b981] space-y-4 shadow-[4px_4px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h3 className="text-sm font-extrabold font-mono uppercase flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
              <Award size={16} className="text-amber-500" /> Perks &amp; Benefits
            </h3>
            <div className="space-y-2.5">
              {job.perks.map((perk) => (
                <div key={perk} className="flex items-start gap-2.5 text-xs font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                  <Check size={14} className="text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Recruiter Dispatch Info Card */}
          <div className="rounded-xl p-6 border-2 border-[#10b981] space-y-3 bg-slate-900 text-white shadow-[4px_4px_0px_0px_#10b981]">
            <div className="flex items-center gap-2 font-mono">
              <UserCheck size={18} className="text-[#10b981]" />
              <h4 className="text-xs font-extrabold uppercase">Direct Recruiter Dispatch</h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-slate-300">
              Applying automatically attaches your verified <strong>INSYT Career Passport</strong>, verified skill scores, and PDF resume directly to the employer's HR dashboard.
            </p>
          </div>

        </div>

      </div>

      <CareerPassportApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={job}
        state={state}
        onSuccess={handleApplySuccess}
      />

    </div>
  );
}

