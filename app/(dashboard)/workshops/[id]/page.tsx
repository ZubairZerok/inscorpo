"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, User, Sparkles, Check, CheckCircle2, Flame, AlertCircle,
  Presentation, BookOpen, BarChart3, Brain, Briefcase, TrendingUp, Ticket,
  ArrowLeft, ShieldCheck, QrCode, Award, HelpCircle, ArrowRight, Play, RefreshCw, FileText, Target
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { fetchUserWorkshopBookings } from "@/lib/db";
import { WORKSHOPS_DATA, getWorkshopById, WorkshopDetail, normalizeWorkshopId } from "@/lib/data/workshops";
import { WorkshopRegistrationModal } from "@/components/workshops/workshop-registration-modal";
import Link from "next/link";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function IndividualWorkshopPage() {
  const params = useParams();
  const router = useRouter();
  const { addXP, addNotification, state } = useUser();
  const { user } = useAuth();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const workshopId = typeof rawId === "string" ? normalizeWorkshopId(rawId) : "cv-writing-linkedin-hacks";
  const workshop = getWorkshopById(workshopId) || WORKSHOPS_DATA[0];

  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketCode, setTicketCode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Post-Workshop Exam State
  const [examTab, setExamTab] = useState<"overview" | "exam" | "credential">("overview");
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [passedExam, setPassedExam] = useState(false);

  // Check if user is registered for this workshop from Appwrite DB / Local state
  useEffect(() => {
    async function checkRegistration() {
      let booked = false;
      let code = "";
      if (user) {
        const bookings = await fetchUserWorkshopBookings(user.$id);
        const match = bookings.find((b: any) => normalizeWorkshopId(b.workshopId) === workshop.id);
        if (match) {
          booked = true;
          code = match.ticketCode || `BAUBC-${workshop.id.substring(0, 4).toUpperCase()}-VERIFIED`;
        }
      }
      try {
        const storedIds: string[] = JSON.parse(localStorage.getItem("insyt_booked_workshops") || "[]");
        if (storedIds.some((id) => normalizeWorkshopId(id) === workshop.id)) {
          booked = true;
          if (!code) code = `BAUBC-${workshop.id.substring(0, 4).toUpperCase()}-VERIFIED`;
        }
      } catch {
        /* fallback */
      }

      if (booked) {
        setIsRegistered(true);
        if (code) setTicketCode(code);
      }
    }
    checkRegistration();
  }, [user, workshop.id]);

  const handleOptionSelect = (questionId: number, optionIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleExamSubmit = () => {
    if (isExamSubmitted) return;

    let correctCount = 0;
    workshop.examQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / workshop.examQuestions.length) * 100);
    setExamScore(scorePercentage);
    setIsExamSubmitted(true);

    if (scorePercentage >= 70) {
      setPassedExam(true);
      const alreadyClaimed = state.xpLogs.some((log) => log.reason.includes(`Passed exam for ${workshop.title}`));
      if (!alreadyClaimed) {
        addXP(workshop.examXpReward, `Passed exam for ${workshop.title}`);
        addNotification({
          type: "achievement",
          title: "BAUBC Credential Unlocked!",
          message: `Congratulations! You scored ${scorePercentage}% on the ${workshop.title} post-workshop exam. +${workshop.examXpReward} XP awarded!`,
        });
      }
      setExamTab("credential");
    } else {
      setPassedExam(false);
    }
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setIsExamSubmitted(false);
    setExamScore(0);
    setPassedExam(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6 font-sans pb-24 text-slate-900 dark:text-white"
    >
      {/* Back Button */}
      <motion.div variants={item}>
        <Link
          href="/workshops"
          className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-[#2563eb] hover:underline uppercase"
        >
          <ArrowLeft size={14} /> Back to Live Workshops
        </Link>
      </motion.div>

      {/* Workshop Header Hero Card */}
      <motion.div
        variants={item}
        className="rounded-2xl border-2 border-blue-400 p-6 sm:p-8 text-white font-mono relative overflow-hidden space-y-5"
        style={{
          background: "#2563eb",
          boxShadow: "6px 6px 0px 0px #1e3a8a",
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                {workshop.hostOrg}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-blue-900/80 text-blue-100 border border-white/20">
                {workshop.category} • {workshop.level}
              </span>
            </div>

            <div className="px-3 py-1 rounded-md text-xs font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1.5">
              <Sparkles size={14} /> +{workshop.xpReward} XP Reward
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            {workshop.title}
          </h1>

          <p className="text-xs sm:text-sm font-sans font-medium text-blue-100 leading-relaxed max-w-3xl">
            {workshop.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-blue-100 pt-2 font-bold">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-300" /> {workshop.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-300" /> {workshop.time}</span>
            <span className="flex items-center gap-1.5"><User size={14} className="text-amber-300" /> {workshop.instructor.name}</span>
          </div>
        </div>

        {/* CTA Bar inside Hero */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-100">
            <Flame size={16} className="text-amber-300 fill-amber-300 animate-pulse" />
            <span>{workshop.spotsRemaining} Seats Remaining • Live Interactive Session</span>
          </div>

          {isRegistered ? (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-emerald-500 text-white border border-emerald-600 flex items-center gap-1.5 shadow">
                <CheckCircle2 size={15} /> Seat Reserved ({ticketCode})
              </span>
              <button
                onClick={() => setExamTab("exam")}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] hover:bg-amber-300 transition-all flex items-center gap-1.5"
              >
                <Award size={14} /> Take Post-Workshop Exam
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl text-xs font-black uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 shadow-[4px_4px_0px_0px_#78350f] flex items-center justify-center gap-2"
            >
              <Ticket size={15} />
              Book Seat &amp; Claim Ticket
            </button>
          )}
        </div>
      </motion.div>

      {/* Navigation Tabs (Overview vs Post-Workshop Exam vs Credential) */}
      <motion.div variants={item} className="flex flex-wrap gap-2 font-mono">
        <button
          onClick={() => setExamTab("overview")}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all border-2 flex items-center gap-2 ${
            examTab === "overview"
              ? "bg-[#2563eb] text-white border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a]"
              : "text-corp-text border-corp-border bg-corp-surface hover:bg-corp-bg-secondary"
          }`}
        >
          <FileText size={14} /> Workshop Overview &amp; Agenda
        </button>

        <button
          onClick={() => setExamTab("exam")}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all border-2 flex items-center gap-2 ${
            examTab === "exam"
              ? "bg-[#2563eb] text-white border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a]"
              : "text-corp-text border-corp-border bg-corp-surface hover:bg-corp-bg-secondary"
          }`}
        >
          <HelpCircle size={14} /> Post-Workshop Exam (+{workshop.examXpReward} XP)
        </button>

        {passedExam && (
          <button
            onClick={() => setExamTab("credential")}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all border-2 flex items-center gap-2 bg-amber-400 text-amber-950 border-amber-500 shadow-[3px_3px_0px_0px_#78350f]`}
          >
            <Award size={14} /> Verified BAUBC Credential Pass
          </button>
        )}
      </motion.div>

      {/* Tab 1: Overview */}
      {examTab === "overview" && (
        <motion.div variants={item} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* About Workshop */}
              <div className="p-6 rounded-2xl border-2 border-corp-border bg-corp-surface space-y-3 font-mono shadow-[5px_5px_0px_0px_#2563eb]">
                <h3 className="text-sm font-black uppercase text-[#2563eb] flex items-center gap-2">
                  <BookOpen size={16} /> About This Masterclass
                </h3>
                <p className="text-xs font-sans font-medium text-corp-text-secondary leading-relaxed">
                  {workshop.description}
                </p>
              </div>

              {/* Agenda Timeline */}
              <div className="p-6 rounded-2xl border-2 border-corp-border bg-corp-surface space-y-4 font-mono shadow-[5px_5px_0px_0px_#2563eb]">
                <h3 className="text-sm font-black uppercase text-[#2563eb] flex items-center gap-2">
                  <Clock size={16} /> Schedule &amp; Workshop Agenda
                </h3>
                <div className="space-y-3">
                  {workshop.agenda.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-corp-border bg-corp-bg-secondary flex items-start gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#2563eb] text-white text-[11px] font-black flex-shrink-0">
                        {item.time}
                      </span>
                      <div>
                        <h4 className="text-xs font-black uppercase text-corp-text">{item.topic}</h4>
                        <p className="text-[11px] font-sans font-medium text-corp-text-secondary mt-0.5">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="p-6 rounded-2xl border-2 border-corp-border bg-corp-surface space-y-3 font-mono shadow-[5px_5px_0px_0px_#2563eb]">
                <h3 className="text-sm font-black uppercase text-[#2563eb] flex items-center gap-2">
                  <Target size={16} /> What You Will Master
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {workshop.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans font-semibold text-corp-text-secondary">
                      <CheckCircle2 size={15} className="text-[#2563eb] flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6 font-mono">
              {/* Speaker Card */}
              <div className="p-5 rounded-2xl border-2 border-corp-border bg-corp-surface space-y-3 shadow-[5px_5px_0px_0px_#2563eb]">
                <h3 className="text-xs font-black uppercase text-corp-text-tertiary">Workshop Lead &amp; Speaker</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-black text-sm border-2 border-blue-400 flex-shrink-0">
                    {workshop.instructor.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase text-corp-text">{workshop.instructor.name}</h4>
                    <p className="text-xs font-extrabold text-[#2563eb]">{workshop.instructor.role}</p>
                    <p className="text-[10px] text-corp-text-tertiary">{workshop.instructor.company}</p>
                  </div>
                </div>
                <p className="text-xs font-sans font-medium text-corp-text-secondary pt-2 border-t border-corp-border">
                  {workshop.instructor.bio}
                </p>
              </div>

              {/* Host & Credential Card */}
              <div className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-400/10 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase">
                  <Award size={16} /> Partner Host Organization
                </div>
                <h4 className="text-sm font-black uppercase text-corp-text">{workshop.hostOrg}</h4>
                <p className="text-xs font-sans font-medium text-corp-text-secondary">
                  Completing the post-workshop exam unlocks an official co-branded credential from BAU Business Club (BAUBC).
                </p>
                <div className="pt-2 border-t border-amber-400/30 flex items-center justify-between text-xs font-bold">
                  <span className="text-corp-text-tertiary">Venue</span>
                  <span className="text-[#2563eb] font-extrabold">{workshop.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Post-Workshop Exam & Certification System */}
      {examTab === "exam" && (
        <motion.div variants={item} className="space-y-6 font-mono">
          <div className="p-6 rounded-2xl border-2 border-corp-border bg-corp-surface space-y-4 shadow-[6px_6px_0px_0px_#2563eb]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-corp-border pb-4">
              <div>
                <span className="px-3 py-1 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {workshop.hostOrg} Exam Center
                </span>
                <h3 className="text-lg font-black uppercase text-corp-text mt-1">
                  Post-Workshop Assessment &amp; Certification Test
                </h3>
                <p className="text-xs font-sans font-medium text-corp-text-secondary mt-0.5">
                  Complete the 4-question test based on today&apos;s workshop topics. Score 70% or higher to earn <strong className="text-[#2563eb]">+{workshop.examXpReward} XP</strong> and unlock your BAUBC Credential Pass.
                </p>
              </div>

              {isExamSubmitted && (
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black uppercase text-corp-text-tertiary block">Exam Score</span>
                  <span className={`text-2xl font-black ${passedExam ? "text-emerald-500" : "text-rose-500"}`}>
                    {examScore}% ({passedExam ? "PASSED ✓" : "TRY AGAIN"})
                  </span>
                </div>
              )}
            </div>

            {/* Exam Questions */}
            <div className="space-y-6 pt-2">
              {workshop.examQuestions.map((q, qIdx) => {
                const isSelected = userAnswers[q.id] !== undefined;

                return (
                  <div key={q.id} className="p-4 sm:p-5 rounded-xl border-2 border-corp-border bg-corp-bg-secondary space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#2563eb] text-white text-xs font-black flex-shrink-0">
                        Q{qIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-corp-text leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = userAnswers[q.id] === optIdx;
                        const isCorrectOpt = q.correctAnswer === optIdx;

                        let optStyle = "border-corp-border bg-corp-surface text-corp-text hover:border-[#2563eb]";
                        if (isExamSubmitted) {
                          if (isCorrectOpt) {
                            optStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold";
                          } else if (isThisSelected && !isCorrectOpt) {
                            optStyle = "border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300";
                          }
                        } else if (isThisSelected) {
                          optStyle = "border-[#2563eb] bg-[#2563eb]/15 text-[#2563eb] font-bold";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isExamSubmitted}
                            onClick={() => handleOptionSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border-2 text-xs text-left transition-all flex items-center justify-between gap-3 ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {isExamSubmitted && isCorrectOpt && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isExamSubmitted && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-sans text-corp-text-secondary mt-2">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Exam Action Bar */}
            <div className="pt-4 border-t-2 border-corp-border flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-corp-text-tertiary">
                {Object.keys(userAnswers).length} of {workshop.examQuestions.length} questions answered
              </span>

              {isExamSubmitted ? (
                <div className="flex gap-3">
                  {!passedExam && (
                    <button
                      onClick={handleRetakeExam}
                      className="px-5 py-2.5 rounded-xl text-xs font-black uppercase bg-corp-bg-secondary text-corp-text border-2 border-corp-border hover:bg-corp-surface transition-all flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Retake Exam
                    </button>
                  )}
                  {passedExam && (
                    <button
                      onClick={() => setExamTab("credential")}
                      className="px-6 py-2.5 rounded-xl text-xs font-black uppercase bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] flex items-center gap-2"
                    >
                      <Award size={14} /> View BAUBC Credential Pass
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleExamSubmit}
                  disabled={Object.keys(userAnswers).length < workshop.examQuestions.length}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase bg-[#2563eb] text-white hover:bg-blue-600 border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> Submit Assessment &amp; Claim Score
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: BAUBC Co-Branded Digital Credential Pass */}
      {examTab === "credential" && (
        <motion.div variants={item} className="space-y-6 font-mono">
          {/* 3-Color Executive Gradient Ticket Card */}
          <div
            className="p-6 rounded-2xl border-2 border-amber-400 shadow-2xl relative overflow-hidden font-mono"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #1e1b4b 50%, #854d0e 100%)",
              color: "#ffffff",
              boxShadow: "0 12px 35px rgba(6,95,70,0.35), 0 0 25px rgba(245,158,11,0.25)",
            }}
          >
            {/* Header Stamp */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-dashed border-amber-400/40 pb-5">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm inline-block">
                  Verified Executive Credential Pass
                </span>
                <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide drop-shadow-sm mt-1">
                  {workshop.credentialName}
                </h2>
                <p className="text-xs font-bold text-amber-300">
                  Co-Issued by {workshop.hostOrg}
                </p>
              </div>

              <div className="bg-slate-950/80 border-2 border-amber-400 p-3 rounded-xl text-right flex-shrink-0 shadow-md">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">CREDENTIAL ID</span>
                <span className="text-sm font-black text-white tracking-wider">
                  {ticketCode || `BAUBC-MTO-${Math.floor(1000 + Math.random() * 9000)}-2026`}
                </span>
              </div>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Candidate Name</span>
                <span className="text-sm font-black text-white drop-shadow-sm">{state.name || "Executive Candidate"}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Institution</span>
                <span className="text-xs font-extrabold text-white truncate block">{state.passportProfile?.university || "Bangladesh Agricultural University (BAU)"}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Exam Score</span>
                <span className="text-sm font-black text-emerald-400">{examScore}% PASSED ✓</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">XP Awarded</span>
                <span className="text-sm font-black text-amber-300">+{workshop.examXpReward} XP</span>
              </div>
            </div>

            {/* Verification Footer (Clean Alignment, NO QR Code) */}
            <div className="pt-4 border-t-2 border-dashed border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-400/60 shadow-sm">
                <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider leading-none">Verification Status</span>
                  <span className="text-xs font-black text-white tracking-wide mt-1">Verified BAUBC Partner Registry</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-400/60 shadow-sm">
                  <Award size={16} className="text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Status: Verified Pass Issued
                  </span>
                </div>

                <Link
                  href="/career-passport"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase bg-[#2563eb] text-white hover:bg-blue-600 border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] transition-all flex items-center gap-1.5"
                >
                  <span>View in Passport</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Registration Form Modal */}
      <WorkshopRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshop={workshop}
        onSuccess={(code) => {
          setIsRegistered(true);
          setTicketCode(code);
        }}
      />
    </motion.div>
  );
}
