"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, Bell, ChevronRight, X, Sun, Moon,
  BookOpen, Award, MessageSquare, Info, LogOut, Trophy, Crown, User, Settings,
  Compass, Brain, ClipboardList, Building2, Calendar, Zap, Flame, ShieldCheck
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { XpExplainerModal } from "@/components/dashboard/xp-explainer-modal";
import { StreakExplainerModal } from "@/components/dashboard/streak-explainer-modal";
import { RankExplainerModal } from "@/components/dashboard/rank-explainer-modal";
import { getRankInfo, RankBadge } from "@/components/ui/rank-badge";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/learn": "Learning Tracks",
  "/courses": "Individual Courses",
  "/mock-tests": "Practice Tests",
  "/career-passport": "Career Passport",
  "/career-hub": "Career Hub",
  "/certificates": "Certificates",
  "/leaderboard": "Leaderboard",
  "/workshops": "Live Workshops",
  "/events": "Events & Competitions",
  "/marketplace": "Marketplace",
  "/settings": "Settings",
  "/help": "Help & Support",
  "/mock-interviews": "AI Mock Interviews",
  "/challenges": "Skill Challenges",
  "/jobs": "Jobs & Circulars",
};

function resolveBreadcrumb(pathname: string): string {
  if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
  if (pathname.startsWith("/learn/") && pathname.split("/").length >= 5) return "Lesson Player";
  if (pathname.startsWith("/learn/") && pathname.split("/").length === 4) return "Course Detail";
  if (pathname.startsWith("/learn/") && pathname.split("/").length === 3) return "Learning Path";
  if (pathname.startsWith("/mock-tests/")) return "Mock Test";
  if (pathname.startsWith("/workshops/")) return "Workshop Detail";
  if (pathname.startsWith("/jobs/")) return "Job Detail";
  return "Dashboard";
}

