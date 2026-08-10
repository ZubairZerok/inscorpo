"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, CheckCircle2, ChevronRight,
  TrendingUp, Award, Building, MapPin, DollarSign, Calendar, ArrowUpRight,
  ShieldCheck, Clock, Sparkles, Building2, X, FileText, Tag, Send,
  RotateCcw, AlertCircle, Eye
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

// ─── Kanban columns config ─────────────────────────────────────────────────────
const COLUMNS: { id: JobApplicationDoc["status"]; label: string; color: string; bg: string }[] = [
  { id: "applied",      label: "Applied",           color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
  { id: "reviewing",    label: "Under Review",       color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  { id: "interviewing", label: "Interviewing",       color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
  { id: "offered",      label: "Offered / Pre-Placement", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
];

export default function JobsPage() {
  const { addNotification, addXP } = useUser();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<JobListing[]>(jobsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"board" | "tracker">("board");

  // DB + Local application tracking
  const [dbApplications, setDbApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Notes modal
  const [notesModal, setNotesModal] = useState<{ docId: string; notes: string } | null>(null);

  const departments = Array.from(new Set(jobsData.map((j) => j.department)));
  const locations = Array.from(new Set(jobsData.map((j) => j.location.split("(")[0].trim())));
  const expLevels = Array.from(new Set(jobsData.map((j) => j.experienceLevel)));

  // Load DB & Local Applications
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

      // Check single job app keys from detail pages
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

    // Merge DB + Local docs (DB docs take priority for status/notes)
    const mergedMap = new Map<string, any>();
    localDocs.forEach((d) => mergedMap.set(d.jobId, d));
    dbDocs.forEach((d) => mergedMap.set(d.jobId, d));

    const combined = Array.from(mergedMap.values());
    setDbApplications(combined);

    // Sync applied state to job listings
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

  // Mark job as applied (in state, local storage, and Appwrite DB)
  const handleApply = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetJob = jobs.find((j) => j.id === id);
    if (!targetJob || targetJob.applied) return;

    // 1. Mark job as applied locally in job board
    setJobs(jobs.map((job) => (job.id === id ? { ...job, applied: true } : job)));

    // 2. Construct new application doc
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

    // 3. Update React state immediately
    setDbApplications((prev) => {
      const exists = prev.some((item) => item.jobId === id);
      if (exists) return prev;
      return [newDoc, ...prev];
    });

    // 4. Save to localStorage
    try {
      const existingStr = localStorage.getItem("insyt_job_applications") || "[]";
      const existingApps = JSON.parse(existingStr);
      if (!existingApps.some((a: any) => a.jobId === id)) {
        localStorage.setItem("insyt_job_applications", JSON.stringify([newDoc, ...existingApps]));
      }
    } catch {
      /* ignore */
    }

    // 5. Save to DB asynchronously if logged in
    if (user) {
      await createJobApplication(user.$id, id, targetJob.title, targetJob.company);
    }

    // 6. Award XP & trigger notification
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

    // Update DB
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

  // Group applications by status for Kanban board
  const kanbanCols = COLUMNS.map((col) => ({
    ...col,
    items: dbApplications.filter((app) => app.status === col.id),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 sm:px-6 font-sans">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            <Briefcase size={14} /> MNC &amp; Bank Recruitment Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase" style={{ color: "var(--corp-text)" }}>
            Corporate Job Board
          </h1>
          <p className="text-xs sm:text-sm max-w-xl font-medium leading-relaxed font-sans" style={{ color: "var(--corp-text-secondary)" }}>
            Discover Management Trainee (MTO) circulars, analyst roles, and direct interview drives at leading Bangladeshi corporate enterprises.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex p-1.5 rounded-xl self-start sm:self-auto font-mono border-2 border-blue-400 bg-corp-surface shadow-sm"
        >
          <button
            onClick={() => setActiveTab("board")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${
              activeTab === "board"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            Job Board ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === "tracker"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            Application Tracker
            {dbApplications.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 border border-amber-500">
                {dbApplications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "board" ? (
        <div className="space-y-6">
          {/* Search & Filters — Blue Borders */}
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

          {/* Job Cards — Blue Borders */}
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
                      onClick={() => setActiveTab("tracker")}
                      className="px-5 py-2.5 rounded-lg text-xs font-extrabold bg-emerald-500/15 text-emerald-600 border-2 border-emerald-500 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/25 transition-all"
                    >
                      <CheckCircle2 size={14} /> Applied (View Tracker)
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
      ) : (
        /* ── Enhanced Application Tracker ── */
        <div className="space-y-6 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase text-corp-text">Application Tracker Kanban</h2>
              <p className="text-xs font-sans font-medium mt-0.5 text-corp-text-secondary">
                {dbApplications.length} active application{dbApplications.length !== 1 ? "s" : ""} tracked · Click arrow button to progress candidate stage
              </p>
            </div>
            {loadingApps && (
              <div className="flex items-center gap-2 text-xs text-corp-text-tertiary font-mono">
                <RotateCcw size={13} className="animate-spin" />
                Syncing Applications...
              </div>
            )}
          </div>

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
                            {/* Notes button */}
                            <button
                              onClick={() => setNotesModal({ docId: app.$id || app.jobId, notes: app.notes || "" })}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-corp-text-secondary hover:text-[#2563eb] transition-colors border border-corp-border cursor-pointer"
                              title="Add notes"
                            >
                              <FileText size={12} />
                            </button>
                            {/* Move to next stage */}
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
                          <p className="text-[10px] leading-relaxed rounded-lg p-2 bg-corp-bg-secondary text-corp-text-secondary border border-corp-border font-sans">
                            📝 {app.notes}
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
      )}

      {/* Notes Modal */}
      <AnimatePresence>
        {notesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
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
    </div>
  );
}
