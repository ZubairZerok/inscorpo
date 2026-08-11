"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, Clock, Star, Award, Users, CheckCircle2,
  Sparkles, Target, ChevronRight, Zap, BookOpen, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

const flagshipTracks = [
  {
    slug: "corporate-mto",
    badge: "Flagship Track #1 · Corporate & Banking",
    title: "Management Trainee (MTO) & Corporate Leadership",
    subtitle: "Crack MTO assessments, STAR behavioral interviews, and consulting case studies for top MNCs & Banks in Bangladesh.",
    outcomes: ["Bank MTO", "FMCG Brand Manager", "Corporate Officer", "Consulting Analyst"],
    duration: "4 Courses · 23 Hours",
    xp: "1,450 XP",
    enrolledCount: 52100,
    rating: 5.0,
    coverPhoto: "https://t4.ftcdn.net/jpg/02/61/31/83/360_F_261318391_vCfeZxtPmq1tCXFbPuuX0GkzutiVJKM5.jpg",
    colorHex: "#E11D48",
    darkHex: "#9F1239",
    shadowHex: "#881337",
    borderClass: "border-[#E11D48]",
    shadowStyle: "5px 5px 0px 0px #881337",
    btnBg: "#E11D48",
    btnShadow: "3px 3px 0px 0px #881337",
    textClass: "text-[#E11D48]",
    badgeBg: "#E11D48",
    badgeText: "#fff",
    stages: [
      { step: "01", title: "Application & Assessment Tests", detail: "SHL numerical reasoning & psychometric tests" },
      { step: "02", title: "STAR HR & Behavioral Prep", detail: "Structuring storytelling for high-stakes interviews" },
      { step: "03", title: "Functional & Case Studies", detail: "FMCG, Banking, and Operations technical Q&A" },
      { step: "04", title: "Executive Presentations & MECE", detail: "McKinsey issue trees & slide deck pitching" },
    ],
    passportBadge: "Verified MTO Candidate Badge",
    capstone: "MTO Assessment Center Mock Simulation & Executive Deck",
  },
  {
    slug: "excel-corporate",
    badge: "Flagship Track #2 · Analytics & Productivity",
    title: "Business Analytics, Corporate Excel & AI Productivity",
    subtitle: "From raw workbook navigation to advanced P&L financial modeling, Power Query ETL pipelines, and AI automation.",
    outcomes: ["Business Analyst", "Financial Analyst", "Operations Specialist", "AI Workflow Lead"],
    duration: "6 Courses · 44 Hours",
    xp: "2,550 XP",
    enrolledCount: 66350,
    rating: 4.9,
    coverPhoto: "https://png.pngtree.com/thumb_back/fh260/background/20231009/pngtree-dynamic-blend-of-digital-and-traditional-spreadsheet-and-statistical-paper-with-image_13567789.png",
    colorHex: "#10B981",
    darkHex: "#064E3B",
    shadowHex: "#047857",
    borderClass: "border-[#10B981]",
    shadowStyle: "5px 5px 0px 0px #047857",
    btnBg: "#10B981",
    btnShadow: "3px 3px 0px 0px #064E3B",
    textClass: "text-[#10B981]",
    badgeBg: "#10B981",
    badgeText: "#022c22",
    stages: [
      { step: "01", title: "Excel Fundamentals & Shortcuts", detail: "Mastering workbook efficiency & formatting" },
      { step: "02", title: "Formulas & Power Query ETL", detail: "XLOOKUP, SUMIFS, and data cleaning automation" },
      { step: "03", title: "Pivot Tables & Executive Viz", detail: "Dynamic dashboards, calculated fields & slicers" },
      { step: "04", title: "P&L Financial Modeling & DCF", detail: "Constructing NPV/IRR models & CEO performance trackers" },
    ],
    passportBadge: "Verified Corporate Analytics Specialist",
    capstone: "Real Enterprise CEO Performance Tracker & Modeling Capstone",
  },
];

