"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Search, Filter, ArrowRight, Clock,
  Users, Star, Play, Sparkles, Trophy, Brain,
  ChevronDown, CheckCircle2, SlidersHorizontal, Zap,
  Check, UserCheck, Flame, Layers, ShieldCheck, Tag, Award
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";
import { ALL_PATHS, getCourseBySlug, CourseItem } from "@/lib/data/courses";
import { LAUNCH_CONFIG } from "@/lib/config/launch-config";
import { cn } from "@/lib/utils";

// Helper function to resolve customized cover image for EVERY individual course
function getCourseCoverImage(slug: string, pathSlug: string): string {
  // Customized individual course cover wallpapers
  if (slug === "excel-fundamentals") return "/images/courses/excel-fundamentals.svg";
  if (slug === "excel-formulas-cleaning") return "/images/courses/excel-formulas-cleaning.svg";
  if (slug === "excel-viz-pivots") return "/images/courses/excel-viz-pivots.svg";
  if (slug === "excel-analytics-modeling") return "/images/courses/excel-analytics-modeling.svg";
  if (slug === "excel-decisions") return "/images/courses/excel-decisions.svg";
  if (slug === "excel-projects") return "/images/courses/excel-projects.svg";

  if (slug === "recruit-assessments") return "/images/courses/recruit-assessments.svg";
  if (slug === "recruit-behavioral") return "/images/courses/recruit-behavioral.svg";
  if (slug === "recruit-technical") return "/images/courses/recruit-technical.svg";
  if (slug === "recruit-case") return "/images/courses/recruit-case.svg";

  // Path Fallbacks
  if (pathSlug === "excel-corporate" || slug.includes("excel")) return "/images/course_excel.svg";
  if (pathSlug === "power-bi" || slug.includes("power-bi")) return "/images/course_powerbi.svg";
  if (pathSlug === "corporate-finance" || slug.includes("fin")) return "/images/course_finance.svg";
  if (pathSlug === "ai-automation" || slug.includes("ai")) return "/images/course_ai.svg";
  return "/images/course_career.svg";
}

