"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Clock, Zap, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Trophy, Target, Flame, BarChart3, Brain, Sparkles, Award, RotateCcw,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { cn } from "@/lib/utils";

// ─── Question Bank ────────────────────────────────────────────────────────────

interface DrillQuestion {
  id: number;
  category: string;
  categoryColor: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  tip?: string;
}

const DRILL_QUESTIONS: DrillQuestion[] = [
  {
    id: 1,
    category: "Excel & Data",
    categoryColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    difficulty: "Medium",
    question:
      "You need to look up an employee's salary from a table where employee IDs are in Column A and salaries in Column C. Which Excel formula correctly handles missing matches without throwing an #N/A error?",
    options: [
      "=VLOOKUP(A2, $A:$C, 3, FALSE)",
      "=IFERROR(XLOOKUP(A2, $A:$A, $C:$C), \"Not Found\")",
      "=INDEX($C:$C, MATCH(A2, $A:$A, 0))",
      "=IFERROR(VLOOKUP(A2, $A:$C, 3, TRUE), \"Not Found\")",
    ],
    correct: 1,
    explanation:
      "XLOOKUP is the modern replacement for VLOOKUP — it searches any direction natively, handles missing values gracefully, and wrapping in IFERROR returns 'Not Found' clean string. VLOOKUP with TRUE performs approximate match which causes wrong data matching on exact ID searches.",
    tip: "Always prefer XLOOKUP over VLOOKUP — it is robust against column insertions and deletions.",
  },
  {
    id: 2,
    category: "Corporate Finance",
    categoryColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    difficulty: "Hard",
    question:
      "A company has ৳500M in equity (cost of equity 12%) and ৳300M in interest-bearing debt (cost of debt 8%, corporate tax rate 30%). What is the company's Weighted Average Cost of Capital (WACC)?",
    options: [
      "WACC = 10.50%",
      "WACC = 9.60%",
      "WACC = 10.80%",
      "WACC = 8.62%",
    ],
    correct: 1,
    explanation:
      "WACC = (E/V × Re) + (D/V × Rd × (1 – Tax)). Total Capital V = 500 + 300 = ৳800M. Equity weight E/V = 500/800 = 62.5%. Debt weight D/V = 300/800 = 37.5%. After-tax cost of debt = 8% × (1 – 0.30) = 5.6%. WACC = (0.625 × 12%) + (0.375 × 5.6%) = 7.5% + 2.1% = 9.60%.",
    tip: "Always multiply debt cost by (1 – Tax Rate) to reflect the corporate tax interest shield.",
  },
  {
    id: 3,
    category: "AI Prompting",
    categoryColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    difficulty: "Easy",
    question:
      "You need an LLM to extract financial data from an annual report PDF and output a structured JSON object for automated parsing. Which prompting technique yields the most reliable results?",
    options: [
      "Zero-shot: 'Extract financial data from this report.'",
      "Role + Schema Constraint: 'You are a financial analyst. Extract Revenue, EBITDA, and EPS for FY23/24. Output ONLY valid JSON matching this schema: {year, revenue, ebitda, eps}. No markdown explanations.'",
      "Chain-of-Thought: 'Think step by step and then give me the numbers.'",
      "Few-shot with unstructured text paragraphs as examples.",
    ],
    correct: 1,
    explanation:
      "Combining a explicit Persona Role with exact JSON Schema Output Constraints and strict negative constraints ('No markdown explanations') prevents LLM hallucinations and guarantees valid machine-parseable output.",
    tip: "Explicit format constraints like 'Output ONLY valid JSON' prevent boilerplate chatter from breaking API parsers.",
  },
  {
    id: 4,
    category: "Corporate Case Math",
    categoryColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    difficulty: "Hard",
    question:
      "A retail FMCG company's fixed annual operating overhead is ৳20M, and each product unit sells for ৳500 with a variable cost of ৳300. How many units must be sold to break even?",
    options: [
      "50,000 units",
      "100,000 units",
      "75,000 units",
      "120,000 units",
    ],
    correct: 1,
    explanation:
      "Contribution Margin per unit = Selling Price – Variable Cost = 500 – 300 = ৳200. Break-even quantity = Fixed Costs / Contribution Margin = ৳20,000,000 / ৳200 = 100,000 units.",
    tip: "Break-even Volume = Fixed Operating Expenses / (Price per unit – Variable Cost per unit).",
  },
  {
    id: 5,
    category: "Corporate Strategy",
    categoryColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    difficulty: "Medium",
    question:
      "Select the pair of words that best completes the executive summary: 'Despite initial ________ regarding market entry, the pilot project was remarkably ________, capturing 18% market share within two quarters.'",
    options: [
      "ostentation ... ambiguous",
      "skepticism ... lucrative",
      "flamboyance ... stagnant",
      "solicitation ... obscure",
    ],
    correct: 1,
    explanation:
      "'Skepticism' fits the initial hesitation, while 'lucrative' (profitable/successful) contrasts the initial doubt by explaining the strong 18% market share gain.",
    tip: "Look for contrast pivot words like 'Despite' to signal opposing corporate sentiment.",
  },
  {
    id: 6,
    category: "Power BI Analytics",
    categoryColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    difficulty: "Medium",
    question:
      "In Power BI DAX, what is the primary difference between CALCULATE() and SUMX()?",
    options: [
      "CALCULATE evaluates expressions in a modified filter context, whereas SUMX is an iterator function that computes row-by-row before summing.",
      "SUMX modifies filter context, whereas CALCULATE only works on single columns.",
      "CALCULATE can only process numbers, whereas SUMX works on text columns.",
      "There is no functional difference; they are interchangeable alias functions.",
    ],
    correct: 0,
    explanation:
      "CALCULATE() changes the filter context under which DAX measures execute. SUMX() is an iterator (X-function) that iterates line-by-line over a table, evaluates an expression for each row, and then calculates the sum.",
    tip: "Remember: X-functions in DAX (SUMX, AVERAGEX) are row iterators; CALCULATE is the filter context modifier.",
  },
  {
    id: 7,
    category: "Business Communication",
    categoryColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    difficulty: "Easy",
    question:
      "When emailing executive leadership (C-Suite) with a project status update, which structure yields maximum engagement and response speed?",
    options: [
      "BLUF (Bottom Line Up Front): State recommendation/ask in the first 2 sentences, followed by key metrics, then detailed background bullet points.",
      "Chronological Narrative: Start with project kickoff history, detail week-by-week activities, then state the final question at the end.",
      "Technical Deep-dive: Attach a 40-page PDF report with no email body summary.",
      "Passive Voice Request: Write a long, polite paragraph without clear call-to-action.",
    ],
    correct: 0,
    explanation:
      "BLUF (Bottom Line Up Front) is executive standard. C-Suite leaders scan emails in 5-10 seconds; putting the core decision, risk, or ask in the opening line ensures immediate clarity.",
    tip: "Use BLUF: Decision needed -> 3 key data points -> Detailed appendix below.",
  },
  {
    id: 8,
    category: "Corporate Finance",
    categoryColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    difficulty: "Medium",
    question:
      "Which financial metric measures a company's ability to cover short-term liabilities using only its most liquid assets (excluding inventory)?",
    options: [
      "Current Ratio",
      "Quick Ratio (Acid-Test Ratio)",
      "Debt-to-Equity Ratio",
      "Interest Coverage Ratio",
    ],
    correct: 1,
    explanation:
      "Quick Ratio = (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities. Unlike Current Ratio, Quick Ratio excludes Inventory because inventory cannot always be liquidated immediately without price discounts.",
    tip: "Quick Ratio = (Current Assets – Inventory) / Current Liabilities.",
  },
  {
    id: 9,
    category: "Excel & Data",
    categoryColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    difficulty: "Hard",
    question:
      "In Excel, which formula combination sums sales for product 'Widgets' in the 'East' region where sales quantity is greater than 100 units?",
    options: [
      "=SUMIF(Region, \"East\", Sales)",
      "=SUMIFS(Sales_Range, Region_Range, \"East\", Product_Range, \"Widgets\", Qty_Range, \">100\")",
      "=COUNTIFS(Region_Range, \"East\", Product_Range, \"Widgets\")",
      "=SUMPRODUCT(Region_Range=\"East\" + Product_Range=\"Widgets\")",
    ],
    correct: 1,
    explanation:
      "SUMIFS supports multiple criteria ranges. Syntax is =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...). Criteria for numbers require quotes like \">100\".",
    tip: "In SUMIFS, the sum_range comes FIRST; in SUMIF, the sum_range comes LAST.",
  },
  {
    id: 10,
    category: "AI Prompting",
    categoryColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    difficulty: "Medium",
    question:
      "What is 'Chain-of-Thought' (CoT) prompting, and when is it most effective?",
    options: [
      "Instructing the model to break down complex reasoning into explicit step-by-step intermediate thoughts before giving the final answer; highly effective for math, logic, and multi-step business case analysis.",
      "Chaining multiple AI models together via API webhooks.",
      "Repeating the same prompt 5 times to average the output.",
      "Limiting the AI output to a single word.",
    ],
    correct: 0,
    explanation:
      "Chain-of-Thought (CoT) prompting ('Think step-by-step before answering') forces the model to allocate output tokens to intermediate logical steps, significantly improving accuracy on multi-step reasoning.",
    tip: "Adding 'Let's approach this step by step' boosts reasoning benchmark scores by up to 30%.",
  },
  {
    id: 11,
    category: "GMAT Quant",
    categoryColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    difficulty: "Medium",
    question:
      "A car travels from City A to City B at an average speed of 60 mph and returns along the same route at 40 mph. What is the average speed for the entire round trip?",
    options: [
      "50 mph",
      "48 mph",
      "52 mph",
      "45 mph",
    ],
    correct: 1,
    explanation:
      "Average Speed = Total Distance / Total Time. Let distance = d. Time outbound = d/60, time return = d/40. Total time = d/60 + d/40 = (2d + 3d)/120 = 5d/120 = d/24. Total distance = 2d. Average Speed = 2d / (d/24) = 48 mph. (Harmonic mean formula: 2ab/(a+b) = 2(60)(40)/(100) = 48 mph).",
    tip: "Never average speeds directly (60+40)/2=50 is wrong because more time is spent traveling at the slower speed!",
  },
  {
    id: 12,
    category: "Business Communication",
    categoryColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    difficulty: "Medium",
    question:
      "During a high-stakes client presentation pitch, a stakeholder asks a difficult technical question you do not know the answer to. What is the most professional response?",
    options: [
      "Acknowledge the value of the question, give your high-level perspective, commit to verifying the exact data point with your technical lead, and send a written follow-up by EOD.",
      "Guess an answer confidentially and hope they do not double-check.",
      "Ignore the question and immediately jump to the next slide.",
      "Blame your junior analyst for omitting the data from the deck.",
    ],
    correct: 0,
    explanation:
      "Acknowledging the question, providing high-level context without faking data, and setting a specific follow-up SLA (e.g. 'I will verify with our lead architect and email you by 4 PM') preserves executive credibility and trust.",
    tip: "Credibility is preserved by honesty + commitment to follow up, never by guessing.",
  },
];

