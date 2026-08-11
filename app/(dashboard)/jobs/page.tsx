"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, CheckCircle2, ChevronRight,
  TrendingUp, Award, Building, MapPin, DollarSign, Calendar, ArrowUpRight,
  ShieldCheck, Clock, Sparkles, Building2, X, FileText, Tag, Send,
  RotateCcw, AlertCircle, Eye, GraduationCap, ChevronDown, SlidersHorizontal,
  ArrowUpDown, Wrench, Microscope, Layers, Landmark
} from "lucide-react";
import Link from "next/link";
import { jobsData, JobListing } from "@/lib/data/jobs";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { JobMatchBadge } from "@/components/jobs/job-match-badge";
import {
  createJobApplication, fetchUserJobApplications, updateApplicationStatus,
  type JobApplicationDoc
} from "@/lib/db";
import { GovJobModal } from "@/components/jobs/gov-job-modal";
import { GovJobCard } from "@/components/jobs/gov-job-card";
import { CvFitModal } from "@/components/jobs/cv-fit-modal";
import {
  getAllGovJobs, getGovOrganizations, getGovJobStats,
  getAllInstituteCards, searchByDegree, GovJob, InstituteCard,
  getJobsGroupedByGradeBand, getJobsGroupedByPostFamily, sortGovJobs,
  GovJobSortOption, getUniqueGrades
} from "@/lib/data/gov-jobs-db";
import { InstituteIntelligenceCard, StatsOverviewBar } from "@/components/jobs/institute-intelligence-card";

