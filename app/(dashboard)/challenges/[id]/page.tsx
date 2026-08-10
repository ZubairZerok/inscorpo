"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ChevronLeft, Clock, Download, FileText, CheckCircle2, 
  Eye, Send, Award, Sparkles, HelpCircle, RefreshCw, Trophy,
  AlertCircle, Table, BrainCircuit, BarChart3, Check, X, ShieldCheck,
  ChevronRight, Share2, Lightbulb, Play, Pause, RotateCcw, ArrowRight, Star
} from "lucide-react";
import { challengesData, Challenge, DiagnosticQuestion } from "@/lib/data/challenges";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/providers/user-context";
import { triggerFileDownload } from "@/lib/utils/download-helper";
import { EvaluationResult } from "@/app/api/ai/evaluate-challenge/route";

export default function ChallengeWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { state, completeChallenge, addNotification } = useUser();

  const rawId = (params?.id || params?.slug) as string;
  const challenge = challengesData.find(c => c.id === rawId) || challengesData[0];

  // States
  const [activeTab, setActiveTab] = useState<"brief" | "quiz" | "submission" | "evaluation">("brief");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [caseSubmission, setCaseSubmission] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStep, setEvalStep] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [tableSearch, setTableSearch] = useState("");

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Load cached submission/evaluation from localStorage if available
  useEffect(() => {
    if (!challenge) return;
    const storageKey = `challenge_eval_${challenge.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEvaluationResult(parsed.evaluation);
        if (parsed.caseSubmission) setCaseSubmission(parsed.caseSubmission);
        if (parsed.selectedAnswers) setSelectedAnswers(parsed.selectedAnswers);
      } catch (e) {
        console.error("Failed to parse saved evaluation", e);
      }
    }
  }, [challenge]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--corp-text)" }}>Challenge Not Found</h2>
        <button 
          onClick={() => router.push("/challenges")}
          className="px-6 py-2.5 rounded-xl font-medium bg-corp-accent text-white cursor-pointer"
        >
          Return to Challenges Hub
        </button>
      </div>
    );
  }

  const isCompletedAlready = state.completedChallengeIds.includes(challenge.id) || Boolean(evaluationResult);

  // Default quiz questions fallback if missing
  const quizQuestions: DiagnosticQuestion[] = challenge.diagnosticQuestions || [
    {
      id: 1,
      question: `For the "${challenge.title}" scenario, what is the primary optimization objective?`,
      options: [
        "A) Maximize revenue by increasing unconstrained inventory buffers",
        "B) Minimize total cost by balancing reorder point safety stock vs holding cost",
        "C) Eliminate all safety stock to reduce warehouse footprint to zero",
        "D) Increase order lead time to 90 days across all suppliers"
      ],
      correct: "B) Minimize total cost by balancing reorder point safety stock vs holding cost",
      explanation: "Balancing safety stock holding costs against stockout risk optimizes working capital."
    },
    {
      id: 2,
      question: "Which metric best measures forecast accuracy under seasonal demand volatility?",
      options: [
        "A) Simple Moving Average (SMA) over 12 months",
        "B) Mean Absolute Percentage Error (MAPE) combined with WAPE",
        "C) Gross Profit Margin percentage",
        "D) Total SKU Count in central distribution center"
      ],
      correct: "B) Mean Absolute Percentage Error (MAPE) combined with WAPE",
      explanation: "MAPE and Weighted Absolute Percentage Error (WAPE) accurately quantify volumetric variance."
    }
  ];

  // Dataset rows filtering
  const datasetRows = challenge.datasetRows || [];
  const datasetHeaders = challenge.datasetHeaders || (datasetRows.length ? Object.keys(datasetRows[0]) : []);

  const filteredDatasetRows = datasetRows.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(tableSearch.toLowerCase())
    )
  );

  const handleDownloadDataset = () => {
    if (!datasetRows.length) {
      triggerFileDownload(
        `${challenge.id}_dataset.csv`,
        `SKU_ID,Warehouse_ID,Monthly_Demand_Units,Lead_Time_Days,Unit_Cost_BDT,Safety_Stock_Recommended\nSKU-1001,DHAKA-CENTRAL,45000,12,350,5400\nSKU-1002,CTG-PORT,82000,18,1200,12300\n`,
        "text/csv"
      );
      return;
    }

    const csvContent = [
      datasetHeaders.join(","),
      ...datasetRows.map(row => datasetHeaders.map(h => `"${row[h] ?? ""}"`).join(","))
    ].join("\n");

    triggerFileDownload(`${challenge.id}_dataset.csv`, csvContent, "text/csv");
  };

  // Real AI Evaluation Trigger
  const handleTriggerAIEvaluation = async () => {
    if (!caseSubmission.trim() && Object.keys(selectedAnswers).length === 0) {
      alert("Please provide an analytical submission text or complete the diagnostic quiz questions before evaluating.");
      return;
    }

    setIsEvaluating(true);
    setEvalStep(1);

    const stepInterval = setInterval(() => {
      setEvalStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch("/api/ai/evaluate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          category: challenge.category,
          quizAnswers: selectedAnswers,
          quizQuestions: quizQuestions.map(q => ({ id: q.id, question: q.question, correct: q.correct })),
          caseSubmission: caseSubmission.trim() || "Completed diagnostic quiz questions with baseline quantitative recommendations.",
          timeSpentSeconds: 45 * 60 - timerSeconds,
        }),
      });

      const data = await response.json();
      const evalRes: EvaluationResult = data.evaluation;

      clearInterval(stepInterval);
      setEvalStep(4);

      setTimeout(() => {
        setIsEvaluating(false);
        setEvaluationResult(evalRes);
        setActiveTab("evaluation");

        const earnedXp = evalRes.score >= 80 ? 250 : 150;
        completeChallenge(challenge.id, earnedXp, challenge.title);

        addNotification({
          type: "achievement",
          title: `Challenge Evaluated: Score ${evalRes.score}/100`,
          message: `Your submission for "${challenge.title}" was benchmarked by AI. Earned +${earnedXp} XP.`,
        });

        localStorage.setItem(
          `challenge_eval_${challenge.id}`,
          JSON.stringify({
            evaluation: evalRes,
            caseSubmission,
            selectedAnswers,
          })
        );
      }, 600);

    } catch (err) {
      console.error("AI Evaluation error:", err);
      clearInterval(stepInterval);
      setIsEvaluating(false);
    }
  };

  const handleDownloadCertificate = () => {
    const certText = `
===================================================================
                INSYT VERIFIED COMPETITION CERTIFICATE
===================================================================
Candidate Name: ${state.name}
Challenge Title: ${challenge.title}
Host Entity: ${challenge.hostEntity}
Category: ${challenge.category}
Date Completed: ${new Date().toLocaleDateString()}
AI Evaluation Score: ${evaluationResult?.score ?? 90}/100 (Grade: ${evaluationResult?.grade ?? "A+"})
Employer Verdict: ${evaluationResult?.employerVerdict ?? "RECOMMENDED FOR PPI INTERVIEW"}

Verification Hash: INSYT-CERT-${challenge.id.toUpperCase()}-${Date.now()}
===================================================================
    `;
    triggerFileDownload(`${challenge.id}_verified_certificate.txt`, certText, "text/plain");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-8 font-sans pb-24">

      {/* TOP HEADER & BREADCRUMB BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-corp-border">
        <div className="flex items-start gap-3">
          <Link
            href="/challenges"
            className="mt-1 w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-corp-bg-secondary hover:bg-corp-border border border-corp-border text-corp-text-secondary cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Zap size={11} className="fill-amber-500" /> {challenge.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                {challenge.difficulty}
              </span>
              {challenge.ppoOffered && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Trophy size={11} /> PPI Offer Included
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "var(--corp-text)" }}>
              {challenge.title}
            </h1>
            <p className="text-xs font-semibold text-corp-text-tertiary">
              Host: <span className="text-corp-accent font-bold">{challenge.hostEntity}</span> · Registered: {challenge.registeredCount.toLocaleString()} Candidates
            </p>
          </div>
        </div>

        {/* Action Controls & Timer */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Timer Widget */}
          <div className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono font-bold transition-all",
            timerSeconds < 300 
              ? "bg-rose-500/10 border-rose-500/40 text-rose-500 animate-pulse" 
              : "bg-corp-surface border-corp-border text-corp-text-secondary"
          )}>
            <Clock size={15} className={timerSeconds < 300 ? "text-rose-500" : "text-amber-500"} />
            <span>{formatTimer(timerSeconds)}</span>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)} 
              className="hover:opacity-75 transition-opacity ml-1 cursor-pointer"
              title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
            >
              {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>

          {/* Completion Badge */}
          {isCompletedAlready ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs">
              <CheckCircle2 size={16} /> Completed ({evaluationResult?.score ?? 100}/100)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 text-amber-600 font-bold text-xs border border-amber-500/20">
              <Award size={15} /> Reward: +250 XP
            </div>
          )}
        </div>
      </div>

      {/* WORKSPACE TAB NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-corp-bg-secondary border border-corp-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("brief")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "brief" 
              ? "bg-corp-surface text-corp-text shadow-sm border border-corp-border" 
              : "text-corp-text-tertiary hover:text-corp-text"
          )}
        >
          <FileText size={15} className="text-blue-500" />
          <span>1. Brief &amp; Telemetry Data</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "quiz" 
              ? "bg-corp-surface text-corp-text shadow-sm border border-corp-border" 
              : "text-corp-text-tertiary hover:text-corp-text"
          )}
        >
          <HelpCircle size={15} className="text-amber-500" />
          <span>2. Diagnostic Strategy Check</span>
          {Object.keys(selectedAnswers).length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {Object.keys(selectedAnswers).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("submission")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "submission" 
              ? "bg-corp-surface text-corp-text shadow-sm border border-corp-border" 
              : "text-corp-text-tertiary hover:text-corp-text"
          )}
        >
          <BrainCircuit size={15} className="text-purple-500" />
          <span>3. Analytical Solution Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab("evaluation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "evaluation" 
              ? "bg-corp-surface text-corp-text shadow-sm border border-corp-border" 
              : "text-corp-text-tertiary hover:text-corp-text"
          )}
        >
          <Trophy size={15} className="text-emerald-500" />
          <span>4. AI Evaluation &amp; Report</span>
          {evaluationResult && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
              {evaluationResult.score}/100
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: BRIEF & DATASET VIEWER */}
      {activeTab === "brief" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl border space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-corp-accent flex items-center gap-2">
                  <ShieldCheck size={16} /> Official Challenge Brief
                </h3>
                <span className="text-[10px] font-mono font-bold text-corp-text-tertiary">VERIFIED TASK</span>
              </div>
              
              <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                {challenge.description}
              </p>

              {challenge.casePrompt && (
                <div className="p-4 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider block">Key Deliverables Required:</span>
                  <p className="text-xs font-medium text-corp-text leading-relaxed">
                    {challenge.casePrompt}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t space-y-3 text-xs font-mono" style={{ borderColor: "var(--corp-border)" }}>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Estimated Duration:</span>
                  <span className="font-bold text-corp-text">{challenge.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Prize / Reward Pool:</span>
                  <span className="font-extrabold text-amber-500">{challenge.prize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Team Format:</span>
                  <span className="font-bold text-corp-text">{challenge.teamSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Entry Fee:</span>
                  <span className="font-bold text-emerald-500">{challenge.fee}</span>
                </div>
              </div>
            </div>

            {/* Dataset Download Card */}
            <div className="p-6 rounded-3xl border space-y-3 bg-gradient-to-br from-amber-500/5 to-corp-accent/5 border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Download size={16} /> Dataset File (.CSV)
                </span>
                <span className="text-[10px] font-mono text-amber-500">{datasetRows.length} Rows</span>
              </div>
              <p className="text-xs text-corp-text-secondary leading-relaxed font-medium">
                Download the anonymized telemetry dataset to analyze in Excel, Python, or SQL.
              </p>
              <button
                onClick={handleDownloadDataset}
                className="w-full py-3 rounded-2xl font-extrabold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={15} /> Download CSV Dataset
              </button>
            </div>
          </div>

          {/* Interactive Data Table Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl border space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-corp-border">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                    <Table size={18} className="text-corp-accent" /> Telemetry Data Table Preview
                  </h3>
                  <p className="text-xs text-corp-text-tertiary">Live preview of challenge parameters and sample telemetry rows</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter dataset rows..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-3 pr-3 py-1.5 text-xs rounded-xl bg-corp-bg-secondary border border-corp-border text-corp-text focus:outline-none focus:ring-1 focus:ring-corp-accent"
                  />
                </div>
              </div>

              {/* Table Render */}
              <div className="overflow-x-auto rounded-2xl border border-corp-border">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-corp-bg-secondary border-b border-corp-border text-corp-text-secondary uppercase text-[10px] tracking-wider">
                    <tr>
                      {datasetHeaders.map((header) => (
                        <th key={header} className="p-3 font-extrabold">{header.replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-corp-border">
                    {filteredDatasetRows.length > 0 ? (
                      filteredDatasetRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-corp-bg-secondary/50 transition-colors">
                          {datasetHeaders.map((h) => (
                            <td key={h} className="p-3 text-corp-text font-medium whitespace-nowrap">
                              {String(row[h] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={datasetHeaders.length || 1} className="p-6 text-center text-corp-text-tertiary">
                          No matching dataset records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-corp-text-tertiary pt-2">
                <span>Showing {filteredDatasetRows.length} of {datasetRows.length} sample entries</span>
                <button 
                  onClick={() => setActiveTab("quiz")}
                  className="font-extrabold text-corp-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Proceed to Diagnostic Strategy Check <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIAGNOSTIC STRATEGY QUIZ */}
      {activeTab === "quiz" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border space-y-6" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
            <div className="flex items-center justify-between pb-4 border-b border-corp-border">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <HelpCircle size={20} className="text-amber-500" /> Part 1: Diagnostic Strategy Check
                </h3>
                <p className="text-xs text-corp-text-tertiary">Verify core conceptual knowledge and formulas before drafting your executive deliverable.</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {Object.keys(selectedAnswers).length}/{quizQuestions.length} Answered
              </span>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isSelectedCorrect = selectedAnswers[q.id] === q.correct;

                return (
                  <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-extrabold leading-snug" style={{ color: "var(--corp-text)" }}>
                        Question {idx + 1}: {q.question}
                      </h4>
                      {isAnswered && (
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border flex items-center gap-1 flex-shrink-0",
                          isSelectedCorrect 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        )}>
                          {isSelectedCorrect ? <Check size={12} /> : null} Recorded
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {q.options.map((opt) => {
                        const isThisSelected = selectedAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between cursor-pointer",
                              isThisSelected
                                ? "bg-corp-accent text-white border-corp-accent shadow-md"
                                : "bg-corp-surface hover:border-corp-accent/50 text-corp-text-secondary border-corp-border"
                            )}
                          >
                            <span>{opt}</span>
                            {isThisSelected && <CheckCircle2 size={16} className="text-white flex-shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3.5 rounded-xl bg-corp-surface border border-corp-border text-xs text-corp-text-secondary space-y-1"
                      >
                        <span className="font-extrabold text-corp-accent text-[10px] uppercase tracking-wider block">Explanation Insight:</span>
                        <p>{q.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-corp-border">
              <button
                onClick={() => setActiveTab("brief")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-corp-text-secondary hover:bg-corp-bg-secondary cursor-pointer"
              >
                Back to Brief
              </button>

              <button
                onClick={() => setActiveTab("submission")}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Analytical Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICAL SOLUTION WORKSPACE */}
      {activeTab === "submission" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border space-y-5" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
              <div className="flex items-center justify-between pb-4 border-b border-corp-border">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                    <BrainCircuit size={20} className="text-purple-500" /> Part 2: Executive Analytical Deliverable
                  </h3>
                  <p className="text-xs text-corp-text-tertiary">Draft your structured analysis, formula calculations, and strategic recommendations for host evaluation.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFormulaSheet(!showFormulaSheet)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-corp-bg-secondary border border-corp-border text-corp-accent hover:bg-corp-border flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb size={14} /> Formulas Cheat Sheet
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-corp-text-tertiary font-mono">
                  <span>Executive Submission Text</span>
                  <span>{caseSubmission.trim().split(/\s+/).filter(Boolean).length} Words · {caseSubmission.length} Characters</span>
                </div>

                <textarea
                  value={caseSubmission}
                  onChange={(e) => setCaseSubmission(e.target.value)}
                  placeholder="Write your analytical deliverable here...

Example Structure:
1. Executive Summary & Core Calculations: (e.g. Reorder Point = 23,400 units based on 12-day lead time demand + 5,400 safety stock).
2. Operational Impact & Risk Mitigation: (e.g. Cuts stockouts by 34% while saving ৳1.4M in annual holding costs).
3. Strategic Next Steps for Distribution Network..."
                  className="w-full h-80 p-5 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-corp-accent/40 resize-none transition-all"
                  style={{ background: "var(--corp-bg-secondary)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                />
              </div>

              {showFormulaSheet && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 text-corp-text"
                >
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 block flex items-center gap-1.5">
                    <Lightbulb size={14} /> Benchmark Formula Cheat Sheet:
                  </span>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-corp-text-secondary">
                    <li><strong>Reorder Point (ROP):</strong> (Daily Demand x Lead Time Days) + Safety Stock</li>
                    <li><strong>Safety Stock (SS):</strong> Z-score x Standard Deviation of Lead Time Demand</li>
                    <li><strong>WAPE Forecast Error:</strong> (Sum |Actual - Forecast| / Sum Actual) x 100%</li>
                    <li><strong>Holding Cost Savings:</strong> (Old Buffer Units - New Buffer Units) x Unit Holding Cost BDT</li>
                  </ul>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-corp-border">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Sparkles size={14} /> {showHint ? "Hide AI Hint" : "Get AI Hint"}
                </button>

                <button
                  onClick={handleTriggerAIEvaluation}
                  disabled={isEvaluating || (!caseSubmission.trim() && Object.keys(selectedAnswers).length === 0)}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl font-extrabold text-xs text-white bg-corp-accent hover:bg-corp-accent-hover shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Evaluating Submission...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit for AI Evaluation &amp; Award (+250 XP)</span>
                    </>
                  )}
                </button>
              </div>

              {showHint && challenge.hints && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-700 dark:text-purple-300 space-y-1"
                >
                  <span className="font-extrabold block">AI Evaluator Guidance Hint:</span>
                  {challenge.hints.map((hint, idx) => (
                    <p key={idx}>• {hint}</p>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl border space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-corp-text flex items-center gap-2">
                <BarChart3 size={16} className="text-corp-accent" /> Evaluation Rubric Criteria
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-1">
                  <div className="flex justify-between font-extrabold text-corp-text">
                    <span>1. Analytical Rigor</span>
                    <span className="text-corp-accent">25 Pts</span>
                  </div>
                  <p className="text-[11px] text-corp-text-tertiary">Correct mathematical formulas, numerical accuracy, dataset reference.</p>
                </div>

                <div className="p-3 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-1">
                  <div className="flex justify-between font-extrabold text-corp-text">
                    <span>2. Business Impact</span>
                    <span className="text-corp-accent">25 Pts</span>
                  </div>
                  <p className="text-[11px] text-corp-text-tertiary">Clear BDT financial impact, cost savings, service level expansion.</p>
                </div>

                <div className="p-3 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-1">
                  <div className="flex justify-between font-extrabold text-corp-text">
                    <span>3. Operational Feasibility</span>
                    <span className="text-corp-accent">25 Pts</span>
                  </div>
                  <p className="text-[11px] text-corp-text-tertiary">Real-world logistics timelines, lead-time buffers, vendor management.</p>
                </div>

                <div className="p-3 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-1">
                  <div className="flex justify-between font-extrabold text-corp-text">
                    <span>4. Executive Presentation</span>
                    <span className="text-corp-accent">25 Pts</span>
                  </div>
                  <p className="text-[11px] text-corp-text-tertiary">Concise corporate vocabulary, structured headings, bullet clarity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI EVALUATION & BENCHMARK REPORT */}
      {activeTab === "evaluation" && (
        <div className="space-y-8">
          {evaluationResult ? (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-corp-surface via-corp-surface to-emerald-500/5" style={{ borderColor: "var(--corp-border)" }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      <Trophy size={14} /> AI EVALUATION COMPLETE
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--corp-text)" }}>
                      {evaluationResult.employerVerdict}
                    </h2>

                    <p className="text-xs text-corp-text-secondary max-w-2xl leading-relaxed">
                      {evaluationResult.summary}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-corp-bg-secondary border border-corp-border flex-shrink-0 min-w-[180px]">
                    <span className="text-4xl font-black text-emerald-500">{evaluationResult.score}/100</span>
                    <span className="text-xs font-extrabold text-corp-text-tertiary uppercase mt-1">Grade {evaluationResult.grade}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      +250 XP Awarded
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-corp-text flex items-center gap-2">
                    <BarChart3 size={18} className="text-corp-accent" /> Rubric Score Breakdown
                  </h3>

                  <div className="p-6 rounded-3xl border space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Analytical Rigor</span>
                          <span>{evaluationResult.rubric.analyticalRigor}/25</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-corp-bg-secondary overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${(evaluationResult.rubric.analyticalRigor / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Business Impact</span>
                          <span>{evaluationResult.rubric.businessImpact}/25</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-corp-bg-secondary overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${(evaluationResult.rubric.businessImpact / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Operational Feasibility</span>
                          <span>{evaluationResult.rubric.executionFeasibility}/25</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-corp-bg-secondary overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${(evaluationResult.rubric.executionFeasibility / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Executive Presentation</span>
                          <span>{evaluationResult.rubric.executiveClarity}/25</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-corp-bg-secondary overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${(evaluationResult.rubric.executiveClarity / 25) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl border space-y-3 bg-emerald-500/5 border-emerald-500/20">
                      <h4 className="font-extrabold text-xs uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Key Analytical Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-corp-text-secondary leading-relaxed">
                        {evaluationResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-3xl border space-y-3 bg-rose-500/5 border-rose-500/20">
                      <h4 className="font-extrabold text-xs uppercase text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <AlertCircle size={16} /> Key Areas for Improvement
                      </h4>
                      <ul className="space-y-2 text-xs text-corp-text-secondary leading-relaxed">
                        {evaluationResult.flaws.map((flaw, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{flaw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl border space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
                    <h4 className="font-extrabold text-sm flex items-center gap-2 text-corp-accent">
                      <Eye size={18} /> Employer Benchmark Solution &amp; Insights
                    </h4>
                    
                    <p className="text-xs text-corp-text-secondary leading-relaxed">
                      {evaluationResult.benchmarkComparison}
                    </p>

                    {challenge.benchmarkSolution && (
                      <div className="p-4 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-1.5 text-xs font-mono">
                        <span className="font-extrabold text-corp-accent text-[10px] uppercase tracking-wider block">Official Employer Benchmark Model:</span>
                        <p className="text-corp-text font-medium leading-relaxed">
                          {challenge.benchmarkSolution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border bg-corp-bg-secondary border-corp-border">
                    <div>
                      <h4 className="text-sm font-extrabold text-corp-text">Claim Verified Competition Certificate</h4>
                      <p className="text-xs text-corp-text-tertiary">Verified completion record indexed to your INSYT Talent Passport.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDownloadCertificate}
                        className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-corp-accent hover:bg-corp-accent-hover shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Download size={14} /> Download Certificate (.TXT/.PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl border text-center space-y-4" style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>
              <BrainCircuit size={48} className="mx-auto text-corp-accent opacity-50" />
              <h3 className="text-lg font-bold" style={{ color: "var(--corp-text)" }}>No AI Evaluation Available Yet</h3>
              <p className="text-xs text-corp-text-tertiary max-w-md mx-auto">
                Complete Part 1 diagnostic questions and submit your Part 2 deliverable to generate your AI Evaluation Report.
              </p>
              <button
                onClick={() => setActiveTab("submission")}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-corp-accent cursor-pointer"
              >
                Go to Analytical Workspace
              </button>
            </div>
          )}
        </div>
      )}

      {/* LIVE EVALUATION MODAL OVERLAY */}
      <AnimatePresence>
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="max-w-md w-full rounded-3xl p-8 space-y-6 text-center shadow-2xl border-2 border-corp-accent"
              style={{ background: "var(--corp-surface)" }}
            >
              <div className="w-16 h-16 rounded-full bg-corp-accent/10 border border-corp-accent/30 flex items-center justify-center mx-auto text-corp-accent">
                <RefreshCw size={28} className="animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black" style={{ color: "var(--corp-text)" }}>
                  INSYT AI Evaluator Active
                </h3>
                <p className="text-xs text-corp-text-secondary">
                  Benchmarking submission against employer standards...
                </p>
              </div>

              <div className="space-y-3 text-left font-mono text-xs">
                <div className={cn("flex items-center gap-2 transition-opacity", evalStep >= 1 ? "opacity-100 text-corp-text" : "opacity-40 text-corp-text-tertiary")}>
                  {evalStep > 1 ? <Check size={14} className="text-emerald-500" /> : <RefreshCw size={14} className="animate-spin text-corp-accent" />}
                  <span>1. Parsing submission text &amp; parameters</span>
                </div>

                <div className={cn("flex items-center gap-2 transition-opacity", evalStep >= 2 ? "opacity-100 text-corp-text" : "opacity-40 text-corp-text-tertiary")}>
                  {evalStep > 2 ? <Check size={14} className="text-emerald-500" /> : evalStep === 2 ? <RefreshCw size={14} className="animate-spin text-corp-accent" /> : <Clock size={14} />}
                  <span>2. Benchmarking against employer data models</span>
                </div>

                <div className={cn("flex items-center gap-2 transition-opacity", evalStep >= 3 ? "opacity-100 text-corp-text" : "opacity-40 text-corp-text-tertiary")}>
                  {evalStep > 3 ? <Check size={14} className="text-emerald-500" /> : evalStep === 3 ? <RefreshCw size={14} className="animate-spin text-corp-accent" /> : <Clock size={14} />}
                  <span>3. Running multi-dimensional rubric evaluation</span>
                </div>

                <div className={cn("flex items-center gap-2 transition-opacity", evalStep >= 4 ? "opacity-100 text-corp-text" : "opacity-40 text-corp-text-tertiary")}>
                  {evalStep >= 4 ? <Check size={14} className="text-emerald-500" /> : <Clock size={14} />}
                  <span>4. Finalizing score &amp; XP rewards</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
