"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { UserState, Notification, CommunityPost, XpLog, PassportProfile } from "@/lib/state/types";
import { INITIAL_USER_STATE } from "@/lib/state/initial-data";
import { useAuth } from "@/components/providers/auth-provider";
import { account } from "@/lib/appwrite";
import { syncUserProfile, fetchLeaderboard, fetchTasks, fetchEvents, fetchCommunityPosts } from "@/lib/db";

type UserContextType = {
  state: UserState;
  addXP: (amount: number, reason: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
  addCommunityPost: (content: string, space: string) => void;
  togglePostLike: (id: string) => void;
  replyToPost: (id: string, text: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  updateProfileName: (name: string) => Promise<void>;
  updatePassportProfile: (data: Partial<PassportProfile>) => Promise<void>;
  enrollInPath: (slug: string, title: string) => void;
  claimDailyCheckIn: () => boolean;
  toggleTask: (taskTitle: string) => void;
  resetUserStats: () => Promise<void>;
  recordStudyMinutes: (minutes: number) => void;
  redeemVoucher: (code: string, amount: number, reason: string) => boolean;
  completeChallenge: (challengeId: string, amount: number, reason: string) => void;
  buyItem: (itemId: string, itemTitle: string, method: string) => void;
  buyStreakFreeze: () => boolean;
  completeChecklistTask: (taskId: string, title: string, xpAmount?: number) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/** Returns the 0-indexed day of the week where 0=Monday, 6=Sunday */
function getTodayIndex(): number {
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
  return jsDay === 0 ? 6 : jsDay - 1; // remap to Mon=0...Sun=6
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(INITIAL_USER_STATE);
  // `prefsLoaded` tracks if we've finished the async Appwrite prefs fetch.
  // We no longer block rendering on this — children mount immediately.
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const { user } = useAuth();
  // Prevent saving prefs on the initial mount before loading is done
  const isFirstSaveRef = useRef(true);

  // ─── Load from Appwrite Preferences ───────────────────────────────────────

  useEffect(() => {
    if (!user) {
      setPrefsLoaded(true);
      return;
    }

    const loadAppwritePrefs = async () => {
      try {
        const results = await Promise.allSettled([
          account.getPrefs(),
          fetchLeaderboard(),
          fetchTasks(),
          fetchEvents(),
          fetchCommunityPosts(),
        ]);

        const prefs: any = results[0].status === "fulfilled" ? results[0].value : {};
        const realLeaderboard: any[] = results[1].status === "fulfilled" ? results[1].value : [];
        const dbTasks: any[] = results[2].status === "fulfilled" ? results[2].value : [];
        const dbEvents: any[] = results[3].status === "fulfilled" ? results[3].value : [];
        const dbCommunityPosts: any[] = results[4].status === "fulfilled" ? results[4].value : [];

        const completedTasksList: string[] = prefs.completedTasks ?? [];
        const mappedTasks = dbTasks.map((t: any) => ({
          title: t.title,
          xp: t.xp,
          done: completedTasksList.includes(t.title),
        }));

        if (prefs && prefs.xp !== undefined) {
          const rawLogs: XpLog[] = prefs.xpLogs ?? [];
          // Deduplicate Daily Check-in logs on the same calendar date
          const cleanLogs = rawLogs.filter((log, idx, self) => {
            if (log.reason.includes("Check-in")) {
              const dateStr = log.date.split("T")[0];
              return self.findIndex(l => l.reason.includes("Check-in") && l.date.split("T")[0] === dateStr) === idx;
            }
            return true;
          });

          const todayStr = new Date().toISOString().split("T")[0];
          const hasCheckedInToday = prefs.lastCheckInDate === todayStr;
          const userNotifications: Notification[] = prefs.notifications ?? [];

          if (!hasCheckedInToday && !userNotifications.some(n => n.title.includes("Streak"))) {
            userNotifications.unshift({
              id: `streak-rem-${Date.now()}`,
              title: "🔥 Keep Your Streak Alive!",
              message: "You haven't claimed your daily check-in today. Claim it now to earn +50 XP and protect your streak.",
              type: "achievement",
              time: "Just now",
              read: false,
            });
          }

          setState({
            ...INITIAL_USER_STATE,
            name: user.name || INITIAL_USER_STATE.name,
            email: user.email,
            xp: prefs.xp ?? 0,
            level: prefs.level ?? 1,
            streak: prefs.streak ?? 0,
            weeklyActivity: prefs.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0],
            courseProgress: prefs.courseProgress ?? [],
            notifications: userNotifications,
            xpLogs: cleanLogs,
            todayTasks: mappedTasks,
            upcomingEvents: dbEvents,
            recentBadges: prefs.recentBadges ?? [],
            leaderboard: realLeaderboard,
            communityPosts: dbCommunityPosts,
            passportProfile: prefs.passportProfile ?? undefined,
            enrolledPathSlugs: prefs.enrolledPathSlugs ?? [],
            lastCheckInDate: prefs.lastCheckInDate ?? undefined,
            redeemedVouchers: prefs.redeemedVouchers ?? [],
            completedChallengeIds: prefs.completedChallengeIds ?? [],
            purchasedItemIds: prefs.purchasedItemIds ?? [],
            careerGoals: prefs.careerGoals ?? [],
            experienceLevel: prefs.experienceLevel ?? "",
            subscriptionTier: prefs.subscriptionTier ?? "starter",
            subscriptionStatus: prefs.subscriptionStatus ?? "active",
          });

        } else {
          // Fresh user — initialize defaults
          const freshState: UserState = {
            ...INITIAL_USER_STATE,
            name: user.name || INITIAL_USER_STATE.name,
            email: user.email,
            xp: 0,
            level: 1,
            streak: 0,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
            courseProgress: [],
            notifications: [],
            xpLogs: [],
            todayTasks: mappedTasks,
            upcomingEvents: dbEvents,
            recentBadges: [],
            leaderboard: realLeaderboard,
            communityPosts: dbCommunityPosts,
            enrolledPathSlugs: [],
            careerGoals: prefs.careerGoals ?? [],
            experienceLevel: prefs.experienceLevel ?? "",
            subscriptionTier: "starter",
            subscriptionStatus: "active",
          };
          setState(freshState);
          await account.updatePrefs({
            ...freshState,
            communityPosts: undefined, // don't store community posts in prefs
            leaderboard: undefined,    // don't store leaderboard in prefs
            upcomingEvents: undefined,
            todayTasks: undefined,
            completedTasks: [],
          });
          await syncUserProfile(user.$id, {
            name: freshState.name,
            xp: freshState.xp,
            level: freshState.level,
            streak: freshState.streak,
            email: freshState.email,
          });
        }
      } catch (err) {
        console.error("Failed to load Appwrite user preferences", err);
      } finally {
        setPrefsLoaded(true);
        isFirstSaveRef.current = false;
      }
    };

    loadAppwritePrefs();
  }, [user]);

  // ─── Save to Appwrite on state change (debounced 1s) ───────────────────────

  useEffect(() => {
    // Skip the very first render and the initial load
    if (!prefsLoaded || !user || isFirstSaveRef.current) return;

    const timer = setTimeout(() => {
      const savePrefs = async () => {
        try {
          await account.updatePrefs({
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            weeklyActivity: state.weeklyActivity,
            courseProgress: state.courseProgress,
            notifications: state.notifications,
            xpLogs: state.xpLogs,
            recentBadges: state.recentBadges,
            completedTasks: state.todayTasks.filter((t) => t.done).map((t) => t.title),
            passportProfile: state.passportProfile ?? null,
            enrolledPathSlugs: state.enrolledPathSlugs,
            lastCheckInDate: state.lastCheckInDate ?? null,
            redeemedVouchers: state.redeemedVouchers,
            completedChallengeIds: state.completedChallengeIds,
            purchasedItemIds: state.purchasedItemIds,
            careerGoals: state.careerGoals ?? [],
            experienceLevel: state.experienceLevel ?? "",
            subscriptionTier: state.subscriptionTier ?? "starter",
            subscriptionStatus: state.subscriptionStatus ?? "active",
          });

          await syncUserProfile(user.$id, {
            name: state.name,
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            email: state.email || user.email,
          });
        } catch (err) {
          console.error("Failed to save Appwrite user preferences", err);
        }
      };

      savePrefs();
    }, 1000); // 1-second debounce to prevent save storms

    return () => clearTimeout(timer);
  }, [state, prefsLoaded, user]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Records minutes of study time for today in the weekly activity array.
   * Called whenever a lesson is completed or a significant study session ends.
   */
  const recordStudyMinutes = (minutes: number) => {
    const todayIdx = getTodayIndex();
    setState((prev) => {
      const newActivity = [...prev.weeklyActivity];
      newActivity[todayIdx] = (newActivity[todayIdx] || 0) + minutes;
      return { ...prev, weeklyActivity: newActivity };
    });
  };

  const addXP = (amount: number, reason: string) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newLog: XpLog = {
        id: `x_${Date.now()}`,
        reason,
        amount,
        date: new Date().toISOString(),
      };
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpLogs: [newLog, ...prev.xpLogs],
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const addNotification = (notif: Omit<Notification, "id" | "time" | "read">) => {
    setState((prev) => {
      const newNotif: Notification = {
        ...notif,
        id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        time: "Just now",
        read: false,
      };
      return { ...prev, notifications: [newNotif, ...prev.notifications] };
    });
  };

  const addCommunityPost = (content: string, space: string) => {
    setState((prev) => {
      const newPost: CommunityPost = {
        id: `p_${Date.now()}`,
        author: { name: prev.name, role: "Student", avatar: prev.name.substring(0, 2).toUpperCase() },
        content,
        space,
        time: "Just now",
        likes: 0,
        comments: 0,
        isLikedByMe: false,
        replies: [],
      };
      return { ...prev, communityPosts: [newPost, ...prev.communityPosts] };
    });
  };

  const togglePostLike = (id: string) => {
    setState((prev) => ({
      ...prev,
      communityPosts: prev.communityPosts.map((p) => {
        if (p.id === id) {
          return { ...p, isLikedByMe: !p.isLikedByMe, likes: p.isLikedByMe ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      }),
    }));
  };

  const replyToPost = (id: string, text: string) => {
    setState((prev) => ({
      ...prev,
      communityPosts: prev.communityPosts.map((p) => {
        if (p.id === id) {
          const replies = p.replies || [];
          return {
            ...p,
            comments: p.comments + 1,
            replies: [...replies, { author: prev.name, text }],
          };
        }
        return p;
      }),
    }));
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setState((prev) => {
      const course = prev.courseProgress.find((c) => c.id === courseId);
      const exists = !!course;
      const oldProgress = course ? course.progress : 0;

      let nextProgressList;
      let title = "";

      if (exists) {
        title = course.title;
        nextProgressList = prev.courseProgress.map((c) =>
          c.id === courseId ? { ...c, progress, lastAccessed: "Just now" } : c
        );
      } else {
        title = courseId
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        nextProgressList = [
          ...prev.courseProgress,
          { id: courseId, title, progress, lastAccessed: "Just now", category: "general" as const },
        ];
      }

      let nextXp = prev.xp;
      let nextLevel = prev.level;
      let nextLogs = [...prev.xpLogs];
      let nextNotifications = [...prev.notifications];
      let nextBadges = [...prev.recentBadges];

      if (oldProgress < 100 && progress === 100) {
        const xpReward = 300;
        nextXp += xpReward;
        nextLevel = Math.floor(nextXp / 200) + 1;

        nextLogs = [
          {
            id: `x_${Date.now()}`,
            reason: `Completed course: ${title}`,
            amount: xpReward,
            date: new Date().toISOString(),
          },
          ...nextLogs,
        ];

        nextNotifications = [
          {
            id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: "achievement" as const,
            title: "Course Completed! 🎓",
            message: `You successfully finished ${title}.`,
            time: "Just now",
            read: false,
          },
          ...nextNotifications,
        ];

        if (!nextBadges.some((b) => b.name === "Course Graduate")) {
          nextBadges = [...nextBadges, { name: "Course Graduate", icon: "🎓" }];
        }
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        xpLogs: nextLogs,
        notifications: nextNotifications,
        recentBadges: nextBadges,
        courseProgress: nextProgressList,
      };
    });
  };

  const updateProfileName = async (name: string) => {
    try {
      if (user) {
        await account.updateName(name);
      }
      setState((prev) => ({ ...prev, name }));
    } catch (err) {
      console.error("Failed to update profile name in Appwrite:", err);
      throw err;
    }
  };

  const updatePassportProfile = async (data: Partial<PassportProfile>) => {
    setState((prev) => {
      const merged: PassportProfile = {
        headline: "",
        summary: "",
        location: "",
        phone: "",
        linkedin: "",
        github: "",
        university: "",
        degree: "",
        gradYear: "",
        experience: [],
        customSkills: [],
        ...(prev.passportProfile ?? {}),
        ...data,
      };
      return { ...prev, passportProfile: merged };
    });
  };

  const enrollInPath = (slug: string, title: string) => {
    setState((prev) => {
      if (prev.enrolledPathSlugs.includes(slug)) return prev; // already enrolled
      const newNotif = {
        id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: "course" as const,
        title: "Enrolled! 🎉",
        message: `You're now enrolled in "${title}". Start your first lesson!`,
        time: "Just now",
        read: false,
      };
      return {
        ...prev,
        enrolledPathSlugs: [...prev.enrolledPathSlugs, slug],
        notifications: [newNotif, ...prev.notifications],
      };
    });
  };

  const claimDailyCheckIn = (): boolean => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (state.lastCheckInDate === todayStr) return false; // already claimed today

    const alreadyLoggedToday = state.xpLogs.some(
      (log) => log.reason.includes("Check-in") && log.date.split("T")[0] === todayStr
    );
    if (alreadyLoggedToday) return false;

    setState((prev) => {
      const newStreak = prev.streak + 1;
      const amount = 25;
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newLog = {
        id: `x_${Date.now()}`,
        reason: "Daily Check-in Bonus 🔥",
        amount,
        date: new Date().toISOString(),
      };
      const newNotif = {
        id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: "achievement" as const,
        title: "Daily Check-in Complete! 🔥",
        message: `Streak increased to ${newStreak} days! Earned +25 XP.`,
        time: "Just now",
        read: false,
      };
      // Also record 5 minutes of activity so heatmap/velocity chart reflects check-in
      const todayIdx = getTodayIndex();
      const newActivity = [...prev.weeklyActivity];
      newActivity[todayIdx] = (newActivity[todayIdx] || 0) + 5;
      return {
        ...prev,
        streak: newStreak,
        xp: newXp,
        level: newLevel,
        lastCheckInDate: todayStr,
        weeklyActivity: newActivity,
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
    return true;
  };

  const buyStreakFreeze = (): boolean => {
    if (state.xp < 200) return false;

    setState((prev) => {
      if (prev.xp < 200) return prev;
      const newXp = prev.xp - 200;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newFreezes = (prev.streakFreezes || 0) + 1;
      const newLog: XpLog = {
        id: `sf_${Date.now()}`,
        reason: "Purchased 🧊 Streak Freeze Shield (-200 XP)",
        amount: -200,
        date: new Date().toISOString(),
      };
      const newNotif: Notification = {
        id: `sf_n_${Date.now()}`,
        type: "achievement",
        title: "🧊 Streak Freeze Active!",
        message: "Your learning streak is protected for 1 missed day.",
        time: "Just now",
        read: false,
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streakFreezes: newFreezes,
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
    return true;
  };

  const completeChecklistTask = (taskId: string, title: string, xpAmount = 50): boolean => {
    const currentTasks = state.completedChecklistTaskIds || [];
    if (currentTasks.includes(taskId)) return false;

    setState((prev) => {
      const prevTasks = prev.completedChecklistTaskIds || [];
      if (prevTasks.includes(taskId)) return prev;

      const newTasks = [...prevTasks, taskId];
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / 200) + 1;
      
      const newLog: XpLog = {
        id: `chk_${Date.now()}`,
        reason: `Completed Getting Started Task: ${title} (+${xpAmount} XP)`,
        amount: xpAmount,
        date: new Date().toISOString(),
      };

      const newNotif: Notification = {
        id: `chk_n_${Date.now()}`,
        type: "achievement",
        title: `🎯 Task Completed: ${title}`,
        message: `Congratulations! You earned +${xpAmount} XP on your getting started checklist.`,
        time: "Just now",
        read: false,
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedChecklistTaskIds: newTasks,
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
    return true;
  };

  const toggleTask = (taskTitle: string) => {
    setState((prev) => {
      const taskObj = prev.todayTasks.find((t) => t.title === taskTitle);
      if (!taskObj) return prev;

      const newDone = !taskObj.done;
      const updatedTasks = prev.todayTasks.map((t) =>
        t.title === taskTitle ? { ...t, done: newDone } : t
      );

      let nextXp = prev.xp;
      let nextLevel = prev.level;
      let nextLogs = [...prev.xpLogs];

      if (newDone) {
        nextXp += taskObj.xp;
        nextLevel = Math.floor(nextXp / 200) + 1;
        nextLogs = [
          {
            id: `x_${Date.now()}`,
            reason: `Completed task: ${taskTitle}`,
            amount: taskObj.xp,
            date: new Date().toISOString(),
          },
          ...nextLogs,
        ];
      } else {
        nextXp = Math.max(nextXp - taskObj.xp, 0);
        nextLevel = Math.floor(nextXp / 200) + 1;
        nextLogs = nextLogs.filter((log) => log.reason !== `Completed task: ${taskTitle}`);
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        xpLogs: nextLogs,
        todayTasks: updatedTasks,
      };
    });
  };

  const resetUserStats = async () => {
    const cleanState: UserState = {
      ...INITIAL_USER_STATE,
      name: state.name,
      email: state.email,
    };
    setState(cleanState);
    if (user) {
      try {
        await account.updatePrefs({
          xp: 0,
          level: 1,
          streak: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          courseProgress: [],
          notifications: [],
          xpLogs: [],
          recentBadges: [],
          completedTasks: [],
        });
        await syncUserProfile(user.$id, {
          name: cleanState.name,
          xp: 0,
          level: 1,
          streak: 0,
          email: cleanState.email,
        });
      } catch (err) {
        console.error("Failed to reset prefs/profile in Appwrite:", err);
      }
    }
  };

  const redeemVoucher = (code: string, amount: number, reason: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (state.redeemedVouchers.includes(cleanCode)) return false;

    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newLog = {
        id: `x_${Date.now()}`,
        reason: `Voucher Redeemed: ${cleanCode} (${reason})`,
        amount,
        date: new Date().toISOString(),
      };
      const newNotif = {
        id: `n_${Date.now()}`,
        type: "achievement" as const,
        title: "Voucher Redeemed! 🎟️",
        message: `Successfully redeemed ${cleanCode}! Earned +${amount} XP.`,
        time: "Just now",
        read: false,
      };
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        redeemedVouchers: [...prev.redeemedVouchers, cleanCode],
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
    return true;
  };

  const completeChallenge = (challengeId: string, amount: number, reason: string) => {
    setState((prev) => {
      if (prev.completedChallengeIds.includes(challengeId)) return prev;

      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newLog = {
        id: `x_${Date.now()}`,
        reason: `Completed Challenge: ${reason}`,
        amount,
        date: new Date().toISOString(),
      };
      const newNotif = {
        id: `n_${Date.now()}`,
        type: "achievement" as const,
        title: "Challenge Completed! ⚡",
        message: `You mastered "${reason}". Earned +${amount} XP!`,
        time: "Just now",
        read: false,
      };
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedChallengeIds: [...prev.completedChallengeIds, challengeId],
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
  };

  const buyItem = (itemId: string, itemTitle: string, method: string) => {
    setState((prev) => {
      if (prev.purchasedItemIds.includes(itemId)) return prev;

      const bonusXp = 100;
      const newXp = prev.xp + bonusXp;
      const newLevel = Math.floor(newXp / 200) + 1;
      const newLog = {
        id: `x_${Date.now()}`,
        reason: `Purchased Item: ${itemTitle} via ${method}`,
        amount: bonusXp,
        date: new Date().toISOString(),
      };
      const newNotif = {
        id: `n_${Date.now()}`,
        type: "achievement" as const,
        title: "Purchase Successful! 🛍️",
        message: `Unlocked "${itemTitle}" via ${method}. Earned +${bonusXp} bonus XP!`,
        time: "Just now",
        read: false,
      };
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        purchasedItemIds: [...prev.purchasedItemIds, itemId],
        xpLogs: [newLog, ...prev.xpLogs],
        notifications: [newNotif, ...prev.notifications],
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        addXP,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        addCommunityPost,
        togglePostLike,
        replyToPost,
        updateCourseProgress,
        updateProfileName,
        updatePassportProfile,
        enrollInPath,
        claimDailyCheckIn,
        toggleTask,
        resetUserStats,
        recordStudyMinutes,
        redeemVoucher,
        completeChallenge,
        buyItem,
        buyStreakFreeze,
        completeChecklistTask,
      }}
    >
      {/*
        Children render IMMEDIATELY — no more blocking on isLoaded.
        This eliminates the hydration mismatch that caused a full-page
        loading flash and React console warnings.
        Downstream components handle their own skeleton states.
      */}
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
