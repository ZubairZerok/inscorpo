"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Target, Award, Users, Briefcase, BookOpen,
  ChevronRight, Star, Zap, Shield, AlertTriangle, Building2,
  BarChart3, MapPin, Clock, ArrowRight, Sparkles, CheckCircle2,
  Lightbulb, Brain, DollarSign, GraduationCap, Flame, Globe, Trophy
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";
import { RankExplainerModal } from "@/components/dashboard/rank-explainer-modal";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const CAREER_PATHS = [
  {
    id: "mto",
    title: "MTO / Graduate Trainee",
    icon: <Building2 size={20} className="text-amber-400" />,
    salaryRange: "৳35,000 – ৳80,000/mo",
    successRate: "4.2%",
    topCompanies: ["Unilever", "BRAC Bank", "British American Tobacco", "Nestle", "Reckitt"],
    requiredSkills: ["Excel & Data", "Business Communication", "Case Solving", "Leadership", "Group Discussion"],
    avgTimeline: "6–9 months",
    description: "The gold standard corporate entry route in Bangladesh. Hyper-competitive — only ~4% applicants succeed.",
    insightTag: "Most candidates fail at GD rounds",
    courseLink: "/learn/corporate-mto",
  },
  {
    id: "analyst",
    title: "Business / Financial Analyst",
    icon: <BarChart3 size={20} className="text-amber-400" />,
    salaryRange: "৳25,000 – ৳60,000/mo",
    successRate: "8.7%",
    topCompanies: ["BRAC", "Grameenphone", "Dutch Bangla Bank", "McKinsey Alumni Firms", "EY & KPMG"],
    requiredSkills: ["Advanced Excel", "Power BI", "Financial Modeling", "SQL Basics", "Presentation"],
    avgTimeline: "3–6 months",
    description: "High demand across MNCs and NGOs. Excel mastery + data storytelling are the non-negotiable differentiators.",
    insightTag: "Power BI is now table stakes",
    courseLink: "/learn/power-bi",
  },
  {
    id: "tech",
    title: "Tech / Product Associate",
    icon: <Zap size={20} className="text-amber-400" />,
    salaryRange: "৳40,000 – ৳1,20,000/mo",
    successRate: "12.3%",
    topCompanies: ["bKash", "ShopUp", "Chaldal", "Sheba.xyz", "Pathao", "Brain Station 23"],
    requiredSkills: ["Basic SQL", "Product Thinking", "User Research", "Agile/Scrum", "Data Analysis"],
    avgTimeline: "4–8 months",
    description: "Bangladesh's fastest growing sector. Product + Tech hybrid roles offer the best salary upside.",
    insightTag: "AI literacy doubles offer rate",
    courseLink: "/learn/ai-automation",
  },
  {
    id: "development",
    title: "Development / NGO Sector",
    icon: <Globe size={20} className="text-amber-400" />,
    salaryRange: "৳30,000 – ৳90,000/mo",
    successRate: "9.1%",
    topCompanies: ["UNDP", "World Bank", "BRAC NGO", "icddr,b", "USAID Partners", "CARE Bangladesh"],
    requiredSkills: ["Project Management", "Data & M&E", "Report Writing", "Field Research", "Community Dev"],
    avgTimeline: "6–12 months",
    description: "High impact, competitive packages. UN agencies often pay more than local MNCs.",
    insightTag: "LogFrame writing unlocks UN roles",
    courseLink: "/learn/business-comm",
  },
];

const CHALLENGER_INSIGHTS = [
  {
    icon: <AlertTriangle size={16} className="text-amber-300" />,
    title: "Most MTO applicants fail at Group Discussion — not CV screen",
    body: "83% of rejections at top FMCG firms happen at GD/Assessment Center stages — not the written test. CGPA gets the interview, skills win the offer.",
    cta: "Practice GD Skills",
    ctaHref: "/mock-interviews",
  },
  {
    icon: <Lightbulb size={16} className="text-amber-300" />,
    title: "Recruiters spend 7 seconds on your resume",
    body: "Corporate recruiters scan for quantified impact: 'Increased output by 34%' beats 'Worked in a team.' INSYT auto-formats your XP into recruiter-language.",
    cta: "Build Your Passport",
    ctaHref: "/career-passport",
  },
  {
    icon: <Zap size={16} className="text-amber-300" />,
    title: "Power BI learners are 2.4x more likely to get shortlisted",
    body: "Based on INSYT placement data across 400+ students, candidates with verified Power BI + Excel credentials receive 2.4x more recruiter callbacks.",
    cta: "Start Power BI Track",
    ctaHref: "/learn/power-bi",
  },
];

