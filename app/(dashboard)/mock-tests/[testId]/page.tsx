"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, AlertTriangle, CheckCircle2, Award, ChevronRight,
  TrendingUp, Activity, HelpCircle, XCircle, RotateCcw, Flag, Maximize2,
  Minimize2, Check, Sparkles, ShieldCheck, BarChart3, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";
import { MOCK_TESTS_DATABASE, MockTestDetail, Question } from "@/lib/data/mock-tests-db";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export default function MockTestSolverPage(props: PageProps) {
  const params = use(props.params);
  const testId = params?.testId || "bb-ad-full-mock";
  const testData: MockTestDetail = MOCK_TESTS_DATABASE[testId] || MOCK_TESTS_DATABASE["bb-ad-full-mock"];
  const { addXP, addNotification } = useUser();

  // State Controls
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(testData.durationMins * 60);
  const [examFinished, setExamFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Score Analytics State
  const [scoreSummary, setScoreSummary] = useState<{
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    netScore: number;
    accuracyPercent: number;
    percentileRank: number;
    xpEarned: number;
  } | null>(null);

  // Timer Countdown Loop
  useEffect(() => {
    if (!examStarted || examFinished) return;

    if (timeLeft <= 0) {
      handleFinishExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examFinished]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setTimeLeft(testData.durationMins * 60);
    setExamFinished(false);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIdx(0);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
  };

  const handleToggleFlag = (idx: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFinishExam = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }

    setExamFinished(true);

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    testData.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === undefined) {
        unanswered++;
      } else if (chosen === q.correct) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const totalQuestions = testData.questions.length;
    const penaltyPerError = testData.negativeMarking;
    const netPoints = Math.max(0, correct * 1.0 - incorrect * penaltyPerError);
    const accuracy = Math.round((netPoints / totalQuestions) * 100);

    let percentile = 50;
    if (accuracy >= 90) percentile = 98;
    else if (accuracy >= 75) percentile = 88;
    else if (accuracy >= 60) percentile = 74;
    else if (accuracy >= 40) percentile = 55;
    else percentile = 35;

    const xpEarned = Math.round((accuracy / 100) * testData.xpReward);

    const summary = {
      correctCount: correct,
      incorrectCount: incorrect,
      unansweredCount: unanswered,
      netScore: Math.round(netPoints * 100) / 100,
      accuracyPercent: accuracy,
      percentileRank: percentile,
      xpEarned,
    };

    setScoreSummary(summary);

    if (xpEarned > 0) {
      addXP(xpEarned, `Completed Mock Test: ${testData.title}`);
      addNotification({
        type: "achievement",
        title: "Mock Test Results Compiled!",
        message: `Scored ${accuracy}% on ${testData.title}. +${xpEarned} XP awarded!`,
      });
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  const currentQ = testData.questions[currentQuestionIdx];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-16">
      {/* Back button */}
      {!examStarted && (
        <Link
          href="/mock-tests"
          className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase transition-colors hover:text-[#2563eb]"
          style={{ color: "var(--corp-text-secondary)" }}
        >
          <ArrowLeft size={14} /> Back to Assessment Hub
        </Link>
      )}

      {/* Instructions & Launch Screen */}
      {!examStarted && (
        <div
          className="p-6 md:p-8 rounded-2xl space-y-6 border-2 border-corp-border shadow-[6px_6px_0px_0px_#2563eb] font-mono"
          style={{ background: "var(--corp-surface)" }}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                {testData.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-corp-bg-secondary text-corp-text border border-corp-border">
                {testData.difficulty}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase" style={{ color: "var(--corp-text)" }}>
              {testData.title}
            </h1>
            <p className="text-xs font-sans text-corp-text-secondary leading-relaxed">
              {testData.description}
            </p>
          </div>

          {/* Test Conditions Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl space-y-1 bg-corp-bg-secondary border border-corp-border">
              <Clock size={20} className="text-[#2563eb]" />
              <h3 className="text-xs font-black uppercase text-corp-text">Time Limit</h3>
              <p className="text-xs font-mono font-bold text-corp-text-secondary">{testData.durationMins} Minutes</p>
            </div>

            <div className="p-4 rounded-xl space-y-1 bg-corp-bg-secondary border border-corp-border">
              <AlertTriangle size={20} className="text-rose-500" />
              <h3 className="text-xs font-black uppercase text-corp-text">Negative Marking</h3>
              <p className="text-xs font-mono font-bold text-rose-500">
                {testData.negativeMarking > 0 ? `-${testData.negativeMarking} per error` : "No penalty"}
              </p>
            </div>

            <div className="p-4 rounded-xl space-y-1 bg-corp-bg-secondary border border-corp-border">
              <Award size={20} className="text-amber-500" />
              <h3 className="text-xs font-black uppercase text-corp-text">XP Reward</h3>
              <p className="text-xs font-mono font-bold text-amber-600">+{testData.xpReward} Max XP</p>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-4 rounded-xl text-xs font-mono font-black uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 shadow-[4px_4px_0px_0px_#78350f] cursor-pointer"
          >
            Start Timed Assessment (Full Screen)
          </button>
        </div>
      )}

      {/* Active Exam Solver Workspace */}
      {examStarted && !examFinished && (
        <div className="space-y-4 font-mono">
          {/* Sticky Header Bar */}
          <div
            className="p-4 rounded-xl border-2 border-corp-border shadow-[4px_4px_0px_0px_#2563eb] flex items-center justify-between flex-wrap gap-3"
            style={{ background: "var(--corp-surface)" }}
          >
            <div>
              <span className="text-xs font-black uppercase text-corp-text">
                Question {currentQuestionIdx + 1} of {testData.questions.length}
              </span>
              <span className="text-[11px] font-bold text-corp-text-tertiary ml-2">
                ({testData.title})
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold border-2 border-corp-border bg-corp-bg-secondary text-corp-text hover:bg-corp-surface cursor-pointer"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
              </button>

              {/* Countdown Timer */}
              <div className={cn(
                "flex items-center gap-2 font-mono font-extrabold text-sm px-3.5 py-1.5 rounded-lg border-2",
                timeLeft < 120
                  ? "bg-rose-500/20 text-rose-600 border-rose-500 animate-pulse"
                  : "bg-blue-500/15 text-[#2563eb] border-blue-400"
              )}>
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Finish Exam Button */}
              <button
                onClick={handleFinishExam}
                className="px-4 py-1.5 rounded-lg text-xs font-black uppercase text-white bg-rose-600 hover:bg-rose-700 border-2 border-rose-400 shadow-[2px_2px_0px_0px_#881337] cursor-pointer"
              >
                Finish &amp; Submit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Question Solving Pane */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="p-6 rounded-2xl border-2 border-corp-border shadow-[5px_5px_0px_0px_#2563eb] space-y-5"
                style={{ background: "var(--corp-surface)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-[#2563eb] text-white">
                    {currentQ.category}
                  </span>

                  <button
                    onClick={() => handleToggleFlag(currentQuestionIdx)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-mono font-extrabold uppercase border transition-all flex items-center gap-1.5 cursor-pointer",
                      flaggedQuestions[currentQuestionIdx]
                        ? "bg-purple-600 text-white border-purple-400 shadow-sm"
                        : "bg-corp-bg-secondary text-corp-text-secondary border-corp-border hover:bg-corp-surface"
                    )}
                  >
                    <Flag size={14} className={flaggedQuestions[currentQuestionIdx] ? "fill-white" : ""} />
                    <span>{flaggedQuestions[currentQuestionIdx] ? "Flagged" : "Flag Question"}</span>
                  </button>
                </div>

                <p className="text-sm font-sans font-bold leading-relaxed text-corp-text">
                  {currentQ.question}
                </p>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: optIdx })}
                        className={cn(
                          "w-full flex items-start gap-3 p-4 rounded-xl text-left text-xs font-mono font-bold transition-all border-2 cursor-pointer",
                          isSelected
                            ? "bg-[#2563eb] text-white border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a]"
                            : "bg-corp-bg-secondary text-corp-text border-corp-border hover:bg-corp-surface"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black border",
                          isSelected
                            ? "bg-white text-blue-900 border-white"
                            : "bg-corp-surface text-corp-text border-corp-border"
                        )}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 mt-0.5 leading-normal">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between font-mono">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase border-2 border-corp-border bg-corp-surface text-corp-text disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {currentQuestionIdx < testData.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-black uppercase text-white bg-[#2563eb] border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase text-amber-950 bg-amber-400 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] flex items-center gap-1 cursor-pointer"
                  >
                    Finish Test <Check size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Question Status Palette Sidebar */}
            <div
              className="p-5 rounded-2xl border-2 border-corp-border shadow-[5px_5px_0px_0px_#2563eb] space-y-4 font-mono"
              style={{ background: "var(--corp-surface)" }}
            >
              <h3 className="text-xs font-black uppercase text-corp-text flex items-center gap-2">
                <BarChart3 size={16} className="text-[#2563eb]" /> Question Status Grid
              </h3>

              {/* Question Number Palette Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {testData.questions.map((_, idx) => {
                  const isCurrent = currentQuestionIdx === idx;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];

                  let btnBg = "bg-corp-bg-secondary text-corp-text border-corp-border";
                  if (isCurrent) {
                    btnBg = "bg-[#2563eb] text-white border-blue-400 font-black shadow-md ring-2 ring-blue-300";
                  } else if (isFlagged) {
                    btnBg = "bg-purple-600 text-white border-purple-400 font-black";
                  } else if (isAnswered) {
                    btnBg = "bg-emerald-600 text-white border-emerald-400 font-black";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xs flex items-center justify-center transition-all border-2 relative cursor-pointer",
                        btnBg
                      )}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-corp-border space-y-2 text-[11px] font-bold text-corp-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-[#2563eb] border border-blue-400" />
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-purple-600 border border-purple-400" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-corp-bg-secondary border border-corp-border" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Results Scorecard & Detailed Review */}
      {examFinished && scoreSummary && (
        <div className="space-y-6 font-mono">
          {/* Executive Performance Scorecard Banner */}
          <div
            className="p-6 md:p-8 rounded-3xl space-y-6 border-4 border-amber-400 shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #1e1b4b 50%, #854d0e 100%)",
              color: "#ffffff",
            }}
          >
            <div className="flex items-start justify-between border-b-2 border-dashed border-amber-400/40 pb-5 flex-wrap gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm inline-block">
                  Official Mock Test Analytics
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mt-1">
                  {testData.title}
                </h2>
                <p className="text-xs font-bold text-amber-300">
                  {testData.category} Category Assessment
                </p>
              </div>

              <div className="bg-slate-950/80 border-2 border-amber-400 p-3 rounded-2xl text-center flex-shrink-0 shadow-md">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">NET SCORE</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
                  {scoreSummary.netScore} <span className="text-xs font-bold text-white">/ {testData.questions.length}</span>
                </span>
              </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-400/30">
                <span className="text-[9px] font-black uppercase text-amber-300 block">Accuracy</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">{scoreSummary.accuracyPercent}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-400/30">
                <span className="text-[9px] font-black uppercase text-amber-300 block">Percentile</span>
                <span className="text-xl font-black text-amber-300 mt-0.5 block">{scoreSummary.percentileRank}th</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-400/30">
                <span className="text-[9px] font-black uppercase text-amber-300 block">Correct / Wrong</span>
                <span className="text-sm font-black text-white mt-1 block">
                  <span className="text-emerald-400">{scoreSummary.correctCount}</span> / <span className="text-rose-400">{scoreSummary.incorrectCount}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-400/30">
                <span className="text-[9px] font-black uppercase text-amber-300 block">XP Reward</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">+{scoreSummary.xpEarned} XP</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-dashed border-amber-400/40">
              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase bg-slate-900 text-white hover:bg-slate-800 border-2 border-slate-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} /> Retake Assessment
              </button>

              <Link
                href="/mock-tests"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] text-center cursor-pointer"
              >
                Return to Assessment Hub
              </Link>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-base font-black uppercase text-corp-text flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2563eb]" /> Step-by-Step Question Review
            </h3>

            <div className="space-y-4">
              {testData.questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correct;
                const isUnanswered = userChoice === undefined;

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-corp-border shadow-[4px_4px_0px_0px_#2563eb] space-y-4"
                    style={{ background: "var(--corp-surface)" }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black uppercase text-corp-text-tertiary">
                        Question {idx + 1} · <span className="text-[#2563eb]">{q.category}</span>
                      </span>

                      {isUnanswered ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-800 border border-slate-300">
                          Unanswered (0 pts)
                        </span>
                      ) : isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white border border-emerald-400">
                          Correct (+1.0 pt)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white border border-rose-400">
                          Incorrect (-{testData.negativeMarking} pt)
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-sans font-bold text-corp-text leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options list with correct/incorrect highlighting */}
                    <div className="space-y-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isUserSelected = userChoice === optIdx;
                        const isRightAnswer = q.correct === optIdx;

                        let optStyle = "bg-corp-bg-secondary text-corp-text border-corp-border";
                        if (isRightAnswer) {
                          optStyle = "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-black";
                        } else if (isUserSelected && !isCorrect) {
                          optStyle = "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500 font-black";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "p-3 rounded-xl border flex items-center justify-between font-mono",
                              optStyle
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-extrabold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </span>
                            {isRightAnswer && <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Correct Answer</span>}
                            {isUserSelected && !isRightAnswer && <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-sans space-y-1">
                      <span className="font-black uppercase text-[#2563eb] text-[10px] block">Solution &amp; Explanation</span>
                      <p className="leading-relaxed font-medium">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
