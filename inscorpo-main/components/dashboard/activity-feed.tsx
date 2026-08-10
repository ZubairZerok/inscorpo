"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Trophy, Zap, Flame, Star,
  Newspaper, ChevronRight, Award, TrendingUp,
  BookOpen, Target, Users
} from "lucide-react";
import Link from "next/link";
import { UserState } from "@/lib/state/types";

type FeedItemType =
  | "course_complete"
  | "badge_earned"
  | "challenge_won"
  | "streak_milestone"
  | "level_up"
  | "xp_milestone"
  | "admin_article"
  | "enrollment"
  | "community";

interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
  linkLabel?: string;
  xpReward?: number;
}

const feedTypeConfig: Record<
  FeedItemType,
  { icon: typeof Trophy; color: string; bg: string; borderColor: string }
> = {
  course_complete: {
    icon: GraduationCap,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/15",
    borderColor: "#2563eb",
  },
  badge_earned: {
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-400/15",
    borderColor: "#f59e0b",
  },
  challenge_won: {
    icon: Trophy,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/15",
    borderColor: "#2563eb",
  },
  streak_milestone: {
    icon: Flame,
    color: "text-rose-500",
    bg: "bg-rose-500/15",
    borderColor: "#e11d48",
  },
  level_up: {
    icon: TrendingUp,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/15",
    borderColor: "#2563eb",
  },
  xp_milestone: {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-400/15",
    borderColor: "#f59e0b",
  },
  admin_article: {
    icon: Newspaper,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/15",
    borderColor: "#2563eb",
  },
  enrollment: {
    icon: BookOpen,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/15",
    borderColor: "#2563eb",
  },
  community: {
    icon: Users,
    color: "text-rose-500",
    bg: "bg-rose-500/15",
    borderColor: "#e11d48",
  },
};

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function deterministicOffset(seed: string, maxHours: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % (maxHours * 60)) * 60 * 1000;
}