const SALARY_DATA = [
  { company: "Unilever Bangladesh", role: "MTO (Batch 2025)", monthly: "৳55,000–৳75,000", benefit: "+ Car + LFA" },
  { company: "British American Tobacco", role: "MTO (Annual)", monthly: "৳65,000–৳85,000", benefit: "+ Provident Fund" },
  { company: "BRAC Bank", role: "Management Associate", monthly: "৳40,000–৳60,000", benefit: "+ Medical" },
  { company: "Grameenphone", role: "GMT (Tech & Analytics)", monthly: "৳50,000–৳70,000", benefit: "+ Gadget Allow." },
  { company: "bKash", role: "Associate Product Manager", monthly: "৳60,000–৳90,000", benefit: "+ Startup ESOP" },
  { company: "UNDP Bangladesh", role: "Programme Associate", monthly: "৳70,000–৳95,000", benefit: "+ UN Benefits" },
];

export default function CareerHubPage() {
  const { state } = useUser();
  const [selectedPath, setSelectedPath] = useState("mto");
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const activePath = CAREER_PATHS.find((p) => p.id === selectedPath)!;

  const userSkillScore = Math.min(
    Math.round((state.xp / 10000) * 100),
    100
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-8 pb-16 px-4 sm:px-6 font-sans text-slate-900"
    >
      {/* Page Header Banner — Blue & Amber Neo-Brutalist Theme */}
      <motion.div
        variants={item}
        className="rounded-xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-blue-400 text-white font-mono"
        style={{
          background: "#2563eb",
          boxShadow: "5px 5px 0px 0px #1e3a8a",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
              <Target size={14} /> INSYT Career Intelligence Hub
            </span>
            <button
              onClick={() => setRankModalOpen(true)}
              className="px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-slate-950 text-white border border-blue-300 shadow-sm hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trophy size={13} className="text-amber-400" /> Rank Perks
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono uppercase tracking-tight text-white">
            Your Corporate Career Blueprint
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl leading-relaxed font-medium text-blue-100 font-sans">
            Strategic skill targeting, real-world case practice, and MNC salary benchmarks designed for maximum executive impact.
          </p>
        </div>

        {/* MTO Readiness Score Widget */}
        <div
          onClick={() => setRankModalOpen(true)}
          className="flex items-center gap-4 p-4 rounded-xl border-2 border-white/30 bg-white/10 flex-shrink-0 relative z-10 font-mono cursor-pointer hover:bg-white/20 transition-all"
          title="Click to view Rank Tiers"
        >
          <div className="relative w-14 h-14">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none" strokeWidth="5"
                stroke="#FCD34D"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - userSkillScore / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold font-mono text-white">{userSkillScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">MTO Readiness</p>
            <p className="text-sm font-extrabold text-white">
              {userSkillScore >= 70 ? "Ready to Apply" : userSkillScore >= 40 ? "Getting There" : "Build Foundation"}
            </p>
            <p className="text-xs font-extrabold text-amber-300">{state.xp.toLocaleString()} XP earned</p>
          </div>
        </div>
      </motion.div>

      {/* Challenger Insights Grid */}
      <motion.div variants={item} className="space-y-3 font-mono">
        <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
          <Brain size={16} className="text-[#2563eb]" /> What Most Students Get Wrong
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHALLENGER_INSIGHTS.map((insight, i) => (
            <motion.div
              key={i}
              variants={item}
              className="p-5 rounded-xl border-2 border-blue-500 flex flex-col justify-between space-y-3"
              style={{
                background: "var(--corp-surface)",
                boxShadow: "5px 5px 0px 0px #2563eb",
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2563eb]/15 flex items-center justify-center text-[#2563eb] border border-blue-400/40">
                    {insight.icon}
                  </div>
                  <span className="text-xs font-extrabold uppercase text-[#2563eb]">
                    Key Insight #{i + 1}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold uppercase leading-snug text-corp-text">
                  {insight.title}
                </h3>
                <p className="text-xs leading-relaxed font-sans font-medium text-corp-text-secondary">
                  {insight.body}
                </p>
              </div>

              <Link
                href={insight.ctaHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-extrabold text-white bg-[#2563eb] hover:bg-blue-600 transition-all border border-blue-300 uppercase tracking-wider shadow-[3px_3px_0px_0px_#1e3a8a] self-start cursor-pointer"
              >
                {insight.cta} <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Career Pathway Navigator */}
      <motion.div variants={item} className="space-y-4 font-mono">
        <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
          <MapPin size={16} className="text-[#2563eb]" /> Career Pathway Navigator
        </h2>

        {/* Path Tabs */}
        <div className="flex flex-wrap gap-2">
          {CAREER_PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 flex items-center gap-2 cursor-pointer ${
                selectedPath === path.id
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              }`}
            >
              <span>{path.title}</span>
            </button>
          ))}
        </div>

        {/* Active Path Detail Box */}
        <div
          className="rounded-xl overflow-hidden border-2 border-blue-500 space-y-6"
          style={{
            background: "var(--corp-surface)",
            boxShadow: "5px 5px 0px 0px #2563eb",
          }}
        >
          {/* Header Banner */}
          <div className="p-6 text-white bg-[#2563eb] border-b-2 border-blue-400">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
                    {activePath.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold uppercase">{activePath.title}</h3>
                    <p className="text-xs font-sans font-medium opacity-90">{activePath.description}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                  <AlertTriangle size={12} />
                  Insight: {activePath.insightTag}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:text-right flex-shrink-0">
                <div>
                  <p className="text-2xl font-black text-amber-300">{activePath.successRate}</p>
                  <p className="text-[10px] text-blue-100 uppercase">Acceptance Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{activePath.avgTimeline}</p>
                  <p className="text-[10px] text-blue-100 uppercase">Avg Prep Time</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-amber-300">{activePath.salaryRange}</p>
                  <p className="text-[10px] text-blue-100 uppercase">Starting Range</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
            {/* Required Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-corp-text-tertiary">
                Required Skills Breakdown
              </h4>
              <div className="space-y-2">
                {activePath.requiredSkills.map((skill, i) => (
                  <div key={skill} className="flex items-center gap-3 p-2.5 rounded-lg border border-blue-400/40 bg-blue-50/20">
                    <div
                      className="w-6 h-6 rounded-md bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-xs"
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold text-corp-text">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Companies */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-corp-text-tertiary">
                Top Recruiting Companies
              </h4>
              <div className="flex flex-wrap gap-2">
                {activePath.topCompanies.map((co) => (
                  <span
                    key={co}
                    className="px-3 py-1.5 rounded-lg text-xs font-extrabold border-2 border-blue-400/50 bg-blue-50/20 text-corp-text uppercase"
                  >
                    {co}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href={activePath.courseLink}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all bg-amber-400 text-amber-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  <BookOpen size={14} className="fill-amber-950" />
                  <span>Start This Track</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Salary Intelligence */}
      <motion.div variants={item} className="space-y-4 font-mono">
        <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
          <DollarSign size={16} className="text-[#2563eb]" /> Corporate Salary Intelligence
        </h2>

        <div
          className="rounded-xl overflow-hidden border-2 border-blue-500"
          style={{ background: "var(--corp-surface)", boxShadow: "5px 5px 0px 0px #2563eb" }}
        >
          <div
            className="grid grid-cols-12 px-5 py-3 text-[10px] font-mono font-extrabold uppercase tracking-wider border-b-2 border-blue-400 bg-blue-500/10 text-corp-text-secondary"
          >
            <div className="col-span-4">Company</div>
            <div className="col-span-4">Role</div>
            <div className="col-span-2 text-right">Monthly CTC</div>
            <div className="col-span-2 text-right">Benefits</div>
          </div>
          {SALARY_DATA.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center px-5 py-3.5 text-xs font-mono border-b border-blue-400/30 last:border-b-0 hover:bg-blue-500/5 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-2 font-extrabold text-corp-text">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                {row.company}
              </div>
              <div className="col-span-4 font-semibold text-corp-text-secondary">{row.role}</div>
              <div className="col-span-2 text-right font-extrabold text-[#2563eb]">{row.monthly}</div>
              <div className="col-span-2 text-right text-corp-text-tertiary text-[11px]">{row.benefit}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <RankExplainerModal
        isOpen={rankModalOpen}
        onClose={() => setRankModalOpen(false)}
        state={state}
      />
    </motion.div>
  );
}