export default function TailoredCareerTracksHubPage() {
  const { state } = useUser();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 font-sans">

      {/* Compact Page Header — Website Blue */}
      <div
        className="max-w-4xl mx-auto rounded-xl p-5 sm:p-6 relative overflow-hidden font-mono text-white border-2 border-blue-400"
        style={{
          background: "#2563eb",
          boxShadow: "5px 5px 0px 0px #1e3a8a",
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
              <Sparkles size={13} /> Tailored Career Journeys
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              Choose Your Flagship Career Track
            </h1>
            <p className="text-xs sm:text-sm max-w-xl leading-relaxed font-medium text-blue-100 font-sans">
              Step-by-step career pathways engineered for university candidates and fresh graduates targeting top corporate placements.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex gap-5 flex-shrink-0 bg-blue-900/60 p-3 rounded-lg border border-white/20">
            {[
              { value: "52K+", label: "Enrolled", icon: <Users size={13} className="text-amber-300" /> },
              { value: "4.9★", label: "Avg Rating", icon: <Star size={13} className="text-amber-300 fill-amber-300" /> },
              { value: "94%", label: "Completion", icon: <CheckCircle2 size={13} className="text-emerald-300" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center gap-1 justify-center mb-0.5">{stat.icon}</div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-[9px] text-blue-200 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagship Track Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {flagshipTracks.map((track) => {
          const isEnrolled = state.enrolledPathSlugs.includes(track.slug);

          return (
            <motion.div
              key={track.slug}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
              className={`rounded-xl border-2 ${track.borderClass} overflow-hidden flex flex-col`}
              style={{
                background: "var(--corp-surface)",
                boxShadow: track.shadowStyle,
              }}
            >
              {/* Cover Photo */}
              <div className="relative h-52 w-full overflow-hidden" style={{ background: "#0d1b2a" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.coverPhoto}
                  alt={track.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{ opacity: 0.92 }}
                />
                {/* Glassmorphism overlay at bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                  }}
                />

                {/* Badge + Rating row */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3 z-10">
                  <span
                    className="px-3 py-1 rounded-md text-[11px] font-extrabold uppercase font-mono tracking-wider border border-white/20 shadow-md"
                    style={{ background: track.badgeBg, color: track.badgeText }}
                  >
                    {track.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-white bg-black/70 px-3 py-1 rounded-md border border-white/20 backdrop-blur-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {track.rating} ({(track.enrolledCount / 1000).toFixed(1)}K)
                  </div>
                </div>

                {/* Title at bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight font-mono uppercase drop-shadow-lg">
                    {track.title}
                  </h2>
                </div>
              </div>

              {/* Subtitle */}
              <div className="p-4 px-6 border-b-2 border-corp-border" style={{ background: "var(--corp-bg-secondary)" }}>
                <p className="text-xs text-corp-text-secondary font-medium leading-relaxed">
                  {track.subtitle}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 space-y-5">

                {/* Target Roles */}
                <div className="space-y-2">
                  <p className={`text-[11px] font-extrabold uppercase font-mono tracking-wider ${track.textClass}`}>
                    Target Roles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {track.outcomes.map((role) => (
                      <span
                        key={role}
                        className={`px-3 py-1 rounded-md text-xs font-extrabold border-2 ${track.borderClass} ${track.textClass} font-mono uppercase`}
                        style={{ background: "var(--corp-bg-secondary)" }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4-Stage Roadmap */}
                <div className="space-y-2">
                  <p className={`text-[11px] font-extrabold uppercase font-mono tracking-wider ${track.textClass}`}>
                    4-Stage Roadmap:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {track.stages.map((stg) => (
                      <div
                        key={stg.step}
                        className="p-3 rounded-lg flex items-start gap-2.5 border-2 border-corp-border"
                        style={{ background: "var(--corp-bg-secondary)" }}
                      >
                        <span
                          className="w-6 h-6 rounded-md font-mono text-xs font-extrabold flex items-center justify-center flex-shrink-0 text-white border border-white/20"
                          style={{ background: track.colorHex }}
                        >
                          {stg.step}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold truncate font-mono" style={{ color: "var(--corp-text)" }}>
                            {stg.title}
                          </p>
                          <p className="text-[10px] font-medium truncate" style={{ color: "var(--corp-text-tertiary)" }}>
                            {stg.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credential Strip */}
                <div
                  className="p-3 rounded-lg flex items-center justify-between gap-3 border-2 border-amber-400/50"
                  style={{ background: "rgba(245,158,11,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-xs font-extrabold font-mono" style={{ color: "var(--corp-text)" }}>
                      {track.passportBadge}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 font-mono flex-shrink-0">
                    100% Credential
                  </span>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t-2 border-corp-border mt-auto">
                  <div className="text-xs font-mono font-extrabold text-corp-text-secondary flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} style={{ color: track.colorHex }} /> {track.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-600 border border-amber-400/40 font-extrabold text-[10px] uppercase">
                      +{track.xp}
                    </span>
                  </div>

                  <Link
                    href={`/learn/${track.slug}`}
                    className="px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase font-mono tracking-wider flex items-center gap-2 border-0 transition-all hover:-translate-y-0.5 text-white"
                    style={{
                      background: track.btnBg,
                      boxShadow: track.btnShadow,
                    }}
                  >
                    {isEnrolled ? "Continue Track" : "Launch Track"}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Individual Courses CTA */}
      <div
        className="max-w-4xl mx-auto rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden border-2 border-blue-400 font-mono text-white"
        style={{
          background: "#2563eb",
          boxShadow: "5px 5px 0px 0px #1e3a8a",
        }}
      >
        <div className="relative z-10">
          <h3 className="text-base font-extrabold uppercase text-white">
            Explore Individual Skill Courses & Secondary Modules
          </h3>
          <p className="text-xs mt-1 font-medium font-sans text-blue-100">
            Need single topics like Power BI, Corporate Finance, or Business Communication? Browse our complete collection.
          </p>
        </div>
        <Link
          href="/courses"
          className="px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase font-mono tracking-wider flex items-center gap-2 flex-shrink-0 transition-all bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f]"
        >
          View All Courses
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