// ─── Kanban columns config ─────────────────────────────────────────────────────
const COLUMNS: { id: JobApplicationDoc["status"]; label: string; color: string; bg: string }[] = [
  { id: "applied",      label: "Applied",           color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
  { id: "reviewing",    label: "Under Review",       color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  { id: "interviewing", label: "Interviewing",       color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
  { id: "offered",      label: "Offered / Pre-Placement", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
];

const TAB_HEADERS = {
  corporate: {
    badge: "MNC & Bank Recruitment Portal",
    title: "Corporate Job Board",
    subtitle: "Discover Management Trainee (MTO) circulars, analyst roles, and direct interview drives at leading Bangladeshi corporate enterprises.",
  },
  research: {
    badge: "Government Research Intelligence",
    title: "Research Organization Circulars",
    subtitle: "Explore official recruitment notices for BARI, BINA, BJRI, BRRI, BTRI, and BSRI under National Pay Scale 2015. Grade 9–16 roles with degree eligibility intelligence.",
  },
};

export default function JobsPage() {
  const { addNotification, addXP } = useUser();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<JobListing[]>(jobsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"corporate" | "research">("corporate");

  // Government Research State
  const [govStats] = useState(() => getGovJobStats());
  const [instituteCards] = useState<InstituteCard[]>(() => getAllInstituteCards());
  const [expandedInstitute, setExpandedInstitute] = useState<string | null>(null);
  const [selectedGovJob, setSelectedGovJob] = useState<GovJob | null>(null);
  const [selectedCvFitJob, setSelectedCvFitJob] = useState<GovJob | null>(null);
  const [degreeFilter, setDegreeFilter] = useState("");
  const [degreeResults, setDegreeResults] = useState<ReturnType<typeof searchByDegree>>([]);


  // Advanced Govt Filters & Grouping State
  const [govViewMode, setGovViewMode] = useState<"institute" | "grade" | "post_family">("institute");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all");
  const [govSortBy, setGovSortBy] = useState<GovJobSortOption>("grade_asc");

  // Application Tracker State
  const [dbApplications, setDbApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [notesModal, setNotesModal] = useState<{ docId: string; notes: string } | null>(null);
  const [showTracker, setShowTracker] = useState(false);

  const departments = Array.from(new Set(jobsData.map((j) => j.department)));
  const locations = Array.from(new Set(jobsData.map((j) => j.location.split("(")[0].trim())));
  const expLevels = Array.from(new Set(jobsData.map((j) => j.experienceLevel)));

  // Degree Search Handler
  useEffect(() => {
    if (degreeFilter.trim().length >= 2) {
      const results = searchByDegree(degreeFilter);
      setDegreeResults(results);
    } else {
      setDegreeResults([]);
    }
  }, [degreeFilter]);

  // Load Applications
  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    let dbDocs: any[] = [];
    if (user) {
      try {
        dbDocs = await fetchUserJobApplications(user.$id);
      } catch (err) {
        console.error("Error fetching DB applications:", err);
      }
    }

    let localDocs: any[] = [];
    try {
      const raw = localStorage.getItem("insyt_job_applications");
      if (raw) localDocs = JSON.parse(raw);

      jobsData.forEach((j) => {
        const itemStr = localStorage.getItem(`insyt_job_app_${j.id}`);
        if (itemStr) {
          try {
            const parsed = JSON.parse(itemStr);
            if (!localDocs.some((d) => d.jobId === j.id)) {
              localDocs.push({
                $id: `app_local_${j.id}`,
                jobId: j.id,
                userId: user?.$id || "guest",
                jobTitle: j.title,
                company: j.company,
                status: "applied",
                appliedAt: parsed.submittedAt || new Date().toISOString(),
                notes: parsed.coverNote || "",
              });
            }
          } catch {
            /* ignore */
          }
        }
      });
    } catch {
      /* ignore */
    }

    const mergedMap = new Map<string, any>();
    localDocs.forEach((d) => mergedMap.set(d.jobId, d));
    dbDocs.forEach((d) => mergedMap.set(d.jobId, d));

    const combined = Array.from(mergedMap.values());
    setDbApplications(combined);

    const appliedJobIds = new Set(combined.map((c) => c.jobId));
    setJobs((prevJobs) =>
      prevJobs.map((j) => (appliedJobIds.has(j.id) ? { ...j, applied: true } : j))
    );

    setLoadingApps(false);
  }, [user]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept ? j.department === selectedDept : true;
    const matchesLoc = selectedLocation ? j.location.includes(selectedLocation) : true;
    const matchesExp = selectedExp ? j.experienceLevel === selectedExp : true;
    return matchesSearch && matchesDept && matchesLoc && matchesExp;
  });

  // Corporate Job Handlers
  const handleApply = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetJob = jobs.find((j) => j.id === id);
    if (!targetJob || targetJob.applied) return;

    setJobs(jobs.map((job) => (job.id === id ? { ...job, applied: true } : job)));

    const newDoc = {
      $id: `app_${Date.now()}_${id}`,
      jobId: id,
      userId: user?.$id || "guest",
      jobTitle: targetJob.title,
      company: targetJob.company,
      status: "applied",
      appliedAt: new Date().toISOString(),
      notes: "",
    };

    setDbApplications((prev) => {
      const exists = prev.some((item) => item.jobId === id);
      if (exists) return prev;
      return [newDoc, ...prev];
    });

    try {
      const existingStr = localStorage.getItem("insyt_job_applications") || "[]";
      const existingApps = JSON.parse(existingStr);
      if (!existingApps.some((a: any) => a.jobId === id)) {
        localStorage.setItem("insyt_job_applications", JSON.stringify([newDoc, ...existingApps]));
      }
    } catch {
      /* ignore */
    }

    if (user) {
      await createJobApplication(user.$id, id, targetJob.title, targetJob.company);
    }

    addXP(100, `Submitted application for ${targetJob.title}`);

    addNotification({
      type: "achievement",
      title: "Job Application Submitted!",
      message: `Your verified INSYT Passport CV was dispatched to ${targetJob.company}. Check Application Tracker for updates!`,
    });
  };

  const handleMoveStatus = async (docId: string, newStatus: JobApplicationDoc["status"]) => {
    setMovingId(docId);

    setDbApplications((prev) => {
      const updated = prev.map((app) =>
        app.$id === docId || app.jobId === docId ? { ...app, status: newStatus } : app
      );
      try {
        localStorage.setItem("insyt_job_applications", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });

    if (!docId.startsWith("app_local_") && !docId.startsWith("app_")) {
      await updateApplicationStatus(docId, newStatus);
    }

    const col = COLUMNS.find((c) => c.id === newStatus);
    if (newStatus === "interviewing" || newStatus === "offered") {
      addNotification({
        type: "achievement",
        title: newStatus === "offered" ? "Job Offer!" : "Interview Scheduled!",
        message: `Your application status was updated to: ${col?.label}`,
      });
    }

    setMovingId(null);
  };

  const handleSaveNotes = async () => {
    if (!notesModal) return;
    const { docId, notes } = notesModal;

    setDbApplications((prev) => {
      const updated = prev.map((app) =>
        app.$id === docId || app.jobId === docId ? { ...app, notes } : app
      );
      try {
        localStorage.setItem("insyt_job_applications", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });

    if (!docId.startsWith("app_local_") && !docId.startsWith("app_")) {
      const currentStatus = dbApplications.find((a) => a.$id === docId)?.status || "applied";
      await updateApplicationStatus(docId, currentStatus, notes);
    }

    setNotesModal(null);
  };

  const kanbanCols = COLUMNS.map((col) => ({
    ...col,
    items: dbApplications.filter((app) => app.status === col.id),
  }));

  const headerConfig = TAB_HEADERS[activeTab];

  // Grouped datasets
  const gradeBands = getJobsGroupedByGradeBand();
  const postFamilies = getJobsGroupedByPostFamily();

  const displayInstitutes = degreeFilter.trim().length >= 2 && degreeResults.length > 0
    ? degreeResults.map((r) => r.institute)
    : instituteCards;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 sm:px-6 font-sans">

      {/* ═══════════════════════════════════════════════════════════════════════
           PAGE HEADER — Dynamic per tab
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          {/* Vacancy / Badge tag strictly yellow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            {activeTab === "corporate" ? <Building2 size={14} /> : <Microscope size={14} />}
            {headerConfig.badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase" style={{ color: "var(--corp-text)" }}>
            {headerConfig.title}
          </h1>
          <p className="text-xs sm:text-sm max-w-xl font-medium leading-relaxed font-sans" style={{ color: "var(--corp-text-secondary)" }}>
            {headerConfig.subtitle}
          </p>
        </div>

        {/* Tab Switcher — Pure SVG Icons (No Emojis) */}
        <div
          className="flex p-1.5 rounded-xl self-start sm:self-auto font-mono border-2 border-blue-400 shadow-sm"
          style={{ background: "var(--corp-surface)" }}
        >
          <button
            onClick={() => setActiveTab("corporate")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === "corporate"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            <Building2 className="w-4 h-4" /> Corporate ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === "research"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            <Microscope className="w-4 h-4" /> Research ({govStats.totalJobs})
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
           GOVT RESEARCH TAB — Intelligence, Grade & Post-Wise Sorting
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "research" && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <StatsOverviewBar
            totalOrgs={govStats.totalOrganizations}
            totalJobs={govStats.totalJobs}
            totalVacancies={govStats.totalVacancies}
          />

          {/* VIEW MODE SWITCHER BAR */}
          <div
            className="p-4 rounded-2xl border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] space-y-4 font-mono"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b-2" style={{ borderColor: "var(--corp-border)" }}>
              <div>
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <Layers className="w-4 h-4 text-[#2563eb]" />
                  Intelligence Perspective &amp; Sorting Mode
                </span>
                <p className="text-[11px] font-sans font-medium mt-0.5" style={{ color: "var(--corp-text-tertiary)" }}>
                  Switch perspectives to view jobs grouped by Research Institute, Pay Grade Class, or Similar Role Family.
                </p>
              </div>

              {/* View Mode Pills — Pure SVG Icons (No Emojis) */}
              <div className="flex p-1 rounded-xl border-2 border-blue-400 bg-corp-surface shrink-0">
                <button
                  onClick={() => setGovViewMode("institute")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1.5 ${
                    govViewMode === "institute"
                      ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                      : "text-corp-text-secondary hover:text-corp-text"
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" /> By Institute
                </button>
                <button
                  onClick={() => setGovViewMode("grade")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1.5 ${
                    govViewMode === "grade"
                      ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                      : "text-corp-text-secondary hover:text-corp-text"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" /> By Grade Level
                </button>
                <button
                  onClick={() => setGovViewMode("post_family")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1.5 ${
                    govViewMode === "post_family"
                      ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                      : "text-corp-text-secondary hover:text-corp-text"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> By Post Family
                </button>
              </div>
            </div>

            {/* 
              CRITICAL USER DIRECTIVE:
              FILTER & SORT CONTROLS TOOLBAR IS CONDITIONAL ONLY TO "BY GRADE LEVEL" VIEW MODE!
            */}
            {govViewMode === "grade" && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t-2" style={{ borderColor: "var(--corp-border)" }}>
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2563eb]" />
                  <input
                    type="text"
                    placeholder="Search circulars by post title, grade number, or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 focus:border-[#2563eb] transition-all"
                    style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text)" }}
                  />
                </div>

                {/* Grade Filter Select */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#2563eb] shrink-0" />
                  <select
                    value={selectedGradeFilter}
                    onChange={(e) => setSelectedGradeFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 text-corp-text cursor-pointer"
                    style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
                  >
                    <option value="all">All Pay Grades (9–16)</option>
                    <option value="9">Grade 9 (Executive / Class-I)</option>
                    <option value="10">Grade 10 (Officer / Class-I)</option>
                    <option value="11-13">Grade 11–13 (Technical / Mid)</option>
                    <option value="14-16">Grade 14–16 (Support / Staff)</option>
                  </select>
                </div>

                {/* Sort By Select */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-[#2563eb] shrink-0" />
                  <select
                    value={govSortBy}
                    onChange={(e) => setGovSortBy(e.target.value as GovJobSortOption)}
                    className="px-3 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 text-corp-text cursor-pointer"
                    style={{ background: "var(--corp-surface)", color: "var(--corp-text)" }}
                  >
                    <option value="grade_asc">Grade: High → Low Rank (9→16)</option>
                    <option value="grade_desc">Grade: Low → High Rank (16→9)</option>
                    <option value="vacancies_desc">Vacancies: Most First</option>
                    <option value="salary_desc">Salary: Highest Scale First</option>
                    <option value="title_asc">Title: Alphabetical A–Z</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Degree Eligibility Engine Banner — SKY BLUE TAG PALETTE */}
          <div
            className="p-4 rounded-2xl border-2 border-sky-400 shadow-[4px_4px_0px_0px_#0284c7] space-y-3 font-mono"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-sky-500" />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--corp-text)" }}>
                Degree Eligibility Engine
              </span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500" />
              <input
                type="text"
                placeholder="Type your degree to find matching institutes & roles (e.g. Agriculture, Library, CSE, Statistics, Civil)..."
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-sky-400 focus:border-sky-500 transition-all"
                style={{ background: "var(--corp-bg-secondary)", color: "var(--corp-text)" }}
              />
            </div>

            {degreeFilter.trim().length >= 2 && (
              <div className="text-[11px] font-sans font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                {degreeResults.length > 0 ? (
                  <span>
                    Found <strong className="text-[#2563eb]">{degreeResults.length} institute{degreeResults.length !== 1 ? "s" : ""}</strong> matching &ldquo;{degreeFilter}&rdquo;
                    {degreeResults.some((r) => r.matchType === "direct") && (
                      <span> — <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-400 text-sky-950 border border-sky-500 mx-0.5">DIRECT MATCH</span> roles found in requirements</span>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertCircle size={12} className="text-sky-500" />
                    No matching institutes found for &ldquo;{degreeFilter}&rdquo;. Try broader terms like &ldquo;Agriculture&rdquo; or &ldquo;Engineering&rdquo;.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
               PERSPECTIVE 1: BY INSTITUTE CARDS
             ═══════════════════════════════════════════════════════════════════ */}
          {govViewMode === "institute" && (
            <div className="space-y-4">
              {displayInstitutes.map((inst) => (
                <InstituteIntelligenceCard
                  key={inst.acronym}
                  institute={inst}
                  isExpanded={expandedInstitute === inst.acronym}
                  onToggle={() => setExpandedInstitute(expandedInstitute === inst.acronym ? null : inst.acronym)}
                  onSelectJob={(j) => setSelectedGovJob(j)}
                  onRunCvFit={(j) => setSelectedCvFitJob(j)}
                />
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
               PERSPECTIVE 2: BY GRADE LEVEL (Grade 9-10, Grade 11-13, Grade 14-16)
             ═══════════════════════════════════════════════════════════════════ */}
          {govViewMode === "grade" && (
            <div className="space-y-6 font-mono">
              {gradeBands.map((band) => {
                const bandSortedJobs = sortGovJobs(
                  band.jobs.filter((j) => {
                    const matchesGrade =
                      selectedGradeFilter === "all"
                        ? true
                        : selectedGradeFilter === "9"
                        ? j.grade === 9
                        : selectedGradeFilter === "10"
                        ? j.grade === 10
                        : selectedGradeFilter === "11-13"
                        ? j.grade >= 11 && j.grade <= 13
                        : selectedGradeFilter === "14-16"
                        ? j.grade >= 14 && j.grade <= 16
                        : true;

                    const matchesSearch = searchQuery
                      ? j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.organizationAcronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.family.toLowerCase().includes(searchQuery.toLowerCase())
                      : true;

                    return matchesGrade && matchesSearch;
                  }),
                  govSortBy
                );

                if (bandSortedJobs.length === 0) return null;

                return (
                  <div
                    key={band.id}
                    className="p-5 rounded-2xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] space-y-4"
                    style={{ background: "var(--corp-surface)" }}
                  >
                    {/* Band Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2" style={{ borderColor: "var(--corp-border)" }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${band.badgeColor}`}>
                            {band.gradeRange}
                          </span>
                          <span className="text-xs font-black text-[#2563eb]">
                            {band.payScaleRange}
                          </span>
                        </div>
                        <h3 className="text-base font-black uppercase text-corp-text">
                          {band.label} ({bandSortedJobs.length} Posts)
                        </h3>
                        <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
                          {band.description}
                        </p>
                      </div>

                      {/* Vacancy Tag is strictly yellow */}
                      <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 self-start sm:self-auto">
                        {band.totalVacancies} Total Vacancies
                      </span>
                    </div>

                    {/* Jobs Grid for this Grade Band */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bandSortedJobs.map((job) => (
                        <GovJobCard
                          key={job.id}
                          job={job}
                          onSelect={(j) => setSelectedGovJob(j)}
                          onRunCvFit={(j) => setSelectedCvFitJob(j)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
               PERSPECTIVE 3: BY POST FAMILY / SIMILAR ROLES
             ═══════════════════════════════════════════════════════════════════ */}
          {govViewMode === "post_family" && (
            <div className="space-y-6 font-mono">
              {postFamilies.map((famGroup) => {
                const famSortedJobs = sortGovJobs(
                  famGroup.jobs.filter((j) =>
                    searchQuery
                      ? j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.organizationAcronym.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  ),
                  govSortBy
                );

                if (famSortedJobs.length === 0) return null;

                return (
                  <div
                    key={famGroup.familyKey}
                    className="p-5 rounded-2xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] space-y-4"
                    style={{ background: "var(--corp-surface)" }}
                  >
                    {/* Family Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2" style={{ borderColor: "var(--corp-border)" }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-[#2563eb] text-white border border-blue-400">
                            {famGroup.familyKey}
                          </span>
                          <span className="text-[10px] font-bold text-corp-text-tertiary">
                            Institutes: {famGroup.participatingInstitutes.join(", ")}
                          </span>
                        </div>
                        <h3 className="text-base font-black uppercase text-corp-text">
                          {famGroup.title} Circulars ({famSortedJobs.length} Roles)
                        </h3>
                        <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
                          {famGroup.description}
                        </p>
                      </div>

                      {/* Vacancy Tag is strictly yellow */}
                      <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 self-start sm:self-auto">
                        {famGroup.totalVacancies} Vacancies Across Institutes
                      </span>
                    </div>

                    {/* Jobs Grid for this Post Family */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {famSortedJobs.map((job) => (
                        <GovJobCard
                          key={job.id}
                          job={job}
                          onSelect={(j) => setSelectedGovJob(j)}
                          onRunCvFit={(j) => setSelectedCvFitJob(j)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
           CORPORATE JOBS TAB
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "corporate" && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div
            className="p-4 rounded-2xl border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] space-y-3 font-mono"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2563eb]" />
                <input
                  type="text"
                  placeholder="Search jobs by title (MTO, Analyst, Dev), company, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 focus:border-[#2563eb] transition-all bg-corp-surface text-corp-text shadow-sm"
                />
              </div>

              <select
                value={selectedDept || ""}
                onChange={(e) => setSelectedDept(e.target.value || null)}
                className="px-3 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none bg-corp-surface border-2 border-blue-400 text-corp-text cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={selectedLocation || ""}
                onChange={(e) => setSelectedLocation(e.target.value || null)}
                className="px-3 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none bg-corp-surface border-2 border-blue-400 text-corp-text cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={selectedExp || ""}
                onChange={(e) => setSelectedExp(e.target.value || null)}
                className="px-3 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none bg-corp-surface border-2 border-blue-400 text-corp-text cursor-pointer"
              >
                <option value="">All Experience Levels</option>
                {expLevels.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4 font-mono">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl p-5 border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] transition-all hover:-translate-y-0.5 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
                style={{
                  background: "var(--corp-surface)",
                }}
              >
                {/* Info Block */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-[#2563eb] text-white flex items-center justify-center text-2xl font-black flex-shrink-0 border-2 border-blue-400 shadow-sm">
                    {job.logo}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded text-white bg-[#2563eb] border border-blue-400"
                      >
                        {job.department}
                      </span>
                      <JobMatchBadge
                        jobTitle={job.title}
                        department={job.department}
                        requirements={job.requirements}
                      />
                      <span className="text-[10px] font-mono text-corp-text-tertiary">
                        Posted {job.postedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold uppercase group-hover:text-[#2563eb] transition-colors truncate" style={{ color: "var(--corp-text)" }}>
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>

                    <p className="text-xs font-bold text-[#2563eb]">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1 font-bold text-corp-text-tertiary">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#2563eb]" /> {job.location}</span>
                      <span className="flex items-center gap-1.5 font-mono font-extrabold text-[#2563eb]"><DollarSign size={13} /> {job.salary}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {job.type}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0 pt-4 md:pt-0 border-t-2 md:border-t-0 border-blue-400/40">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold border-2 border-blue-400 hover:bg-corp-bg-secondary transition-colors text-corp-text flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowUpRight size={14} />
                  </Link>

                  {job.applied ? (
                    <button
                      onClick={() => setShowTracker(true)}
                      className="px-5 py-2.5 rounded-lg text-xs font-extrabold bg-emerald-500/15 text-emerald-600 border-2 border-emerald-500 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/25 transition-all"
                    >
                      <CheckCircle2 size={14} /> Applied
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleApply(job.id, e)}
                      className="px-6 py-2.5 rounded-lg text-xs font-mono font-extrabold text-amber-950 bg-amber-400 hover:bg-amber-300 border-2 border-slate-950 uppercase shadow-[3px_3px_0px_0px_#000] cursor-pointer active:scale-95 transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
           APPLICATION TRACKER — Collapsible inline section
         ═══════════════════════════════════════════════════════════════════════ */}
      {dbApplications.length > 0 && (
        <div className="font-mono">
          <button
            onClick={() => setShowTracker(!showTracker)}
            className="w-full p-4 rounded-2xl border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: "var(--corp-surface)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2563eb] text-[#FFFFFF] flex items-center justify-center border border-blue-400">
                <FileText size={18} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black uppercase" style={{ color: "var(--corp-text)" }}>
                  Application Tracker
                </h3>
                <p className="text-[11px] font-sans font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                  {dbApplications.length} active application{dbApplications.length !== 1 ? "s" : ""} tracked
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Vacancies / Count badge strictly yellow */}
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                {dbApplications.length}
              </span>
              {showTracker ? (
                <ChevronDown size={18} className="text-[#2563eb]" />
              ) : (
                <ChevronRight size={18} className="text-[#2563eb]" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showTracker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {/* Kanban columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kanbanCols.map((col) => (
                      <div
                        key={col.id}
                        className="rounded-2xl p-4 space-y-3 border-2 border-blue-500 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb]"
                      >
                        {/* Column header */}
                        <div className="flex items-center justify-between pb-2 border-b-2 border-blue-400/40">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                            <span className="text-xs font-black uppercase text-corp-text">{col.label}</span>
                          </div>
                          <span
                            className="text-xs font-mono font-black px-2 py-0.5 rounded text-white"
                            style={{ background: col.color }}
                          >
                            {col.items.length}
                          </span>
                        </div>

                        {/* Application cards */}
                        <div className="space-y-2.5 min-h-[100px]">
                          {col.items.length === 0 ? (
                            <p className="text-xs font-sans text-center italic py-8 text-corp-text-tertiary">No applications in this stage</p>
                          ) : (
                            col.items.map((app) => (
                              <div
                                key={app.$id || app.jobId}
                                className="p-3.5 rounded-xl text-xs space-y-2 border-2 border-blue-400 bg-corp-surface shadow-sm transition-all hover:border-[#2563eb]"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-black uppercase text-corp-text truncate">{app.jobTitle}</p>
                                    <p className="text-[11px] font-extrabold text-[#2563eb] truncate">{app.company}</p>
                                  </div>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex-shrink-0">
                                    Verified
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-1 pt-1 border-t border-corp-border">
                                  <span className="text-[10px] font-mono text-corp-text-tertiary">
                                    Applied: {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setNotesModal({ docId: app.$id || app.jobId, notes: app.notes || "" })}
                                      className="p-1.5 rounded-lg hover:bg-blue-50 text-corp-text-secondary hover:text-[#2563eb] transition-colors border border-corp-border cursor-pointer"
                                      title="Add notes"
                                    >
                                      <FileText size={12} />
                                    </button>
                                    {col.id !== "offered" && (
                                      <button
                                        disabled={movingId === (app.$id || app.jobId)}
                                        onClick={() => {
                                          const idx = COLUMNS.findIndex(c => c.id === col.id);
                                          if (idx < COLUMNS.length - 1) {
                                            handleMoveStatus(app.$id || app.jobId, COLUMNS[idx + 1].id);
                                          }
                                        }}
                                        className="px-2 py-1 rounded-lg bg-[#2563eb] text-white hover:bg-blue-600 transition-colors font-mono font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer border border-blue-300 shadow-sm"
                                        title="Move to next stage"
                                      >
                                        <span>Next</span>
                                        <ChevronRight size={11} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {app.notes && (
                                  <p className="text-[10px] leading-relaxed rounded-lg p-2 bg-corp-bg-secondary text-corp-text-secondary border border-corp-border font-sans flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-[#2563eb] shrink-0" />
                                    <span>{app.notes}</span>
                                  </p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
           NOTES MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {notesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setNotesModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-sm w-full rounded-2xl p-6 space-y-4 shadow-2xl border-4 border-blue-500 font-mono"
              style={{ background: "var(--corp-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-corp-text flex items-center gap-2">
                  <FileText size={15} className="text-[#2563eb]" /> Application Notes
                </h3>
                <button onClick={() => setNotesModal(null)} className="p-1 rounded-lg hover:bg-corp-bg-secondary cursor-pointer">
                  <X size={15} className="text-corp-text-secondary" />
                </button>
              </div>
              <textarea
                value={notesModal.notes}
                onChange={(e) => setNotesModal({ ...notesModal, notes: e.target.value })}
                rows={4}
                placeholder="Add notes about this application — recruiter contact, interview date, next steps..."
                className="w-full rounded-xl p-3 text-xs font-mono resize-none outline-none border-2 border-blue-400 focus:border-[#2563eb] bg-corp-surface text-corp-text"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setNotesModal(null)} className="px-4 py-2 rounded-lg text-xs font-black uppercase bg-corp-bg-secondary text-corp-text border border-corp-border cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveNotes} className="px-4 py-2 rounded-lg text-xs font-black uppercase text-white bg-[#2563eb] border border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a] cursor-pointer">
                  Save Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gov Research Job Detail Modal */}
      <GovJobModal
        job={selectedGovJob}
        onClose={() => setSelectedGovJob(null)}
      />

      {/* AI CV Fit Check Engine Modal (-10 XP) */}
      <CvFitModal
        job={selectedCvFitJob}
        onClose={() => setSelectedCvFitJob(null)}
      />
    </div>
  );
}