// Distinctive brand color themes per course track/category
function getCourseTheme(slug: string, pathSlug: string) {
  if (pathSlug === "excel-corporate" || slug.includes("excel")) {
    return {
      gradient: "from-[#064e3b] via-[#047857] to-[#10b981]",
      badgeBg: "bg-[#10b981] text-emerald-950",
      badgeText: "text-emerald-950",
      accentText: "text-[#10b981]",
      border: "border-[#10b981]",
      cardShadow: "shadow-[5px_5px_0px_0px_#10b981] hover:shadow-[7px_7px_0px_0px_#064e3b]",
      btnStyle: "bg-[#10b981] hover:bg-emerald-600 text-emerald-950 shadow-[3px_3px_0px_0px_#064e3b] border-2 border-emerald-300",
    };
  }
  if (pathSlug === "corporate-mto" || slug.includes("recruit") || slug.includes("mto")) {
    return {
      gradient: "from-[#9f1239] via-[#be123c] to-[#e11d48]",
      badgeBg: "bg-[#e11d48] text-white",
      badgeText: "text-white",
      accentText: "text-[#e11d48]",
      border: "border-[#e11d48]",
      cardShadow: "shadow-[5px_5px_0px_0px_#e11d48] hover:shadow-[7px_7px_0px_0px_#881337]",
      btnStyle: "bg-[#e11d48] hover:bg-rose-600 text-white shadow-[3px_3px_0px_0px_#881337] border-2 border-rose-300",
    };
  }
  if (pathSlug === "power-bi" || slug.includes("power-bi")) {
    return {
      gradient: "from-[#78350f] via-[#d97706] to-[#f59e0b]",
      badgeBg: "bg-[#f59e0b] text-amber-950",
      badgeText: "text-amber-950",
      accentText: "text-[#f59e0b]",
      border: "border-[#f59e0b]",
      cardShadow: "shadow-[5px_5px_0px_0px_#f59e0b] hover:shadow-[7px_7px_0px_0px_#78350f]",
      btnStyle: "bg-[#f59e0b] hover:bg-amber-400 text-amber-950 shadow-[3px_3px_0px_0px_#78350f] border-2 border-amber-300",
    };
  }
  if (pathSlug === "corporate-finance" || slug.includes("fin")) {
    return {
      gradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]",
      badgeBg: "bg-[#2563eb] text-white",
      badgeText: "text-white",
      accentText: "text-[#2563eb]",
      border: "border-[#2563eb]",
      cardShadow: "shadow-[5px_5px_0px_0px_#2563eb] hover:shadow-[7px_7px_0px_0px_#1e3a8a]",
      btnStyle: "bg-[#2563eb] hover:bg-blue-600 text-white shadow-[3px_3px_0px_0px_#1e3a8a] border-2 border-blue-300",
    };
  }
  if (pathSlug === "ai-automation" || slug.includes("ai")) {
    return {
      gradient: "from-[#164e63] via-[#0891b2] to-[#06b6d4]",
      badgeBg: "bg-[#06b6d4] text-cyan-950",
      badgeText: "text-cyan-950",
      accentText: "text-[#06b6d4]",
      border: "border-[#06b6d4]",
      cardShadow: "shadow-[5px_5px_0px_0px_#06b6d4] hover:shadow-[7px_7px_0px_0px_#164e63]",
      btnStyle: "bg-[#06b6d4] hover:bg-cyan-400 text-cyan-950 shadow-[3px_3px_0px_0px_#164e63] border-2 border-cyan-300",
    };
  }
  return {
    gradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]",
    badgeBg: "bg-[#2563eb] text-white",
    badgeText: "text-white",
    accentText: "text-[#2563eb]",
    border: "border-[#2563eb]",
    cardShadow: "shadow-[5px_5px_0px_0px_#2563eb] hover:shadow-[7px_7px_0px_0px_#1e3a8a]",
    btnStyle: "bg-[#2563eb] hover:bg-blue-600 text-white shadow-[3px_3px_0px_0px_#1e3a8a] border border-blue-300",
  };
}

// Flatten all courses across all paths into a DataCamp-style master collection
const datacampStyleCourses = Object.values(ALL_PATHS).flatMap((path) =>
  path.courses.map((course) => ({
    ...course,
    pathTitle: path.title,
    category: path.category,
    isFlagship: (LAUNCH_CONFIG.flagshipPathSlugs as readonly string[]).includes(course.pathSlug),
    coverImage: getCourseCoverImage(course.slug, course.pathSlug),
    theme: getCourseTheme(course.slug, course.pathSlug),
    instructor: {
      name: course.slug.includes("excel") || course.slug.includes("power-bi") ? "Zubair Ahmed" :
            course.slug.includes("recruit") ? "Anika Rahman" :
            course.slug.includes("fin") ? "Farhan Kabir" : "INSYT Corporate Faculty",
      role: course.slug.includes("excel") ? "Senior Corporate Analyst" :
            course.slug.includes("recruit") ? "Ex-Unilever MTO & HR Lead" :
            course.slug.includes("fin") ? "Investment Banking Lead" : "Lead Curriculum Faculty",
      avatar: course.slug.includes("excel") ? "👨‍💼" : course.slug.includes("recruit") ? "👩‍💼" : "📊"
    },
    skillLevel: course.xp >= 450 ? "Advanced" : course.xp >= 350 ? "Intermediate" : "Basic",
    hasAiTutor: true,
  }))
);

const topicPills = [
  "Flagship Paths", "All Tracks", "MTO Masterclass", "Excel & Analytics",
  "Power BI", "Financial Modeling", "Corporate Finance", "AI Prompting"
];

