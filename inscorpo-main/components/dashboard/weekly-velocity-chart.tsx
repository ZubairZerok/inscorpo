"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, Zap, Rocket, Trophy } from "lucide-react";

interface WeeklyVelocityChartProps {
  weeklyActivity: number[];
  totalWeeklyMinutes: number;
  dailyAverageMins: number;
  days: string[];
}

export function WeeklyVelocityChart({
  weeklyActivity,
  totalWeeklyMinutes,
  dailyAverageMins,
  days,
}: WeeklyVelocityChartProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const maxActivity = Math.max(...weeklyActivity, 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] p-6 space-y-5 relative overflow-hidden font-sans"
      style={{
        background: "var(--corp-surface)",
        borderColor: "var(--corp-border)",
        boxShadow: "var(--shadow-soft-ui)",
      }}
    >
      {/* Header with Velocity Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-black flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--game-blue-light)" }}>
                <Activity size={16} style={{ color: "var(--game-blue)" }} />
              </div>
              📊 Weekly Learning Velocity
            </h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-extrabold text-white flex items-center gap-1"
              style={{
                background: totalWeeklyMinutes >= 210 ? "var(--game-blue)" : "var(--game-amber)",
              }}
            >
              {totalWeeklyMinutes >= 210
                ? <span className="flex items-center gap-1"><Flame size={13} className="fill-white" /> Supercharged Velocity</span>
                : totalWeeklyMinutes >= 90
                ? <span className="flex items-center gap-1"><Zap size={13} className="fill-white" /> Steady Pace</span>
                : <span className="flex items-center gap-1"><Activity size={13} /> Building Momentum</span>}
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: "var(--corp-text-secondary)" }}>
            Daily average: <strong className="font-bold" style={{ color: "var(--game-blue)" }}>{dailyAverageMins}m/day</strong> · Target: 30m/day (210m weekly)
          </p>
        </div>

        {/* Weekly Goal Progress Widget */}
        <div className="flex items-center gap-3 bg-corp-bg-secondary px-3.5 py-2 rounded-lg border-2 border-corp-border">
          <div className="text-right">
            <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-corp-text-tertiary">Target Goal</p>
            <p className="text-xs font-mono font-extrabold" style={{ color: "var(--corp-text)" }}>{totalWeeklyMinutes} / 210m</p>
          </div>
          <div className="w-10 h-10 rounded-md border-2 border-[#2563eb] flex items-center justify-center font-mono text-xs font-extrabold text-[#2563eb] relative overflow-hidden bg-corp-surface">
            <div
              className="absolute inset-0 bg-[#2563eb]/25"
              style={{ height: `${Math.min(Math.round((totalWeeklyMinutes / 210) * 100), 100)}%` }}
            />
            <span className="relative z-10">{Math.min(Math.round((totalWeeklyMinutes / 210) * 100), 100)}%</span>
          </div>
        </div>
      </div>

      {/* Target Threshold Line Legend & Chart */}
      <div className="relative pt-4">
        {/* Dynamic Target 30m Dotted Line */}
        <div
          className="absolute left-0 right-0 border-b-2 border-dashed border-[#2563eb] z-10 pointer-events-none flex justify-end transition-all duration-300"
          style={{
            bottom: `calc(1.75rem + ${Math.min((30 / maxActivity) * 100, 95)}% * 0.72)`,
          }}
        >
          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-[#2563eb]/20 text-[#2563eb] border border-[#2563eb] -mt-2.5 uppercase">
            30m Target
          </span>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="flex items-end gap-2 md:gap-3 h-36 pt-4 relative z-0">
          {weeklyActivity.map((mins, i) => {
            const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
            const isToday = i === todayIdx;
            const isPeak = mins > 0 && mins === Math.max(...weeklyActivity);
            const isSelected = selectedDayIdx === i;

            return (
              <div
                key={i}
                onClick={() => setSelectedDayIdx(i)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
              >
                {/* Floating Tooltip */}
                <div
                  className={`absolute -top-9 text-[10px] font-mono font-extrabold px-2 py-1 rounded-md transition-all shadow-md whitespace-nowrap z-20 ${
                    isSelected || isToday ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
                  }`}
                  style={{ background: "var(--corp-text)", color: "var(--corp-surface)" }}
                >
                  {days[i]}: {mins} mins {isPeak && "🏆 Peak"}
                </div>

                {/* Peak Day Flame Badge */}
                {isPeak && mins > 0 && (
                  <span className="absolute -top-4 animate-bounce pointer-events-none">
                    <Flame size={14} className="fill-amber-500 text-amber-500" />
                  </span>
                )}

                {/* Bar Container */}
                <div className="w-full flex-1 flex items-end justify-center rounded-lg bg-corp-bg-secondary p-1 border border-corp-border">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: mins === 0 ? 6 : `${(mins / maxActivity) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                    className={`w-full rounded-md transition-all ${
                      isSelected ? "ring-2 ring-[#2563eb]" : ""
                    }`}
                    style={{
                      background: isToday
                        ? "#2563eb"
                        : mins >= 30
                        ? "#1d4ed8"
                        : mins > 0
                        ? "#60a5fa"
                        : "rgba(37,99,235,0.15)",
                    }}
                  />
                </div>

                {/* Day Label */}
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-xs font-mono font-extrabold ${isToday ? "text-[#2563eb]" : "text-corp-text-secondary"}`}
                  >
                    {days[i]}
                  </span>
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Velocity Summary Bar */}
      {selectedDayIdx !== null && (
        <div
          className="p-3.5 rounded-lg bg-corp-bg-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-2 border-corp-border font-mono font-extrabold"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span style={{ color: "var(--corp-text)" }}>
              {days[selectedDayIdx]} Performance:
            </span>
            <span className="text-[#2563eb]">
              {weeklyActivity[selectedDayIdx]} Minutes Active
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--corp-text-tertiary)" }}>
            <span>
              Pace: <strong className="text-corp-text">{Math.round((weeklyActivity[selectedDayIdx] / 30) * 100)}% of Daily Goal</strong>
            </span>
            {selectedDayIdx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) && (
              <span className="px-2 py-0.5 rounded bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb] font-extrabold uppercase tracking-wider text-[9px]">
                Today
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