const DRILL_XP_REWARD = 25;
const DRILL_DURATION = 5 * 60; // 5 minutes in seconds
const DRILL_ID = "daily-skill-rapid-drill";

// ─── Types ────────────────────────────────────────────────────────────────────

type DrillPhase = "intro" | "quiz" | "results";

interface DailyDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCompletedToday: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = timeLeft / total;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const isLow = timeLeft <= 60;
  const isCritical = timeLeft <= 30;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-corp-bg-secondary" />
        <circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="3"
          stroke={isCritical ? "#ef4444" : isLow ? "#f97316" : "#10b981"}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
      </svg>
      <span className={cn("text-xs font-mono font-bold tabular-nums", isCritical ? "text-red-500" : isLow ? "text-orange-500" : "text-emerald-500")}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

function OptionButton({
  label, text, isSelected, isRevealed, isCorrect, isChosen, onClick
}: {
  label: string; text: string; isSelected: boolean; isRevealed: boolean;
  isCorrect: boolean; isChosen: boolean; onClick: () => void;
}) {
  let bgStyle = "var(--corp-bg-secondary)";
  let borderStyle = "var(--corp-border)";
  let textColor = "var(--corp-text)";

  if (isRevealed) {
    if (isCorrect) { bgStyle = "rgba(16,185,129,0.1)"; borderStyle = "rgba(16,185,129,0.4)"; textColor = "#059669"; }
    else if (isChosen && !isCorrect) { bgStyle = "rgba(239,68,68,0.1)"; borderStyle = "rgba(239,68,68,0.4)"; textColor = "#dc2626"; }
  } else if (isSelected) {
    bgStyle = "var(--corp-accent-light, #eff6ff)";
    borderStyle = "var(--corp-accent)";
  }

  return (
    <motion.button
      whileHover={!isRevealed ? { scale: 1.01, x: 3 } : {}}
      whileTap={!isRevealed ? { scale: 0.99 } : {}}
      onClick={!isRevealed ? onClick : undefined}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-2xl text-left text-[13px] font-medium transition-all duration-200 border",
        isRevealed ? "cursor-default" : "cursor-pointer hover:shadow-sm"
      )}
      style={{ background: bgStyle, borderColor: borderStyle, color: textColor }}
    >
      <span className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold mt-0.5 border transition-colors",
        isRevealed && isCorrect ? "bg-emerald-500 text-white border-emerald-500" :
        isRevealed && isChosen && !isCorrect ? "bg-red-500 text-white border-red-500" :
        isSelected ? "bg-corp-accent text-white border-corp-accent" : "border-corp-border text-corp-text-tertiary"
      )}>
        {label}
      </span>
      <span className="flex-1 leading-relaxed">{text}</span>
      {isRevealed && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />}
      {isRevealed && isChosen && !isCorrect && <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />}
    </motion.button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function DailyDrillModal({ isOpen, onClose, isCompletedToday }: DailyDrillModalProps) {
  const { addXP, addNotification, completeChallenge, state } = useUser();

  const [activeQuestions, setActiveQuestions] = useState<DrillQuestion[]>(DRILL_QUESTIONS.slice(0, 3));
  const [phase, setPhase] = useState<DrillPhase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(DRILL_DURATION);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset & pick 3 random questions on open
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...DRILL_QUESTIONS].sort(() => 0.5 - Math.random());
      setActiveQuestions(shuffled.slice(0, 3));
      setPhase("intro");
      setCurrentQ(0);
      setAnswers({});
      setRevealed({});
      setTimeLeft(DRILL_DURATION);
      setScore(0);
      setXpEarned(0);
      setTimeBonus(0);
      setTimeTaken(0);
    }
  }, [isOpen]);

  // Timer
  useEffect(() => {
    if (phase !== "quiz") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinishDrill(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleStartDrill = () => {
    setPhase("quiz");
    setTimeLeft(DRILL_DURATION);
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleRevealAnswer = () => {
    if (answers[currentQ] === undefined) return;
    setRevealed((prev) => ({ ...prev, [currentQ]: true }));
  };

  const handleNext = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((prev) => prev - 1);
  };

  const handleFinishDrill = useCallback((timedOut = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const remaining = timedOut ? 0 : timeLeft;
    const taken = DRILL_DURATION - remaining;
    setTimeTaken(taken);

    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });

    const finalScore = Math.round((correct / activeQuestions.length) * 100);
    setScore(finalScore);

    // XP calculation: base per correct + time bonus
    const baseXP = correct * 8; // up to 24 XP for answers
    const bonus = remaining > 120 ? 10 : remaining > 60 ? 5 : 1; // speed bonus (max 10)
    const total = Math.min(baseXP + bonus, DRILL_XP_REWARD);
    setTimeBonus(bonus);
    setXpEarned(total);

    // Award XP and update global state (uses completeChallenge to prevent double-award)
    const todayKey = `${DRILL_ID}-${new Date().toISOString().split("T")[0]}`;
    if (!state.completedChallengeIds.includes(todayKey)) {
      completeChallenge(todayKey, total, "5-Minute Corporate Skill Rapid Drill ⚡");
    }

    // Send notification
    addNotification({
      type: "achievement",
      title: `⚡ Daily Drill Complete! +${total} XP`,
      message: `You scored ${finalScore}% on the Corporate Skill Rapid Drill${correct === activeQuestions.length ? " — Perfect score! 🏆" : ""}`,
    });

    setPhase("results");
  }, [answers, timeLeft, activeQuestions, completeChallenge, addNotification, state.completedChallengeIds]);

  const allAnswered = activeQuestions.every((_, idx) => answers[idx] !== undefined);
  const currentQuestion = activeQuestions[currentQ] || activeQuestions[0];
  const answeredCount = Object.keys(answers).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="daily-drill-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md"
        onClick={phase === "intro" || phase === "results" ? onClose : undefined}
      >
        <motion.div
          key="daily-drill-modal"
          initial={{ scale: 0.94, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col"
          style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
          onClick={(e) => e.stopPropagation()}
        >


          {/* ── INTRO PHASE ──────────────────────────────────────────────────── */}
          {phase === "intro" && (
            <div className="relative z-10 p-7 sm:p-8 space-y-6">
              {/* Close */}
              <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-corp-bg-secondary transition-colors" style={{ color: "var(--corp-text-tertiary)" }}>
                <X size={18} />
              </button>

              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Daily Drill
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp" alt="⚡" width={14} height={14} className="object-contain" /> +{DRILL_XP_REWARD} XP
                  </span>
                  {isCompletedToday && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Completed Today
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold" style={{ color: "var(--corp-text)" }}>
                  5-Minute Corporate Skill Rapid Drill
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                  Test your speed and accuracy across 3 high-impact corporate topics. Each question has detailed explanations to accelerate your learning.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Target, label: "Questions", value: "3", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { icon: Clock, label: "Time Limit", value: "5 min", color: "text-corp-accent", bg: "bg-corp-accent/10" },
                  { icon: Zap, label: "XP Reward", value: `+${DRILL_XP_REWARD}`, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="p-4 rounded-2xl text-center border space-y-1.5" style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mx-auto", bg)}>
                      <Icon size={16} className={color} />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--corp-text-tertiary)" }}>{label}</p>
                    <p className={cn("text-lg font-extrabold font-mono", color)}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Topics covered */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--corp-text-tertiary)" }}>Topics Covered Today</p>
                <div className="flex flex-wrap gap-2">
                  {activeQuestions.map((q) => (
                    <span key={q.id} className={cn("px-3 py-1 rounded-full text-[12px] font-bold border", q.categoryColor)}>
                      {q.category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div className="p-4 rounded-2xl border space-y-2 text-xs" style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
                <div className="flex items-start gap-2" style={{ color: "var(--corp-text-secondary)" }}>
                  <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Timer starts immediately. You have <strong>5 minutes</strong> to answer all 3 questions.</span>
                </div>
                <div className="flex items-start gap-2" style={{ color: "var(--corp-text-secondary)" }}>
                  <Sparkles size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>Speed bonus: Complete faster for extra XP. Max <strong>+{DRILL_XP_REWARD} XP</strong> total.</span>
                </div>
                {isCompletedToday && (
                  <div className="flex items-start gap-2 text-amber-600">
                    <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" />
                    <span>You already completed today's drill. You can retry for practice, but XP won't be re-awarded.</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleStartDrill}
                className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group"
              >
                <Zap size={17} className="fill-white/40 group-hover:scale-110 transition-transform" />
                {isCompletedToday ? "Retry for Practice" : "Start 5-Minute Drill"}
                <ChevronRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ── QUIZ PHASE ───────────────────────────────────────────────────── */}
          {phase === "quiz" && (
            <div className="relative z-10 flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b" style={{ borderColor: "var(--corp-border)" }}>
                {/* Progress indicators */}
                <div className="flex items-center gap-2">
                  {activeQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQ(idx)}
                      className={cn(
                        "w-8 h-8 rounded-xl text-[12px] font-bold border flex items-center justify-center transition-all",
                        currentQ === idx
                          ? "bg-corp-accent text-white border-corp-accent"
                          : answers[idx] !== undefined
                          ? revealed[idx]
                            ? answers[idx] === activeQuestions[idx].correct
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-corp-bg-secondary text-corp-text-tertiary border-corp-border"
                      )}
                    >
                      {revealed[idx]
                        ? answers[idx] === activeQuestions[idx].correct
                          ? "✓" : "✗"
                        : idx + 1}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold" style={{ color: "var(--corp-text-tertiary)" }}>
                    {answeredCount}/{activeQuestions.length} answered
                  </span>
                  <TimerRing timeLeft={timeLeft} total={DRILL_DURATION} />
                </div>
              </div>

              {/* Question */}
              <div className="p-6 sm:p-7 space-y-5 flex-1">
                {/* Category & difficulty */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold border", currentQuestion.categoryColor)}>
                    {currentQuestion.category}
                  </span>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold border",
                    currentQuestion.difficulty === "Hard" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                    currentQuestion.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  )}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: "var(--corp-text-tertiary)" }}>
                    Q{currentQ + 1} of {activeQuestions.length}
                  </span>
                </div>

                {/* Question text */}
                <p className="text-[15px] font-semibold leading-relaxed" style={{ color: "var(--corp-text)" }}>
                  {currentQuestion.question}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => (
                    <OptionButton
                      key={idx}
                      label={String.fromCharCode(65 + idx)}
                      text={opt}
                      isSelected={answers[currentQ] === idx}
                      isRevealed={!!revealed[currentQ]}
                      isCorrect={currentQuestion.correct === idx}
                      isChosen={answers[currentQ] === idx}
                      onClick={() => handleSelectAnswer(currentQ, idx)}
                    />
                  ))}
                </div>

                {/* Explanation box (shown after reveal) */}
                <AnimatePresence>
                  {revealed[currentQ] && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl border space-y-2 text-xs leading-relaxed"
                      style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}
                    >
                      <p className="font-extrabold text-emerald-600 flex items-center gap-1.5">
                        <Brain size={13} /> Explanation
                      </p>
                      <p style={{ color: "var(--corp-text-secondary)" }}>{currentQuestion.explanation}</p>
                      {currentQuestion.tip && (
                        <p className="text-corp-accent font-semibold flex items-start gap-1.5 pt-1 border-t" style={{ borderColor: "var(--corp-border)" }}>
                          <Sparkles size={12} className="flex-shrink-0 mt-0.5" />
                          <span><strong>Pro Tip:</strong> {currentQuestion.tip}</span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation footer */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--corp-border)" }}>
                <button
                  onClick={handlePrev}
                  disabled={currentQ === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-40"
                  style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)" }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {/* Check / Reveal button */}
                  {answers[currentQ] !== undefined && !revealed[currentQ] && (
                    <button
                      onClick={handleRevealAnswer}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                    >
                      Check Answer
                    </button>
                  )}

                  {currentQ < DRILL_QUESTIONS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-colors shadow-md"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFinishDrill(false)}
                      disabled={!allAnswered}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap size={14} className="fill-white/40" />
                      Finish & Claim XP
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── RESULTS PHASE ─────────────────────────────────────────────────── */}
          {phase === "results" && (
            <div className="relative z-10 p-7 sm:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl"
                  style={{
                    background: score === 100 ? "linear-gradient(135deg, #10b981, #14b8a6)" :
                                score >= 67 ? "linear-gradient(135deg, #f59e0b, #f97316)" :
                                "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  }}
                >
                  {score === 100 ? <Trophy size={40} className="text-white" /> :
                   score >= 67 ? <Award size={40} className="text-white" /> :
                   <Brain size={40} className="text-white" />}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-extrabold" style={{ color: "var(--corp-text)" }}>
                    {score === 100 ? "🏆 Perfect Score!" : score >= 67 ? "⚡ Great Work!" : "📚 Keep Practicing!"}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--corp-text-secondary)" }}>Daily Drill Complete</p>
                </div>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Accuracy", value: `${score}%`, color: score === 100 ? "text-emerald-500" : score >= 67 ? "text-amber-500" : "text-violet-500", bg: "bg-corp-bg-secondary" },
                  { label: "Time Taken", value: formatTime(timeTaken), color: "text-corp-accent", bg: "bg-corp-bg-secondary" },
                  { label: "XP Earned", value: `+${xpEarned}`, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={cn("p-4 rounded-2xl text-center border space-y-1 border-corp-border", bg)}>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--corp-text-tertiary)" }}>{label}</p>
                    <p className={cn("text-xl font-extrabold font-mono", color)}>{value}</p>
                  </div>
                ))}
              </div>

              {/* XP breakdown */}
              <div className="p-4 rounded-2xl border space-y-2 text-xs" style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
                <p className="font-extrabold" style={{ color: "var(--corp-text)" }}>XP Breakdown</p>
                <div className="space-y-1.5" style={{ color: "var(--corp-text-secondary)" }}>
                  {activeQuestions.map((q, idx) => {
                    const correct = answers[idx] === q.correct;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          {correct ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-red-400" />}
                          Q{idx + 1}: {q.category}
                        </span>
                        <span className={cn("font-mono font-bold", correct ? "text-emerald-600" : "text-corp-text-tertiary")}>
                          {correct ? "+8 XP" : "+0 XP"}
                        </span>
                      </div>
                    );
                  })}
                  {timeBonus > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "var(--corp-border)" }}>
                      <span className="flex items-center gap-1.5">
                        <Flame size={12} className="text-orange-500" />
                        Speed Bonus
                      </span>
                      <span className="font-mono font-bold text-amber-500">+{timeBonus} XP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Question breakdown */}
              <div className="space-y-3">
                <p className="text-[13px] font-extrabold" style={{ color: "var(--corp-text)" }}>Answer Review</p>
                {activeQuestions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correct;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl border space-y-2" style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
                      <div className="flex items-start gap-2">
                        <span className={cn("flex-shrink-0 mt-0.5", isCorrect ? "text-emerald-500" : "text-red-500")}>
                          {isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                        </span>
                        <p className="text-[12px] font-semibold leading-snug" style={{ color: "var(--corp-text)" }}>
                          Q{idx + 1}: {q.question}
                        </p>
                      </div>

                      <div className="pl-5 space-y-1 text-[11px]">
                        {userAnswer !== undefined && !isCorrect && (
                          <p className="text-red-500">
                            ✗ Your answer: {String.fromCharCode(65 + userAnswer)}. {q.options[userAnswer]}
                          </p>
                        )}
                        <p className="text-emerald-600 font-semibold">
                          ✓ Correct: {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                        </p>
                        <p className="leading-relaxed pt-1" style={{ color: "var(--corp-text-secondary)" }}>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setPhase("intro"); }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors hover:bg-corp-bg-secondary"
                  style={{ borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)" }}
                >
                  <RotateCcw size={13} /> Retry
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} />
                  Done — Back to Tests
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