export default function DataCampCoursesPage() {
  const { state } = useUser();
  const [selectedTopic, setSelectedTopic] = useState("Flagship Paths");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiTutorOnly, setAiTutorOnly] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [showAllTracks, setShowAllTracks] = useState(!LAUNCH_CONFIG.hideSecondaryPathsFromSpotlight);

  const filteredCourses = datacampStyleCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic =
      selectedTopic === "Flagship Paths" ? course.isFlagship || showAllTracks :
      selectedTopic === "All Tracks" ? true :
      selectedTopic === "Excel & Analytics" ? course.pathSlug === "excel-corporate" :
      selectedTopic === "Power BI" ? course.pathSlug === "power-bi" :
      selectedTopic === "MTO Masterclass" ? course.pathSlug === "corporate-mto" :
      selectedTopic === "Corporate Finance" || selectedTopic === "Financial Modeling" ? course.pathSlug === "corporate-finance" || course.slug.includes("analytics-modeling") :
      selectedTopic === "AI Prompting" ? course.pathSlug === "ai-automation" : true;

    const matchesLevel = selectedLevel ? course.skillLevel === selectedLevel : true;
    const matchesAi = aiTutorOnly ? course.hasAiTutor : true;

    return matchesSearch && matchesTopic && matchesLevel && matchesAi;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">

      {/* ── PROMO BANNER ── */}
      <div className="rounded-xl p-6 border-2 border-blue-400 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
        style={{ background: "#2563eb", boxShadow: "5px 5px 0px 0px #1e3a8a" }}>
        <div className="flex items-center gap-5 z-10">
          <div className="w-14 h-14 rounded-xl bg-white/20 text-white flex items-center justify-center font-extrabold text-2xl border-2 border-white flex-shrink-0">
            <Zap size={24} className="fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 tracking-wider">
                CAREER PASS | 50% OFF
              </span>
              <span className="text-xs font-bold text-blue-200">Limited Career Access Pass</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-mono">
              Unlock All 48+ Master Courses & AI Doubt Tutors
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end z-10">
          <Link
            href="/subscription"
            className="px-6 py-3 rounded-lg text-xs font-extrabold bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all border-2 border-amber-500 flex-shrink-0 uppercase font-mono tracking-wider"
            style={{ boxShadow: "3px 3px 0px 0px #78350f" }}
          >
            Upgrade Pro
          </Link>
        </div>
      </div>

      {/* ── HEADER BANNER ── */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight font-mono uppercase" style={{ color: "var(--corp-text)" }}>
          Interactive Course Library
        </h1>
        <p className="text-xs sm:text-sm max-w-2xl leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
          Hands-on learning combining concise video walkthroughs, interactive Excel formula sandboxes, and AI doubt clearing.
        </p>
      </div>

      {/* ── TOPIC PILLS BAR ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-corp-text-tertiary font-mono">Filter by Topic:</span>
          <span className="text-xs font-mono font-bold text-[#2563eb]">{datacampStyleCourses.length} Master Courses Available</span>
        </div>

        <div className="flex flex-wrap gap-2 pb-2 border-b-2" style={{ borderColor: "var(--corp-border)" }}>
          {topicPills.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-extrabold transition-all border-2",
                selectedTopic === topic
                  ? "bg-[#2563eb] text-white border-[#2563eb] shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "bg-corp-surface border-corp-border text-corp-text-secondary hover:border-[#2563eb] hover:text-corp-text"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROL STRIP ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border-2 border-[#2563eb]/40 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.15)]" style={{ background: "var(--corp-surface)" }}>
        
        {/* Left: Counter & AI Tutor Toggle */}
        <div className="flex items-center gap-4">
          <span className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#2563eb]/15 text-[#2563eb] font-mono border border-[#2563eb]/40">
            {filteredCourses.length} Courses
          </span>

          <button
            onClick={() => setAiTutorOnly(!aiTutorOnly)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all border-2 flex items-center gap-1.5",
              aiTutorOnly
                ? "bg-[#2563eb] text-white border-[#2563eb] shadow-md"
                : "bg-corp-bg-secondary border-corp-border text-corp-text-secondary hover:border-[#2563eb]/60"
            )}
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>AI Tutor Included</span>
          </button>
        </div>

        {/* Right: Search Input & Level Select */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
            <input
              type="text"
              placeholder="Search courses (e.g. XLOOKUP, DCF, SHL, DAX)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/50 transition-colors"
              style={{
                background: "var(--corp-bg-secondary)",
                border: "2px solid var(--corp-border)",
                color: "var(--corp-text)"
              }}
            />
          </div>

          <select
            value={selectedLevel || ""}
            onChange={(e) => setSelectedLevel(e.target.value || null)}
            className="px-3 py-2 rounded-lg text-xs font-extrabold outline-none bg-corp-bg-secondary border-2 border-corp-border text-corp-text-secondary cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="Basic">Basic Level</option>
            <option value="Intermediate">Intermediate Level</option>
            <option value="Advanced">Advanced Level</option>
          </select>
        </div>
      </div>

      {/* ── HIGH-CONTRAST POLISHED BRUTALIST COURSE CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.slice(0, visibleCount).map((course) => {
          const isEnrolled = state.enrolledPathSlugs.includes(course.pathSlug);
          const courseProgressObj = state.courseProgress.find((c) => c.id === course.slug);
          const progress = courseProgressObj ? courseProgressObj.progress : 0;
          const theme = course.theme;

          return (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <div
                className={cn(
                  "flex flex-col h-full rounded-xl border-2 overflow-hidden transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 group justify-between",
                  theme.border,
                  theme.cardShadow
                )}
                style={{ background: "var(--corp-surface)" }}
              >
                <div>
                  {/* Course Image Header Banner */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden border-b-2 border-corp-border bg-slate-900">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />

                    {/* Image Top Overlay Tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-900/90 text-white border border-white/30 font-mono shadow-sm">
                        {course.skillLevel}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] font-mono font-extrabold text-amber-950 bg-amber-400 px-2.5 py-1 rounded-md border border-amber-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                        <Sparkles size={11} className="text-amber-950" /> +{course.xp} XP
                      </span>
                    </div>

                    {/* Image Bottom Overlay Title / Path */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase font-mono shadow-md stroke-slate-900 border border-white/30 text-white", theme.badgeBg)}>
                        {course.pathTitle}
                      </span>
                    </div>
                  </div>

                  {/* Course Body Details */}
                  <div className="p-5 space-y-4">
                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight group-hover:text-[#2563eb] transition-colors line-clamp-2" style={{ color: "var(--corp-text)" }}>
                        <Link href={`/learn/${course.pathSlug}/${course.slug}`}>{course.title}</Link>
                      </h3>
                      <p className="text-xs line-clamp-2 leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor Profile Byline */}
                    <div className="p-2.5 rounded-lg bg-corp-bg-secondary flex items-center gap-3 border-2 border-corp-border">
                      <div className="w-8 h-8 rounded-md bg-[#2563eb]/15 text-[#2563eb] flex items-center justify-center text-sm flex-shrink-0 font-bold border border-[#2563eb]/30">
                        {course.instructor.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold truncate" style={{ color: "var(--corp-text)" }}>{course.instructor.name}</p>
                        <p className="text-[10px] truncate text-corp-text-tertiary font-bold">{course.instructor.role}</p>
                      </div>
                    </div>

                    {/* Skills Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-corp-bg-secondary text-corp-text border-1.5 border-corp-border uppercase font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Meta & Action Button */}
                <div className="p-5 pt-3 border-t-2 border-corp-border flex items-center justify-between gap-3 mt-2 bg-corp-bg-secondary/60">
                  <div className="flex items-center gap-3 text-xs font-mono font-extrabold text-corp-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#2563eb]" /> {course.hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} className="text-amber-500" /> {course.lessons} lessons
                    </span>
                  </div>

                  <Link
                    href={`/learn/${course.pathSlug}/${course.slug}`}
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 uppercase font-mono tracking-wider",
                      theme.btnStyle
                    )}
                  >
                    <span>{progress > 0 ? "Continue" : "Start"}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── LOAD MORE BUTTON ── */}
      {visibleCount < filteredCourses.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8 py-3.5 rounded-xl text-xs font-extrabold text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-300 uppercase font-mono tracking-wider"
            style={{ boxShadow: "4px 4px 0px 0px #1e3a8a" }}
          >
            Load More Courses ({filteredCourses.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </div>
  );
}

