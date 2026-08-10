"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Trophy, BookOpen, ClipboardList, Flame, Gift, Shield, Star, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import { UserState } from "@/lib/state/types";

interface XpExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: UserState;
}

const ranksTable = [
  { name: "Bronze", minXp: "0 XP", color: "bg-amber-800 text-amber-100" },
  { name: "Silver", minXp: "2,500 XP", color: "bg-slate-300 text-slate-900" },
  { name: "Gold", minXp: "7,500 XP", color: "bg-amber-400 text-amber-950" },
  { name: "Platinum", minXp: "15,000 XP", color: "bg-sky-400 text-sky-950" },
  { name: "Diamond", minXp: "30,000 XP", color: "bg-indigo-400 text-indigo-950" },
  { name: "Elite", minXp: "50,000 XP", color: "bg-orange-500 text-white" },
  { name: "Legend", minXp: "100,000 XP", color: "bg-pink-500 text-white" },
];

export function XpExplainerModal({ isOpen, onClose, state }: XpExplainerModalProps) {
  if (!isOpen) return null;

  const nextLevelXp = state.level * 200;
  const prevLevelXp = (state.level - 1) * 200;
  const progressPercent = Math.min(
    Math.round(((state.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100),
    100
  );
  const xpNeeded = Math.max(0, nextLevelXp - state.xp);

  const earnRules = [
    { icon: <BookOpen size={16} className="text-blue-600" />, label: "Complete Course Lessons", xp: "+50 XP", detail: "Per completed video / article lesson" },
    { icon: <ClipboardList size={16} className="text-amber-500" />, label: "Mock Test Mastery", xp: "+75 XP", detail: "Scoring 60%+ on practice exams" },
    { icon: <Flame size={16} className="text-rose-500" />, label: "Daily Check-in Streak", xp: "+25 XP", detail: "Daily login attendance bonus" },
    { icon: <Trophy size={16} className="text-purple-600" />, label: "AI Challenge Submission", xp: "+250 XP", detail: "Passing corporate case evaluation" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 font-mono">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-slate-950 bg-white text-slate-950 p-6 sm:p-8 space-y-6 z-10 shadow-[10px_10px_0px_0px_#f59e0b]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] font-black transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000]">
              <Zap size={16} className="fill-amber-950 text-amber-950" /> XP VELOCITY &amp; LEVEL MULTIPLIER
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
              CAREER XP VELOCITY
            </h2>
            <p className="text-xs font-sans font-bold text-slate-700 leading-relaxed">
              XP (Experience Points) measure your corporate skill velocity. Higher XP levels boost your recruitment passport rank.
            </p>
          </div>

          {/* Level Progress Banner */}
          <div className="p-6 rounded-2xl border-4 border-slate-950 bg-amber-400 text-slate-950 space-y-3 shadow-[6px_6px_0px_0px_#78350f]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-blue-600 text-white border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000]">
                  LEVEL {state.level} CANDIDATE
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 mt-2">
                  TOTAL XP: {state.xp.toLocaleString()} XP
                </h3>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white text-blue-600 border-2 border-slate-950 font-black text-xs shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                <Zap size={14} className="fill-blue-600" /> {xpNeeded} XP to Level {state.level + 1}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="h-4 rounded-xl border-2 border-slate-950 bg-slate-900 p-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-lg bg-blue-600"
                />
              </div>
              <p className="text-[10px] font-black text-slate-900 text-right">
                {progressPercent}% COMPLETE TOWARD LEVEL {state.level + 1}
              </p>
            </div>
          </div>

          {/* How to Earn XP Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" /> HOW TO EARN MAXIMUM XP
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {earnRules.map((rule, i) => (
                <div key={i} className="p-3.5 rounded-2xl border-2 border-slate-950 bg-slate-50 shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-950 flex-shrink-0">
                    {rule.icon}
                  </div>
                  <div>
                    <div className="font-black text-slate-950">{rule.label}</div>
                    <p className="text-xs font-black text-blue-600 font-mono mt-0.5">{rule.xp}</p>
                    <p className="text-[10px] text-slate-600 font-sans font-bold">{rule.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all border-4 border-slate-950 shadow-[6px_6px_0px_0px_#78350f] cursor-pointer"
          >
            CONFIRM &amp; CONTINUE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
