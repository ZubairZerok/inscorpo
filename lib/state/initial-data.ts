import { UserState } from "./types";

// Default empty state — all real data is loaded from Appwrite DB/Prefs in user-context.tsx
export const INITIAL_USER_STATE: UserState = {
  name: "",
  username: "",
  email: "",
  xp: 0,
  level: 1,
  streak: 0,
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0], // Mon–Sun minutes, loaded from prefs
  notifications: [],
  courseProgress: [],
  leaderboard: [],
  communityPosts: [],
  xpLogs: [],
  todayTasks: [],
  upcomingEvents: [],
  recentBadges: [],
  careerGoals: [],
  experienceLevel: "",
  subscriptionTier: "starter",
  subscriptionStatus: "active",
  enrolledPathSlugs: [],
  streakFreezes: 1,
  redeemedVouchers: [],
  completedChallengeIds: [],
  purchasedItemIds: [],
  completedChecklistTaskIds: [],
};
