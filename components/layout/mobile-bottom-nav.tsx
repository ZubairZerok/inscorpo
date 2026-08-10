"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList, X,
  Award, Users, Trophy, Flame, Settings, HelpCircle,
  Briefcase, Calendar, Sun, Moon, LogOut, Compass, Mic, Zap,
  Presentation, Layers, Crown, ChevronRight
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { getRankInfo, RankBadge } from "@/components/ui/rank-badge";

const FIRE_EMOJI_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp";

const primaryTabs = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen,        label: "Learn",     href: "/learn" },
  { icon: Layers,          label: "Courses",   href: "/courses" },
  { icon: FileText,        label: "Passport",  href: "/career-passport" },
];

function buildMobileCommandSections() {
  return [
    {
      label: "Overview & Growth",
      items: [
        { icon: LayoutDashboard, label: "Dashboard & Roadmap",  href: "/dashboard" },
        { icon: Crown,           label: "INSYT Pro Pass",       href: "/subscription" },
      ],
    },
    {
      label: "Academy & Skills",
      items: [
        { icon: BookOpen,      label: "Learning Tracks",   href: "/learn" },
        { icon: Layers,        label: "Individual Courses", href: "/courses" },
        { icon: Award,         label: "Certificates",       href: "/certificates" },
      ],
    },
    {
      label: "Career Studio",
      items: [
        { icon: FileText,  label: "Career Passport",  href: "/career-passport" },
        { icon: Mic,       label: "AI Mock Interviews", href: "/mock-interviews" },
        { icon: Briefcase, label: "Jobs & Circulars",  href: "/jobs" },
      ],
    },
    {
      label: "Practice & Rankings",
      items: [
        { icon: ClipboardList, label: "Practice Tests",  href: "/mock-tests" },
        { icon: Zap,           label: "Skill Challenges", href: "/challenges" },
        { icon: Trophy,        label: "Leaderboard",      href: "/leaderboard" },
      ],
    },
    {
      label: "Events & Guidance",
      items: [
        { icon: Calendar,     label: "Events & Competitions", href: "/events" },
        { icon: Presentation, label: "Live Workshops",        href: "/workshops" },
        { icon: Compass,      label: "Career Blueprint Hub",  href: "/career-hub" },
      ],
    },
  ];
}

const utilityItems = [
  { icon: Settings,   label: "Settings",       href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state } = useUser();
  const { logout } = useAuth();

  const commandSections = useMemo(() => buildMobileCommandSections(), []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const { current: rankData } = getRankInfo(state.xp);

  return (
    <>
      {/* ─── Floating Bottom Navigation Pill ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center font-mono"
        style={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))", paddingTop: "6px" }}
      >
        <div
          className="flex items-center justify-around px-2 mx-4 w-full max-w-md rounded-2xl border-2 border-corp-border shadow-2xl"
          style={{
            background: "var(--corp-surface)",
            height: "60px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25), 0 4px 10px rgba(37,99,235,0.15)",
          }}
        >
          {/* 4 Primary Navigation Tabs */}
          {primaryTabs.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-black uppercase transition-all min-h-[44px] ${
                  active ? "text-[#2563eb]" : "text-corp-text-tertiary"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                    active ? "bg-[#2563eb] text-white border border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a]" : ""
                  }`}
                >
                  <Icon size={18} style={{ color: active ? "#fff" : "inherit" }} />
                </div>
                <span className="text-[9px] font-black mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          {/* "More" Command Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-black uppercase transition-all min-h-[44px] ${
              drawerOpen ? "text-[#2563eb]" : "text-corp-text-tertiary"
            }`}
          >
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                drawerOpen ? "bg-[#2563eb] text-white border border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a]" : ""
              }`}
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full" style={{ background: drawerOpen ? "#fff" : "currentColor" }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: drawerOpen ? "#fff" : "currentColor" }} />
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full" style={{ background: drawerOpen ? "#fff" : "currentColor" }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: drawerOpen ? "#fff" : "currentColor" }} />
                </div>
              </div>
            </div>
            <span className="text-[9px] font-black mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* ─── Command Center Drawer ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden fixed inset-0 z-[60]"
              style={{ background: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(6px)" }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-[70] flex flex-col overflow-hidden font-mono border-t-2 border-corp-border"
              style={{
                background: "var(--corp-surface)",
                maxHeight: "88dvh",
                borderRadius: "24px 24px 0 0",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Drag Handle & Header */}
              <div className="flex-shrink-0 pt-3 pb-2 px-5 bg-corp-bg-secondary border-b-2 border-corp-border">
                <div className="w-12 h-1 rounded-full mx-auto mb-3 bg-corp-border" />
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase text-corp-text flex items-center gap-2">
                    <Layers size={16} className="text-[#2563eb]" /> Navigation &amp; Features
                  </h2>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-corp-surface hover:bg-corp-bg-secondary text-corp-text-secondary border border-corp-border min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* User Profile Summary Card inside Drawer */}
              <div
                className="flex-shrink-0 mx-4 my-3 p-3.5 rounded-xl border-2 border-corp-border bg-corp-bg-secondary flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xs border border-white/30"
                    style={{ background: rankData.gradient }}
                  >
                    <RankBadge rank={rankData} size="xs" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase text-corp-text truncate">
                      {state.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase text-[#2563eb]">
                        {rankData.name} Rank
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                        <Zap size={11} className="fill-amber-500" /> {state.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>

                {state.streak > 0 && (
                  <div className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1 flex-shrink-0">
                    <img src={FIRE_EMOJI_URL} alt="🔥" width={14} height={14} className="object-contain" />
                    <span>{state.streak}d</span>
                  </div>
                )}
              </div>

              {/* Scrollable Command Sections */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 space-y-5">
                {commandSections.map((section) => (
                  <div key={section.label} className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-corp-text-tertiary px-1">
                      {section.label}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-2 active:scale-95 min-h-[44px] ${
                              active
                                ? "bg-[#2563eb] text-white border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a]"
                                : "bg-corp-bg-secondary text-corp-text border-corp-border hover:bg-corp-surface"
                            }`}
                          >
                            <Icon size={15} className={active ? "text-white" : "text-[#2563eb]"} />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Utilities */}
                <div className="space-y-2 pt-2 border-t-2 border-corp-border">
                  <p className="text-[10px] font-black uppercase tracking-wider text-corp-text-tertiary px-1">
                    Preferences &amp; Account
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {utilityItems.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-2 active:scale-95 min-h-[44px] ${
                            active
                              ? "bg-[#2563eb] text-white border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a]"
                              : "bg-corp-bg-secondary text-corp-text border-corp-border hover:bg-corp-surface"
                          }`}
                        >
                          <Icon size={15} className={active ? "text-white" : "text-corp-text-secondary"} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-2 border-corp-border bg-corp-bg-secondary text-corp-text hover:bg-corp-surface active:scale-95 min-h-[44px]"
                    >
                      {theme === "dark"
                        ? <Sun size={15} className="text-amber-400 fill-amber-400" />
                        : <Moon size={15} className="text-[#2563eb] fill-[#2563eb]" />}
                      <span>{theme === "dark" ? "Light" : "Dark"}</span>
                    </button>
                    <button
                      onClick={() => { setDrawerOpen(false); logout(); }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all border-2 border-rose-500/40 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 min-h-[44px]"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                <div style={{ height: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