export function DashboardTopbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { state, markNotificationRead } = useUser();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [xpModalOpen, setXpModalOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const currentPage = resolveBreadcrumb(pathname);
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const userRank = getRankInfo(state.xp);

  const closeAllMenus = () => {
    setNotifOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleNotif = () => {
    setNotifOpen((prev) => {
      if (!prev) { setUserMenuOpen(false); setSearchOpen(false); }
      return !prev;
    });
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => {
      if (!prev) { setNotifOpen(false); setSearchOpen(false); }
      return !prev;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
      if (e.key === "Escape") closeAllMenus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className="relative z-30 h-16 flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 flex-shrink-0 font-sans border-b-2 max-w-full"
      style={{
        background: "var(--corp-surface)",
        borderColor: "var(--corp-border)",
      }}
    >
      {/* Left: Brand + Breadcrumb */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-shrink-0 font-mono min-w-0">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-black text-xs border border-blue-400"
            style={{ background: "#2563eb", boxShadow: "2px 2px 0px 0px #1e3a8a" }}
          >
            I
          </div>
        </Link>
        <span className="hidden xl:inline font-extrabold uppercase text-corp-text-tertiary">INSYT</span>
        <ChevronRight size={12} className="hidden xl:inline text-corp-text-tertiary" />
        <span className="font-extrabold uppercase text-corp-text px-2 py-0.5 rounded bg-corp-bg-secondary border border-corp-border truncate max-w-[120px] sm:max-w-[180px]">
          {currentPage}
        </span>
      </div>

      {/* Middle: Quick Search Trigger Button */}
      <div className="flex-1 max-w-[180px] lg:max-w-[240px] hidden md:flex justify-center font-mono">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border-2 transition-all hover:border-[#2563eb] cursor-pointer"
          style={{
            background: "var(--corp-bg-secondary)",
            borderColor: "var(--corp-border)",
            color: "var(--corp-text-secondary)",
          }}
          aria-label="Search"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search size={14} className="text-[#2563eb] flex-shrink-0" />
            <span className="text-xs font-extrabold truncate uppercase text-corp-text-tertiary">Search...</span>
          </div>
          <kbd
            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black border-2 flex-shrink-0 bg-corp-surface text-corp-text-secondary hidden lg:inline"
            style={{ borderColor: "var(--corp-border)" }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Gamification Badges & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 font-mono">

        {/* Mobile Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 md:hidden rounded-xl flex items-center justify-center transition-all border-2 border-corp-border hover:bg-corp-bg-secondary flex-shrink-0 cursor-pointer"
          style={{ color: "var(--corp-text-secondary)" }}
          aria-label="Search"
        >
          <Search size={15} className="text-[#2563eb]" />
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all border-2 border-corp-border hover:bg-corp-bg-secondary active:scale-95 flex-shrink-0 cursor-pointer"
          style={{ color: "var(--corp-text-secondary)" }}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark"
            ? <Sun size={15} className="text-amber-400 fill-amber-400" />
            : <Moon size={15} className="text-[#2563eb] fill-[#2563eb]" />}
        </button>

        {/* XP Badge Pill */}
        <div
          onClick={() => setXpModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black border-2 border-amber-500/50 bg-amber-400/15 text-amber-600 dark:text-amber-400 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm flex-shrink-0"
          title="Click to view XP Breakdown & Perks"
        >
          <Zap size={16} className="text-amber-500 fill-amber-500 flex-shrink-0" />
          <span className="hidden xs:inline">{state.xp.toLocaleString()} XP</span>
          <span className="xs:hidden">{state.xp}</span>
        </div>

        {/* Streak Pill */}
        {state.streak > 0 && (
          <div
            onClick={() => setStreakModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-rose-500/50 bg-rose-500/15 text-rose-600 dark:text-rose-400 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm flex-shrink-0"
            title="Click to view Daily Streak Calendar"
          >
            <Flame size={15} className="text-rose-500 fill-rose-500" />
            <span>{state.streak}d Streak</span>
          </div>
        )}

        {/* Pro Pass / Upgrade Badge */}
        {state.subscriptionTier === "pro" ? (
          <div
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase text-amber-950 bg-amber-400 border border-amber-500 shadow-sm flex-shrink-0"
          >
            <Crown size={13} fill="currentColor" />
            <span>PRO</span>
          </div>
        ) : (
          <Link
            href="/subscription"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a] active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <Crown size={13} />
            <span className="hidden lg:inline">Upgrade Pro</span>
            <span className="lg:hidden">Pro</span>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={toggleNotif}
            className="p-1.5 bg-transparent border-none outline-none relative flex items-center justify-center cursor-pointer group"
            aria-label="Notifications"
          >
            <motion.div
              animate={unreadCount > 0 ? {
                rotate: [0, -14, 14, -10, 10, -5, 5, 0],
              } : {}}
              transition={unreadCount > 0 ? {
                repeat: Infinity,
                repeatDelay: 3.5,
                duration: 0.7,
                ease: "easeInOut"
              } : {}}
              whileHover={{
                rotate: [0, -22, 20, -14, 10, -5, 0],
                scale: 1.2,
                transition: { duration: 0.5, ease: "easeInOut" },
              }}
              className="relative inline-flex items-center justify-center"
            >
              <Bell
                size={25}
                className="text-amber-400 fill-amber-400/30 group-hover:fill-amber-400 transition-all filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)]"
              />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 flex items-center justify-center text-[10px] font-mono font-black text-white bg-rose-600 border-2 border-slate-900 px-1 min-w-[18px] h-[18px] rounded-full shadow-md leading-none z-10"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </motion.div>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-[1000]" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
                  className="absolute right-0 top-11 w-76 sm:w-84 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[1001] overflow-hidden border-2 border-corp-border font-mono"
                  style={{ background: "var(--corp-surface)" }}
                >
                  <div className="flex items-center justify-between p-3.5 border-b-2 border-corp-border bg-corp-bg-secondary">
                    <h3 className="text-xs font-black uppercase text-corp-text flex items-center gap-2">
                      <Bell size={14} className="text-[#2563eb]" /> Notifications
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#2563eb] border border-blue-500/20">
                      {unreadCount} unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-corp-border">
                    {state.notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-corp-text-tertiary">
                        No notifications yet
                      </div>
                    ) : (
                      state.notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markNotificationRead(item.id)}
                          className={`p-3 text-xs transition-colors cursor-pointer hover:bg-corp-bg-secondary ${
                            !item.read ? "bg-blue-500/5 font-semibold" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-corp-text leading-tight">{item.title}</span>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-corp-text-secondary mt-1 font-normal leading-normal">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* USER PROFILE MENU TRIGGER */}
        <div className="relative flex-shrink-0">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all border-2 active:scale-95 cursor-pointer font-mono min-h-[38px] hover:brightness-105 shadow-sm"
            style={{
              background: "var(--corp-bg-secondary)",
              borderColor: userRank.current.color,
              boxShadow: `2px 2px 0px 0px ${userRank.current.shadowColor}`,
            }}
            aria-label="User menu"
          >
            {/* Avatar Box in Rank Gradient */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs border shadow-sm flex-shrink-0"
              style={{
                background: userRank.current.gradient,
                color: userRank.current.textColor,
                borderColor: userRank.current.shadowColor,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Name + Level */}
            <div className="hidden lg:flex flex-col text-left leading-tight min-w-0 pr-0.5">
              <span className="text-[11px] font-black text-corp-text truncate max-w-[95px]">
                {user?.name || "Student"}
              </span>
              <span className="text-[9px] font-black font-mono uppercase tracking-wider text-amber-500 mt-0.5">
                Lvl {state.level}
              </span>
            </div>

            <ChevronRight
              size={13}
              className={cn("text-corp-text-tertiary transition-transform duration-200 hidden lg:inline", userMenuOpen && "rotate-90")}
            />
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-[1000]" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
                  className="absolute right-0 top-11 w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[1001] overflow-hidden border-2 border-corp-border"
                  style={{ background: "var(--corp-surface)" }}
                >
                  <div 
                    onClick={() => { setUserMenuOpen(false); setRankModalOpen(true); }}
                    className="p-4 border-b-2 border-corp-border bg-corp-bg-secondary space-y-2 font-mono cursor-pointer hover:bg-corp-surface transition-colors"
                    title="Click to view Rank Tiers"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-corp-text truncate">{user?.name || "User"}</p>
                      <RankBadge rank={userRank.current} size="xs" />
                    </div>
                    <p className="text-[10px] text-corp-text-tertiary truncate">{user?.email || "user@insyt.com"}</p>
                    <p className="text-[10px] text-[#2563eb] font-bold">Rank: {userRank.current.name} (Click for Perks)</p>
                  </div>

                  <div className="p-2 space-y-1 font-mono text-xs">
                    <Link
                      href="/career-passport"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-corp-text hover:bg-corp-bg-secondary transition-colors cursor-pointer"
                    >
                      <User size={14} className="text-[#2563eb]" /> Career Passport
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-corp-text hover:bg-corp-bg-secondary transition-colors cursor-pointer"
                    >
                      <Settings size={14} className="text-[#2563eb]" /> Settings
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors font-bold cursor-pointer"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* XP, Streak & Rank Explainer Modals */}
      <XpExplainerModal isOpen={xpModalOpen} onClose={() => setXpModalOpen(false)} state={state} />
      <StreakExplainerModal isOpen={streakModalOpen} onClose={() => setStreakModalOpen(false)} state={state} />
      <RankExplainerModal isOpen={rankModalOpen} onClose={() => setRankModalOpen(false)} state={state} />
    </header>
  );
}
