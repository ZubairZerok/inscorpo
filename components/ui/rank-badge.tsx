"use client";

import React from "react";

export interface RankInfo {
  name: string;
  minXp: number;
  color: string;
  textColor: string;
  shadowColor: string;
  gradient: string;
}

export const RANKS: RankInfo[] = [
  {
    name: "Bronze",
    minXp: 0,
    color: "#CD7F32",
    textColor: "#FFFFFF",
    shadowColor: "#7C4A1A",
    gradient: "linear-gradient(135deg, #CD7F32 0%, #A0522D 50%, #8B4513 100%)",
  },
  {
    name: "Silver",
    minXp: 2500,
    color: "#9CA3AF",
    textColor: "#1F2937",
    shadowColor: "#4B5563",
    gradient: "linear-gradient(135deg, #F3F4F6 0%, #9CA3AF 50%, #6B7280 100%)",
  },
  {
    name: "Gold",
    minXp: 7500,
    color: "#F59E0B",
    textColor: "#78350F",
    shadowColor: "#B45309",
    gradient: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)",
  },
  {
    name: "Platinum",
    minXp: 15000,
    color: "#38BDF8",
    textColor: "#0C4A6E",
    shadowColor: "#0284C7",
    gradient: "linear-gradient(135deg, #BAE6FD 0%, #38BDF8 50%, #0284C7 100%)",
  },
  {
    name: "Diamond",
    minXp: 30000,
    color: "#818CF8",
    textColor: "#FFFFFF",
    shadowColor: "#4338CA",
    gradient: "linear-gradient(135deg, #C7D2FE 0%, #818CF8 50%, #4F46E5 100%)",
  },
  {
    name: "Elite",
    minXp: 50000,
    color: "#F97316",
    textColor: "#FFFFFF",
    shadowColor: "#C2410C",
    gradient: "linear-gradient(135deg, #FED7AA 0%, #F97316 50%, #EA580C 100%)",
  },
  {
    name: "Legend",
    minXp: 100000,
    color: "#EC4899",
    textColor: "#FFFFFF",
    shadowColor: "#9D174D",
    gradient: "linear-gradient(135deg, #FBCFE8 0%, #EC4899 50%, #BE185D 100%)",
  },
];

export function getRankInfo(xp: number): { current: RankInfo; next: RankInfo | null; progress: number } {
  const current = [...RANKS].reverse().find((r) => xp >= r.minXp) || RANKS[0];
  const nextIdx = RANKS.findIndex((r) => r.name === current.name) + 1;
  const next = RANKS[nextIdx] || null;
  const progress = next
    ? Math.min(Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100), 100)
    : 100;
  return { current, next, progress };
}

/** Returns the most readable text color for a given bg hex or rank name */
export function getContrastColor(hexBg: string): string {
  // Bronze rank is strictly white text
  if (
    hexBg.toLowerCase().includes("cd7f32") ||
    hexBg.toLowerCase().includes("a0522d") ||
    hexBg.toLowerCase().includes("8b4513")
  ) {
    return "#FFFFFF";
  }
  const cleanHex = hexBg.startsWith("#") ? hexBg.slice(1) : hexBg;
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.65 ? "#1F2937" : "#FFFFFF";
  }
  return "#FFFFFF";
}

interface RankBadgeProps {
  rank: RankInfo;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  xs: { outer: 24, labelSize: "text-[8px]" },
  sm: { outer: 36, labelSize: "text-[9px]" },
  md: { outer: 48, labelSize: "text-[10px]" },
  lg: { outer: 64, labelSize: "text-[11px]" },
};

export function RankBadge({ rank, size = "md", showLabel = false, className = "" }: RankBadgeProps) {
  const s = SIZES[size];

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg
        width={s.outer}
        height={s.outer}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 3px 6px ${rank.shadowColor}aa)` }}
      >
        <defs>
          <linearGradient id={`grad-${rank.name}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rank.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || rank.color} />
            <stop offset="50%" stopColor={rank.color} />
            <stop offset="100%" stopColor={rank.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[2] || rank.shadowColor} />
          </linearGradient>
          <radialGradient id={`glow-${rank.name}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Hexagonal Shield with shadow border */}
        <path
          d="M30 4 L52 16 L52 36 Q52 50 30 56 Q8 50 8 36 L8 16 Z"
          fill={`url(#grad-${rank.name})`}
          stroke={rank.shadowColor}
          strokeWidth="2"
        />

        {/* Inner Highlight Layer */}
        <path
          d="M30 8 L47 18 L47 35 Q47 45 30 50 Q13 45 13 35 L13 18 Z"
          fill={`url(#glow-${rank.name})`}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
        />

        {/* Center Star Emblem (NO TEXT inside medal icon) */}
        <path
          d="M30 18 L33.2 24.8 L40.6 25.8 L35.3 31 L36.5 38.3 L30 34.8 L23.5 38.3 L24.7 31 L19.4 25.8 L26.8 24.8 Z"
          fill="rgba(255,255,255,0.92)"
          stroke={rank.shadowColor}
          strokeWidth="0.8"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
        />
      </svg>
      {showLabel && (
        <span className={`font-mono font-black uppercase tracking-wider ${s.labelSize}`} style={{ color: rank.color }}>
          {rank.name}
        </span>
      )}
    </div>
  );
}

/** Inline rank pill for use inside cards/headers */
export function RankPill({
  rank,
  xp,
  level,
  className = "",
}: {
  rank: RankInfo;
  xp: number;
  level: number;
  className?: string;
}) {
  const textCol = getContrastColor(rank.color);
  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-mono font-extrabold uppercase flex items-center gap-2 ${className}`}
      style={{
        background: rank.gradient,
        color: textCol,
        boxShadow: `0 2px 8px ${rank.shadowColor}55`,
        border: `1px solid ${rank.shadowColor}66`,
      }}
    >
      <RankBadge rank={rank} size="xs" />
      <span>
        Level {level} · {rank.name} Rank
      </span>
      <span className="opacity-80 font-bold text-[10px]">({xp.toLocaleString()} XP)</span>
    </div>
  );
}