function synthesizeFeed(
  xpLogs: UserState["xpLogs"],
  courseProgress: UserState["courseProgress"],
  recentBadges: UserState["recentBadges"],
  enrolledPathSlugs: UserState["enrolledPathSlugs"],
  completedChallengeIds: UserState["completedChallengeIds"],
  leaderboard: UserState["leaderboard"],
  xp: number,
  level: number,
  streak: number,
): FeedItem[] {
  const items: FeedItem[] = [];
  const now = Date.now();

  courseProgress
    .filter((c) => c.progress === 100)
    .forEach((c) => {
      const matchingLog = xpLogs.find(
        (log) => log.reason.includes(c.title) || log.reason.includes(c.id)
      );
      const date = matchingLog
        ? new Date(matchingLog.date)
        : new Date(now - deterministicOffset(c.id, 72));
      items.push({
        id: `feed-course-${c.id}`,
        type: "course_complete",
        title: `Completed "${c.title}"`,
        description: "Course track finished — certificate unlocked!",
        timestamp: date,
        link: "/certificates",
        linkLabel: "View Certificate",
        xpReward: 300,
      });
    });

  recentBadges.forEach((badge) => {
    items.push({
      id: `feed-badge-${badge.name}`,
      type: "badge_earned",
      title: `Earned "${badge.name}" Badge ${badge.icon}`,
      description: "Achievement unlocked — keep pushing forward!",
      timestamp: new Date(now - deterministicOffset(badge.name, 48)),
    });
  });

  const milestones = [1000, 2500, 5000, 7500, 10000, 15000, 25000, 50000, 100000];
  const achievedMilestones = milestones.filter((m) => xp >= m);
  achievedMilestones.slice(-2).forEach((m) => {
    const matchingLog = xpLogs.find(
      (log) => log.reason.includes("milestone") || (log.amount > 0 && log.amount + (xp - log.amount) >= m)
    );
    items.push({
      id: `feed-xp-${m}`,
      type: "xp_milestone",
      title: `Reached ${m.toLocaleString()} XP!`,
      description: "Milestone achieved — climbing the ranks",
      timestamp: matchingLog
        ? new Date(matchingLog.date)
        : new Date(now - deterministicOffset(`xp-${m}`, 168)),
    });
  });

  if (level > 1) {
    const recentLog = xpLogs[0];
    items.push({
      id: `feed-level-${level}`,
      type: "level_up",
      title: `Leveled Up to Level ${level}!`,
      description: "Executive rank progression",
      timestamp: recentLog ? new Date(recentLog.date) : new Date(now - 1000 * 60 * 60 * 2),
    });
  }

  const streakMilestones = [3, 7, 14, 30, 60, 100];
  const achievedStreaks = streakMilestones.filter((s) => streak >= s);
  if (achievedStreaks.length > 0) {
    const topStreak = achievedStreaks[achievedStreaks.length - 1];
    items.push({
      id: `feed-streak-${topStreak}`,
      type: "streak_milestone",
      title: `🔥 ${topStreak}-Day Learning Streak!`,
      description: `Maintained ${topStreak} consecutive days of learning`,
      timestamp: new Date(now - 1000 * 60 * 60 * 24 * (streak - topStreak)),
    });
  }

  enrolledPathSlugs.forEach((slug) => {
    const title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    items.push({
      id: `feed-enroll-${slug}`,
      type: "enrollment",
      title: `Enrolled in "${title}"`,
      description: "New learning path started",
      timestamp: new Date(now - deterministicOffset(slug, 168)),
      link: `/learn/${slug}`,
      linkLabel: "Continue",
    });
  });

  completedChallengeIds.forEach((challengeId) => {
    const matchingLog = xpLogs.find((log) => log.reason.includes(challengeId) || log.reason.includes("Challenge"));
    items.push({
      id: `feed-challenge-${challengeId}`,
      type: "challenge_won",
      title: `Completed Challenge: ${challengeId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
      description: "Challenge mastered!",
      timestamp: matchingLog
        ? new Date(matchingLog.date)
        : new Date(now - deterministicOffset(challengeId, 120)),
    });
  });

  const peerNames = leaderboard.filter((u) => !u.isUser).slice(0, 3);
  const communityEvents = [
    { verb: "just reached", suffix: "XP milestone", idx: 0 },
    { verb: "completed a new", suffix: "course track", idx: 1 },
    { verb: "earned a", suffix: "badge", idx: 2 },
  ];
  communityEvents.forEach((evt) => {
    const peer = peerNames[evt.idx];
    if (peer) {
      items.push({
        id: `feed-community-${peer.id}-${evt.idx}`,
        type: "community",
        title: `${peer.name} ${evt.verb} ${evt.suffix}`,
        description: `Level ${peer.level} · ${peer.xp.toLocaleString()} XP`,
        timestamp: new Date(now - deterministicOffset(peer.id + evt.idx, 24)),
      });
    }
  });

  items.push({
    id: "article-1",
    type: "admin_article",
    title: "5 Skills Every Fresh Graduate Needs in 2026",
    description: "Posted by INSYT Team — Read our latest career insights",
    timestamp: new Date(now - 1000 * 60 * 60 * 8),
    link: "/community",
    linkLabel: "Read Article",
  });
  items.push({
    id: "article-2",
    type: "admin_article",
    title: "New: AI Mock Interview Simulator is Live!",
    description: "Practice with AI-powered behavioral & technical interviews",
    timestamp: new Date(now - 1000 * 60 * 60 * 36),
    link: "/mock-interviews",
    linkLabel: "Try It",
  });

  return items
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8);
}

interface ActivityFeedProps {
  state: UserState;
}

export function ActivityFeed({ state }: ActivityFeedProps) {
  const feedItems = useMemo(
    () =>
      synthesizeFeed(
        state.xpLogs,
        state.courseProgress,
        state.recentBadges,
        state.enrolledPathSlugs,
        state.completedChallengeIds,
        state.leaderboard,
        state.xp,
        state.level,
        state.streak,
      ),
    [
      state.xpLogs,
      state.courseProgress,
      state.recentBadges,
      state.enrolledPathSlugs,
      state.completedChallengeIds,
      state.leaderboard,
      state.xp,
      state.level,
      state.streak,
    ]
  );

  return (
    <div
      className="rounded-xl border-2 border-[#2563eb] shadow-[5px_5px_0px_0px_#2563eb] overflow-hidden font-sans"
      style={{ background: "var(--corp-surface)" }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between border-b-2 border-corp-border font-mono"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#2563eb] text-white flex items-center justify-center border border-blue-400">
            <Star size={14} className="fill-white" />
          </div>
          <h2 className="text-sm font-extrabold uppercase" style={{ color: "var(--corp-text)" }}>
            Activity Feed
          </h2>
        </div>
        <Link
          href="/leaderboard"
          className="text-xs font-extrabold text-[#2563eb] hover:underline flex items-center gap-0.5 uppercase"
        >
          Leaderboard <ChevronRight size={12} />
        </Link>
      </div>

      {/* Feed Items */}
      <div className="max-h-[380px] overflow-y-auto divide-y-2 divide-corp-border">
        {feedItems.length > 0 ? (
          feedItems.map((item, idx) => {
            const config = feedTypeConfig[item.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                className="group flex gap-3 px-4 py-3 transition-colors hover:bg-corp-bg-secondary cursor-default relative"
              >
                <div
                  className="w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(37,99,235,0.1)", borderColor: config.borderColor }}
                >
                  <Icon size={14} className={config.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-mono font-extrabold leading-snug truncate uppercase"
                    style={{ color: "var(--corp-text)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate font-medium"
                    style={{ color: "var(--corp-text-secondary)" }}
                  >
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 font-mono">
                    <span
                      className="text-[10px] text-corp-text-tertiary"
                    >
                      {relativeTime(item.timestamp)}
                    </span>
                    {item.xpReward && item.xpReward > 0 && (
                      <span className="text-[10px] font-extrabold text-[#2563eb]">
                        +{item.xpReward} XP
                      </span>
                    )}
                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-[10px] font-extrabold text-[#2563eb] hover:underline flex items-center gap-0.5 ml-auto uppercase"
                      >
                        {item.linkLabel} <ChevronRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/15 text-[#2563eb] flex items-center justify-center mx-auto border border-[#2563eb]">
              <Target size={18} />
            </div>
            <p className="text-xs font-medium" style={{ color: "var(--corp-text-secondary)" }}>
              No activity yet — start learning to see your progress here!
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-xs font-mono font-extrabold text-[#2563eb] hover:underline uppercase"
            >
              Browse Courses <ChevronRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

