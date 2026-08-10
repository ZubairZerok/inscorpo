/**
 * Browser Local Notification Manager for Mobile & Desktop
 * Triggers streak protection alerts, daily check-in reminders, and milestone notifications.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function triggerLocalNotification(title: string, options?: NotificationOptions) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    } catch (err) {
      console.warn("[NotificationManager] Local notification failed", err);
    }
  }
}

export function checkAndTriggerStreakReminder(lastCheckInDate?: string) {
  const todayStr = new Date().toISOString().split("T")[0];
  if (lastCheckInDate !== todayStr) {
    triggerLocalNotification("🔥 Keep Your Streak Alive!", {
      body: "You haven't claimed your daily check-in today (+50 XP). Tap to open INSYT Corporate.",
      tag: "streak-reminder",
    });
  }
}
