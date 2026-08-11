"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Calendar,
  CheckCircle2, Clock, ShieldCheck, Share2, UserCheck, Sparkles,
  ChevronRight, Award, Check, FileText, Download, Coins
} from "lucide-react";
import Link from "next/link";
import { jobsData, JobListing } from "@/lib/data/jobs";
import { getGovJobById } from "@/lib/data/gov-jobs-db";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { createJobApplication } from "@/lib/db";
import { CareerPassportApplyModal } from "@/components/jobs/career-passport-apply-modal";
import { CvFitModal } from "@/components/jobs/cv-fit-modal";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { JobMatchBadge } from "@/components/jobs/job-match-badge";
import { JobPostingSchema } from "@/components/seo/structured-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage(props: PageProps) {
  const { state, addNotification, addXP } = useUser();
  const { user } = useAuth();
  const [applied, setApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [cvFitModalOpen, setCvFitModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  const params = use(props.params);
  const rawId = params?.id || "brac-bank-mtp";

  // 1. Check corporate jobs
  let job: JobListing | undefined = jobsData.find((j) => j.id === rawId || (j as any).slug === rawId);

  // 2. Check government research jobs if not corporate
  if (!job) {
    const govJob = getGovJobById(rawId);
    if (govJob) {
      job = {
        id: govJob.id,
        title: govJob.title,
        company: `${govJob.organizationName} (${govJob.organizationAcronym})`,
        location: `${govJob.organizationAcronym} HQ / Research Labs`,
        type: `Grade ${govJob.grade} (Govt NPS 2015)`,
        experienceLevel: `Grade ${govJob.grade} Officer`,
        department: govJob.family,
        salary: `৳${govJob.salary_scale_bdt}`,
        postedDate: "Active Circular",
        deadline: govJob.applicationDeadline,
        logo: govJob.organizationAcronym.charAt(0),
        description: `Official recruitment circular for ${govJob.title} at ${govJob.organizationName} (${govJob.organizationAcronym}) under National Pay Scale 2015. Position Grade: Grade ${govJob.grade}. Total Vacancies: ${govJob.vacancy} post(s).`,
        requirements: [
          govJob.requirements,
          ...(govJob.before_skills?.map(s => `Screening Competency: ${s.replace(/_/g, " ")}`) || [])
        ],
        responsibilities: [
          `Execute scientific research and administrative duties mandated for Grade ${govJob.grade} ${govJob.title}.`,
          `Collaborate with research teams across ${govJob.organizationAcronym} laboratories and field stations.`,
          `Maintain technical logs, research documentation, and regulatory compliance under ${govJob.ministry}.`,
        ],
        perks: [
          `National Pay Scale 2015 Grade ${govJob.grade} Salary Scale`,
          `Government Housing / Rent Allowance & Medical Benefits`,
          `Pension & Gratuity Protection`,
          `Institutional Training & Seniority Promotion Track`,
        ],
        stages: [
          { step: 1, title: "Circular Published", desc: "Official notice published under NPS 2015" },
          { step: 2, title: "Online Application", desc: `Application deadline: ${govJob.applicationDeadline}` },
          { step: 3, title: "Written Screening Exam", desc: "Syllabus based on candidate degree & competencies" },
          { step: 4, title: "Viva Voce & Merit List", desc: "Final verification and appointment recommendation" },
        ],
        applied: false,
      };
    }
  }

  // Fallback if ID is unknown
  if (!job) {
    job = jobsData[0];
  }

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
    <div className="max-w-5xl mx-auto space-y-6 pb-16 px-4 sm:px-6 font-sans">
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
          className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-[#2563eb] hover:text-blue-700 transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Back to All Jobs
        </Link>
      </div>

      {/* Hero Header Card — Boxy styling with light blue border */}
      <div
        className="rounded-sm p-6 sm:p-8 border-2 border-blue-400 shadow-[4px_4px_0px_0px_#2563eb] space-y-6 relative overflow-hidden"
        style={{ background: "var(--corp-surface)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo company={job.company} size={64} />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="px-3 py-1 rounded-sm text-xs font-extrabold uppercase bg-blue-500/10 text-[#2563eb] border border-blue-400">
                  {job.department}
                </span>
                <span className="px-3 py-1 rounded-sm text-xs font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {job.experienceLevel}
                </span>
                <JobMatchBadge jobId={job.id} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-corp-text">
                {job.title}
              </h1>

              <p className="text-sm font-mono font-black text-[#2563eb]">
                {job.company}
              </p>
            </div>
          </div>

          {/* Action CTAs: CV Fit Check Button inside each job page + Career Passport Apply */}
          <div className="w-full sm:w-auto flex-shrink-0 font-mono flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setCvFitModalOpen(true)}
              className="px-5 py-3.5 rounded-sm text-xs font-black uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
              title="Run AI CV Fit Check"
            >
              <Sparkles size={16} className="text-amber-950 fill-amber-950" />
              <span>AI CV Fit Check (-10 XP)</span>
            </button>

            {applied ? (
              <div className="space-y-2">
                <div className="px-6 py-3.5 rounded-sm text-xs font-extrabold bg-blue-500/10 text-[#2563eb] border-2 border-blue-400 flex items-center justify-center gap-2 shadow-sm uppercase">
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
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-sm text-xs font-black text-white bg-[#2563eb] hover:bg-blue-600 transition-all shadow-[3px_3px_0px_0px_#1e3a8a] border-2 border-blue-300 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span>Apply with Career Passport</span>
                <Sparkles size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Spec Pills — Light Blue Borders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-blue-400/30 text-xs font-mono">
          <div className="p-3 rounded-sm bg-corp-bg-secondary space-y-0.5 border-2 border-blue-400/40">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Location</span>
            <p className="font-extrabold text-corp-text flex items-center gap-1"><MapPin size={12} className="text-[#2563eb]" /> {job.location}</p>
          </div>
          <div className="p-3 rounded-sm bg-corp-bg-secondary space-y-0.5 border-2 border-blue-400/40">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Monthly Compensation</span>
            <p className="font-extrabold text-[#2563eb] flex items-center gap-1"><DollarSign size={12} /> <span className="font-bangla">{job.salary}</span></p>
          </div>
          <div className="p-3 rounded-sm bg-corp-bg-secondary space-y-0.5 border-2 border-blue-400/40">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Employment Type</span>
            <p className="font-extrabold text-corp-text flex items-center gap-1"><Briefcase size={12} /> {job.type}</p>
          </div>
          <div className="p-3 rounded-sm bg-corp-bg-secondary space-y-0.5 border-2 border-blue-400/40">
            <span className="text-[10px] text-corp-text-tertiary font-extrabold uppercase">Application Deadline</span>
            <p className="font-extrabold text-amber-500 flex items-center gap-1"><Calendar size={12} /> {job.deadline}</p>
          </div>
        </div>
      </div>

      {/* Main Specification Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview */}
          <div className="rounded-sm p-6 sm:p-8 border-2 border-blue-400 space-y-4 shadow-[3px_3px_0px_0px_#2563eb]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase text-corp-text">Role Description</h2>
            <p className="text-xs sm:text-sm leading-relaxed font-medium text-corp-text-secondary">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="rounded-sm p-6 sm:p-8 border-2 border-blue-400 space-y-4 shadow-[3px_3px_0px_0px_#2563eb]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase text-corp-text">Key Responsibilities</h2>
            <div className="space-y-3">
              {job.responsibilities.map((resp) => (
                <div key={resp} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-corp-text-secondary">
                  <div className="w-5 h-5 rounded-sm bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    <Check size={12} />
                  </div>
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Requirements */}
          <div className="rounded-sm p-6 sm:p-8 border-2 border-blue-400 space-y-4 shadow-[3px_3px_0px_0px_#2563eb]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-base font-extrabold font-mono uppercase text-corp-text">Candidate Requirements &amp; Skill Criteria</h2>
            <div className="space-y-3">
              {job.requirements.map((req) => (
                <div key={req} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-corp-text-secondary">
                  <div className="w-5 h-5 rounded-sm bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
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
          <div className="rounded-sm p-6 border-2 border-blue-400 space-y-4 shadow-[3px_3px_0px_0px_#2563eb]" style={{ background: "var(--corp-surface)" }}>
            <h3 className="text-sm font-extrabold font-mono uppercase flex items-center gap-2 text-corp-text">
              <Award size={16} className="text-amber-500" /> Perks &amp; Benefits
            </h3>
            <div className="space-y-2.5">
              {job.perks.map((perk) => (
                <div key={perk} className="flex items-start gap-2.5 text-xs font-medium text-corp-text-secondary">
                  <Check size={14} className="text-[#2563eb] flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Recruiter Dispatch Info Card */}
          <div className="rounded-sm p-6 border-2 border-blue-400 space-y-3 bg-blue-500/10 text-corp-text shadow-[3px_3px_0px_0px_#2563eb]">
            <div className="flex items-center gap-2 font-mono">
              <UserCheck size={18} className="text-[#2563eb]" />
              <h4 className="text-xs font-extrabold uppercase">Direct Recruiter Dispatch</h4>
            </div>
            <p className="text-xs leading-relaxed font-medium text-corp-text-secondary">
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

      <CvFitModal
        isOpen={cvFitModalOpen}
        job={job}
        onClose={() => setCvFitModalOpen(false)}
      />

    </div>
  );
}
