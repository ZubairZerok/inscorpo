export type Notification = {
  id: string;
  type: "achievement" | "course" | "community" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type CourseProgress = {
  id: string;
  title: string;
  progress: number; // 0-100
  lastAccessed: string;
  category: "finance" | "communication" | "analytics" | "strategy" | "tests" | "general";
};

export type LeaderboardUser = {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  isUser: boolean;
};

export type CommunityPost = {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  space: string;
  time: string;
  likes: number;
  comments: number;
  isLikedByMe: boolean;
  replies?: { author: string; text: string }[];
};

export type XpLog = {
  id: string;
  reason: string;
  amount: number;
  date: string; // ISO string
};

export type Task = {
  title: string;
  xp: number;
  done: boolean;
};

export type Event = {
  title: string;
  date: string;
  time: string;
  type: string;
};

export type Badge = {
  name: string;
  icon: string;
};

export type PassportExperience = {
  id: string;
  title: string;
  company: string;
  duration: string;
  desc: string;
};

export type PassportProfile = {
  photoUrl?: string;
  headline: string;
  summary: string;
  location: string;
  phone: string;
  linkedin: string;
  github: string;
  university: string;
  degree: string;
  gradYear: string;
  experience: PassportExperience[];
  customSkills: string[];
  topSkills?: string[];
  verificationHash?: string;
  isPublic?: boolean;
};

export type UserState = {
  // Core Profile
  name: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  
  // Weekly Activity (Minutes per day: Mon-Sun)
  weeklyActivity: number[];
  
  // Collections
  notifications: Notification[];
  courseProgress: CourseProgress[];
  leaderboard: LeaderboardUser[];
  communityPosts: CommunityPost[];
  xpLogs: XpLog[];
  todayTasks: Task[];
  upcomingEvents: Event[];
  recentBadges: Badge[];

  // Career & Onboarding Preferences
  careerGoals?: string[];
  experienceLevel?: string;

  // Subscription & Monetization Architecture
  subscriptionTier?: "starter" | "pro" | "enterprise";
  subscriptionStatus?: "active" | "inactive" | "trialing";

  // Career Passport CV data
  passportProfile?: PassportProfile;

  // Enrollment & Gamification
  enrolledPathSlugs: string[];
  lastCheckInDate?: string;
  streakFreezes?: number;
  redeemedVouchers: string[];
  completedChallengeIds: string[];
  purchasedItemIds: string[];
  completedChecklistTaskIds?: string[];
};
