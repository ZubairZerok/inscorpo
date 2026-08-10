"use client";

import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import Link from "next/link";
import { UserState } from "@/lib/state/types";

const FIRE_EMOJI_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp";
const LIGHTNING_EMOJI_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp";

interface LinkedInAnalyticsBarProps {
  state: UserState;
  onOpenXpModal?: () => void;
  onOpenStreakModal?: () => void;
}

export function LinkedInAnalyticsBar({
  state,
  onOpenXpModal,
  onOpenStreakModal,
}: LinkedInAnalyticsBarProps) {
  const completedCoursesCount =
    state.courseProgress.filter((c) => c.progress >= 100).length || state.recentBadges.length || 1;

  const analyticsItems = [
    {
      id: "xp",
      emojiUrl: LIGHTNING_EMOJI_URL,
      emojiAlt: "XP lightning",
      accentColor: "#F59E0B",        // gold for XP
      bgColor: "rgba(245,158,11,0.08)",
      borderColor: "rgba(245,158,11,0.3)",
      value: `${state.xp.toLocaleString()} XP`,
      label: "Learning Velocity",
      subtext: "Top 5% in Leaderboard",
      onClick: onOpenXpModal,
      href: "/leaderboard",
    },
    {
      id: "streak",
      emojiUrl: FIRE_EMOJI_URL,
      emojiAlt: "Streak fire",
      accentColor: "#EF4444",        // red-orange for Streak
      bgColor: "rgba(239,68,68,0.08)",
      borderColor: "rgba(239,68,68,0.3)",
      value: `${state.streak} Active Days`,
      label: "Daily Learning Streak",
      subtext: "Active & Multiplied",
      onClick: onOpenStreakModal,
      href: "/learn",
    },
    {
      id: "credentials",
      icon: <Award size={28} className="text-[#2563eb]" />,
      emojiUrl: null,
      emojiAlt: "",
      accentColor: "#2563EB",        // blue for credentials
      bgColor: "rgba(37,99,235,0.08)",
      borderColor: "rgba(37,99,235,0.3)",
      value: `${completedCoursesCount} Credentials`,
      label: "Verified Passport Certificates",
      subtext: "100% Credentialed",
      onClick: undefined,
      href: "/certificates",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] p-5 space-y-4 font-sans"
      style={{ background: "var(--corp-surface)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
            Analytics &amp; Metrics
          </h2>
          <p className="text-[11px] font-medium text-corp-text-tertiary flex items-center gap-1">
            <Lock size={11} /> Private to you · Click XP or Streak to view details
          </p>
        </div>
        <Link href="/career-passport" className="text-xs font-extrabold font-mono text-[#2563eb] hover:underline">
          View Passport →
        </Link>
      </div>

      {/* 3-Card Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analyticsItems.map((item) => {
          const CardContent = (
            <div
              className="p-4 rounded-lg border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer group hover:-translate-y-0.5"
              style={{
                background: item.bgColor,
                borderColor: item.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                {item.emojiUrl ? (
                  <img src={item.emojiUrl} alt={item.emojiAlt} width={32} height={32} className="object-contain" />
                ) : (
                  item.icon
                )}
                <span
                  className="text-[10px] font-mono font-extrabold group-hover:underline"
                  style={{ color: item.accentColor }}
                >
                  View Info →
                </span>
              </div>

              <div>
                <p
                  className="text-lg sm:text-xl font-black font-mono"
                  style={{ color: "var(--corp-text)" }}
                >
                  {item.value}
                </p>
                <p className="text-xs font-bold" style={{ color: "var(--corp-text-secondary)" }}>
                  {item.label}
                </p>
                <p
                  className="text-[11px] font-medium mt-0.5 font-mono"
                  style={{ color: item.accentColor }}
                >
                  {item.subtext}
                </p>
              </div>
            </div>
          );

          if (item.onClick) {
            return (
              <div key={item.id} onClick={item.onClick}>
                {CardContent}
              </div>
            );
          }

          return (
            <Link key={item.id} href={item.href}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
