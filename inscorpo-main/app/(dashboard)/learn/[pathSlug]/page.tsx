"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookOpen, Clock, Users, Star, Award,
  CheckCircle2, Play, Lock, ChevronRight, TrendingUp,
  Landmark, BarChart3, Presentation, Briefcase, Brain, Languages, FileText,
  GraduationCap, Sparkles, Target, RotateCcw, Loader2, Check, ExternalLink,
  ShieldCheck, HelpCircle, FileCheck, Layers
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";
import { ALL_PATHS } from "@/lib/data/courses";
import { databases } from "@/lib/appwrite";
import { DB_CONFIG } from "@/lib/db";
import { Query } from "appwrite";

interface PageProps {
  params: Promise<{ pathSlug: string }>;
}

const iconMap: Record<string, any> = {
  GraduationCap, Landmark, BarChart3, Presentation, Briefcase,
  Users, Brain, Languages, FileText, Award, Target
};

export default function PathDetailPage(props: PageProps) {
  const { state, enrollInPath, addXP } = useUser();
  const params = use(props.params);
  const pathSlug = params?.pathSlug || "corporate-mto";

  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fallback data from static catalog if Appwrite is syncing
  const localPath = ALL_PATHS[pathSlug] || ALL_PATHS["corporate-mto"];

  const [pathDoc, setPathDoc] = useState<any>(null);
  const [coursesDocs, setCoursesDocs] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadAppwritePathAndCourses() {
      try {
        setLoading(true);
        const pathRes = await databases.listDocuments(
          DB_CONFIG.databaseId,
          DB_CONFIG.collections.paths,
          [Query.equal("slug", pathSlug)]
        );
        if (isMounted && pathRes.documents.length > 0) {
          setPathDoc(pathRes.documents[0]);
        }

        const coursesRes = await databases.listDocuments(
          DB_CONFIG.databaseId,
          DB_CONFIG.collections.courses,
          [Query.equal("pathSlug", pathSlug), Query.limit(50)]
        );
        if (isMounted && coursesRes.documents.length > 0) {
          setCoursesDocs(coursesRes.documents);
        }
      } catch (err) {
        console.warn("[Appwrite] Using local path catalog for:", pathSlug, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAppwritePathAndCourses();
    return () => { isMounted = false; };
  }, [pathSlug]);

  const isEnrolled = state.enrolledPathSlugs.includes(pathSlug);

  const title = pathDoc?.title || localPath.title;
  const description = pathDoc?.description || localPath.description;
  const iconName = pathDoc?.icon || localPath.icon || "Briefcase";
  const Icon = iconMap[iconName] || Briefcase;
  const rating = pathDoc?.rating || localPath.rating || 4.9;
  const studentsCount = pathDoc?.students || localPath.students || 52100;

  // Use localPath courses if Appwrite collection is empty
  const activeCoursesList = coursesDocs.length > 0 ? coursesDocs : localPath.courses;

  const dynamicCourses = activeCoursesList.map((c: any, index: number) => {
    const courseProgressObj = state.courseProgress.find((cp) => cp.id === c.slug);
    const progress = courseProgressObj ? courseProgressObj.progress : 0;
    const completed = progress === 100;
    const locked = !isEnrolled && index > 0;
    return {
      slug: c.slug,
      pathSlug: c.pathSlug || pathSlug,
      title: c.title,
      description: c.description,
      lessons: c.lessons || 8,
      hours: c.hours || 6,
      xp: c.xp || 350,
      skills: c.skills || ["Analytics", "Problem Solving"],
      completed,
      locked,
      progress
    };
  });

  const totalHours = dynamicCourses.reduce((acc, c) => acc + c.hours, 0) || 23;
  const totalLessons = dynamicCourses.reduce((acc, c) => acc + c.lessons, 0) || 28;
  const totalXp = dynamicCourses.reduce((acc, c) => acc + c.xp, 0) || 1450;
  const overallProgress = dynamicCourses.length > 0
    ? Math.round(dynamicCourses.reduce((acc, c) => acc + c.progress, 0) / dynamicCourses.length)
    : 0;

  const handleEnroll = () => {
    if (isEnrolled) return;
    setEnrolling(true);
    enrollInPath(pathSlug, title);
    addXP(100, `Enrolled in ${title}`);
    setTimeout(() => {
      setEnrolling(false);
    }, 600);
  };

  const whatYouWillLearn = [
    "Master structured problem solving, MECE issue trees, and consulting frameworks for executive case studies.",
    "Formulate high-impact STAR framework narratives for high-stakes HR & technical panel interviews.",
    "Ace SHL numerical reasoning, data interpretation, and situational judgment psychometric tests.",
    "Deliver executive-grade boardroom slide presentations and present quantitative recommendations to C-suite mentors."
  ];

  const skillsYouWillGain = [
    "Management Trainee Prep", "STAR Method", "SHL Psychometrics", "MECE Issue Trees",
    "Consulting Case Pitching", "Corporate Finance Basics", "Financial Modeling", "Slide Presentation"
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* ── BREADCRUMB & BACK LINK ── */}
      <div className="pt-4 flex items-center justify-between">
        <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-extrabold font-mono text-corp-text-secondary hover:text-[#10b981] transition-colors">
          <ArrowLeft size={14} /> Back to Flagship Career Tracks
        </Link>
        <span className="text-xs font-mono font-extrabold text-corp-text-tertiary uppercase">
          Track ID: {pathSlug}
        </span>
      </div>

      {/* ── COURSERA-INSPIRED HERO HEADER BANNER ── */}
      <div className="rounded-xl p-6 md:p-10 text-white bg-gradient-to-r from-[#4c0519] via-[#be123c] to-[#0f172a] shadow-[6px_6px_0px_0px_#e11d48] border-2 border-rose-400 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase font-mono tracking-wider bg-[#10b981] text-emerald-950 border border-white shadow-sm">
                <Sparkles size={13} className="inline mr-1" /> Professional Certificate Series
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono font-extrabold bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                <Star size={13} className="fill-amber-950 inline mr-1" /> {rating} ({studentsCount.toLocaleString()} candidates)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white uppercase font-mono">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-2xl font-medium">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono font-extrabold text-rose-200">
              <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-amber-300" /> {dynamicCourses.length} Course Series</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-300" /> ~{totalHours} Hours</span>
              <span className="flex items-center gap-1.5"><Target size={14} className="text-amber-300" /> {totalLessons} Lessons</span>
              <span className="flex items-center gap-1.5"><Award size={14} className="text-amber-300" /> +{totalXp.toLocaleString()} XP Credential</span>
            </div>
          </div>

          {/* Enrollment Card Widget */}
          <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-xl border-2 border-white/30 space-y-5 text-center shadow-[4px_4px_0px_0px_#4c0519]">
            {isEnrolled ? (
              <div className="space-y-4">
                <div className="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-mono text-xs font-extrabold flex items-center justify-center gap-2 uppercase">
                  <CheckCircle2 size={16} /> Candidate Status: Enrolled
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-extrabold text-white">
                    <span>Overall Progress</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                    <div className="h-full bg-[#10b981] transition-all duration-500" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
                <Link
                  href={`/learn/${pathSlug}/${dynamicCourses[0]?.slug || "recruit-assessments"}`}
                  className="w-full py-3.5 px-6 rounded-lg text-xs font-extrabold text-emerald-950 bg-[#10b981] hover:bg-emerald-400 transition-all shadow-[3px_3px_0px_0px_#064e3b] border-2 border-emerald-300 flex items-center justify-center gap-2 uppercase font-mono tracking-wider"
                >
                  <Play size={15} className="fill-current" />
                  <span>Continue Learning Track</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest font-extrabold">Instant Access</span>
                  <p className="text-2xl font-extrabold font-mono text-white">100% Free Trial</p>
                  <p className="text-[11px] text-slate-300 font-medium">Earn +100 XP upon enrolling today</p>
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 px-6 rounded-lg text-xs font-extrabold text-emerald-950 bg-[#10b981] hover:bg-emerald-400 transition-all shadow-[4px_4px_0px_0px_#064e3b] border-2 border-emerald-300 flex items-center justify-center gap-2 uppercase font-mono tracking-wider disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  <span>{enrolling ? "Enrolling Track..." : "Enroll in Professional Track"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID (WHAT YOU'LL LEARN, SKILLS, COURSES) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Syllabus & Learning Outcomes */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* What You'll Learn Box */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-[#10b981]/50 space-y-4 shadow-[5px_5px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-lg font-extrabold flex items-center gap-2 tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
              <CheckCircle2 size={20} className="text-[#10b981]" /> What You'll Learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {whatYouWillLearn.map((itemStr, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs font-bold leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                  <div className="w-5 h-5 rounded-md bg-[#10b981] text-emerald-950 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#10b981]">
                    <Check size={13} />
                  </div>
                  <span>{itemStr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Tools You'll Gain */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-[#10b981]/50 space-y-4 shadow-[5px_5px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-lg font-extrabold flex items-center gap-2 tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
              <Brain size={20} className="text-[#10b981]" /> Skills &amp; Competencies Gained
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skillsYouWillGain.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-extrabold bg-corp-bg-secondary border-2 border-corp-border text-corp-text uppercase font-mono">
                  <Check size={13} className="text-[#10b981]" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 4-COURSE SERIES BREAKDOWN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
                Professional Certificate — {dynamicCourses.length} Course Series
              </h2>
              <span className="text-xs font-mono font-extrabold text-corp-text-tertiary">
                {totalHours} Hours Total Curriculum
              </span>
            </div>

            <div className="space-y-4">
              {dynamicCourses.map((c, index) => (
                <div
                  key={c.slug}
                  className="rounded-xl p-6 border-2 border-[#10b981]/50 transition-all shadow-[4px_4px_0px_0px_#10b981] space-y-4"
                  style={{ background: "var(--corp-surface)" }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-md bg-[#10b981] text-emerald-950 font-mono font-extrabold text-xs flex items-center justify-center stroke-emerald-950 border border-emerald-400">
                          {index + 1}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-amber-500 uppercase">
                          Course {index + 1} • {c.hours} Hours
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold pt-1" style={{ color: "var(--corp-text)" }}>
                        {c.title}
                      </h3>
                      <p className="text-xs text-corp-text-secondary leading-relaxed font-medium">
                        {c.description}
                      </p>
                    </div>

                    {c.locked ? (
                      <div className="px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold bg-corp-bg-secondary text-corp-text-tertiary border-2 border-corp-border flex items-center gap-2 flex-shrink-0">
                        <Lock size={14} /> Enroll to Unlock
                      </div>
                    ) : (
                      <Link
                        href={`/learn/${pathSlug}/${c.slug}`}
                        className="px-5 py-2.5 rounded-lg text-xs font-extrabold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-[3px_3px_0px_0px_#881337] border-2 border-rose-300 flex items-center gap-1.5 uppercase font-mono tracking-wider flex-shrink-0"
                      >
                        <Play size={13} fill="white" />
                        <span>{c.progress > 0 ? "Continue Course" : "Start Course"}</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-3 border-t-2 border-corp-border flex items-center justify-between text-xs font-mono font-bold text-corp-text-tertiary">
                    <span>{c.lessons} Lectures &amp; Case Scenarios</span>
                    <span className="text-[#10b981]">+{c.xp} XP Completion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Learning Project Section */}
          <div className="rounded-xl p-6 sm:p-8 border-2 border-[#10b981]/50 space-y-3 shadow-[5px_5px_0px_0px_#10b981]" style={{ background: "var(--corp-surface)" }}>
            <h2 className="text-lg font-extrabold flex items-center gap-2 tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
              <Layers size={20} className="text-amber-500" /> Applied Learning Capstone Project
            </h2>
            <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
              Throughout this Professional Certificate, you’ll construct real-world portfolio artifacts. For the MTO track, you will build an end-to-end MTO Assessment Center deck, solve McKinsey market entry case studies, and pitch live to C-suite assessors.
            </p>
          </div>

        </div>

        {/* Right Sidebar: Certificate & Details */}
        <div className="space-y-6">
          <div className="rounded-xl p-6 border-2 border-[#10b981]/50 space-y-4 shadow-[5px_5px_0px_0px_#10b981] text-center" style={{ background: "var(--corp-surface)" }}>
            <Award size={40} className="mx-auto text-amber-500" />
            <h3 className="text-base font-extrabold font-mono uppercase" style={{ color: "var(--corp-text)" }}>Shareable Career Credential</h3>
            <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
              Add this official employer-recognized credential to your LinkedIn profile, resume, or CV upon completing all 4 courses.
            </p>
            <div className="p-3 rounded-lg bg-corp-bg-secondary border-2 border-corp-border text-left space-y-1.5 text-xs font-mono">
              <p className="font-extrabold text-[#10b981]">✔ Employer Recognized</p>
              <p className="font-extrabold text-[#10b981]">✔ Cryptographically Verified</p>
              <p className="font-extrabold text-[#10b981]">✔ Shareable on LinkedIn</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

