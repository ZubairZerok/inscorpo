"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList,
  Award, Users, Trophy, Settings, HelpCircle, ChevronLeft, ChevronRight,
  Briefcase, Calendar, Sun, Moon, Compass, Mic, Zap, Layers, Presentation,
  Flame, Rocket, Sparkles, Star, Target
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useUser } from "@/components/providers/user-context";
import { cn } from "@/lib/utils";

/* ─── Nav Structure (Bangla Corporate LMS) ─── */
function buildNavSections() {
  return {
    topItems: [
      { icon: Rocket,    label: "ড্যাশবোর্ড",           href: "/dashboard",       color: "blue"   },
      { icon: FileText,  label: "ক্যারিয়ার পাসপোর্ট",  href: "/career-passport", color: "blue",  isNew: true },
      { icon: Target,    label: "ক্যারিয়ার হাব",         href: "/career-hub",       color: "indigo" },
      { icon: Trophy,    label: "লিডারবোর্ড",         href: "/leaderboard",      color: "amber"  },
    ],
    learnSection: {
      label: "লার্নিং ও প্রস্তুতি",
      items: [
        { icon: Compass,       label: "লার্নিং ট্র্যাকসমূহ",   href: "/learn",           color: "emerald" },
        { icon: Mic,           label: "এআই মক ইন্টারভিউ",      href: "/mock-interviews", color: "blue",  isNew: true },
        { icon: ClipboardList, label: "মক টেস্ট",            href: "/mock-tests",      color: "amber"   },
        { icon: Zap,          label: "স্কিল চ্যালেঞ্জেস",      href: "/challenges",  color: "amber"   },
        { icon: Award,         label: "সার্টিফিকেটসমূহ",       href: "/certificates",    color: "amber"   },
      ],
    },
    applySection: {
      label: "সুযোগ ও নেটওয়ার্ক",
      items: [
        { icon: Briefcase,    label: "জব সার্কুলার",         href: "/jobs",        color: "rose"   },
        { icon: Presentation, label: "লাইভ ওয়ার্কশপ",       href: "/workshops",   color: "amber"  },
      ],
    },
    accountSection: {
      label: "অ্যাকাউন্ট",
      items: [
        { icon: Settings,     label: "সেটিংস",            href: "/settings",    color: "slate"  },
        { icon: HelpCircle,   label: "সাহায্য ও সাপোর্ট", href: "/help",        color: "slate"  },
      ],
    },
  };
}

const colorMap: Record<string, { bg: string; text: string; lightBg: string; border: string }> = {
  blue:    { bg: "#2563eb", text: "#ffffff", lightBg: "rgba(37,99,235,0.12)", border: "#1d4ed8" },
  indigo:  { bg: "#4f46e5", text: "#ffffff", lightBg: "rgba(79,70,229,0.12)", border: "#4338ca" },
  emerald: { bg: "#10b981", text: "#ffffff", lightBg: "rgba(16,185,129,0.12)", border: "#047857" },
  amber:   { bg: "#f59e0b", text: "#78350f", lightBg: "rgba(245,158,11,0.15)", border: "#b45309" },
  rose:    { bg: "#e11d48", text: "#ffffff", lightBg: "rgba(225,29,72,0.12)", border: "#9f1239" },
  slate:   { bg: "#64748b", text: "#ffffff", lightBg: "rgba(100,116,139,0.12)", border: "#334155" },
};

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  color: string;
  isNew?: boolean;
}

function NavLink({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const col = colorMap[item.color] || colorMap.blue;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-180 font-mono font-extrabold select-none min-h-[44px]",
        collapsed ? "justify-center px-0" : "",
        active ? "border-2" : "border-2 border-transparent hover:bg-corp-bg-secondary"
      )}
      style={
        active
          ? {
              background: col.bg,
              color: col.text,
              borderColor: col.border,
              boxShadow: `3px 3px 0px 0px ${col.border}`,
            }
          : { color: "var(--corp-text-secondary)" }
      }
      title={collapsed ? item.label : undefined}
    >
      <div
        className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center transition-transform duration-180 group-hover:scale-110"
        style={
          active
            ? { background: "rgba(255,255,255,0.25)" }
            : { background: col.lightBg }
        }
      >
        <div style={{ color: active ? col.text : col.bg }}>
          <Icon size={15} />
        </div>
      </div>

      {!collapsed && (
        <>
          <span className="flex-1 text-xs font-bangla font-black tracking-tight leading-tight truncate">
            {item.label}
          </span>
          {item.isNew && (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider"
              style={
                active
                  ? { background: "rgba(255,255,255,0.3)", color: "#fff" }
                  : { background: "#e11d48", color: "#fff" }
              }
            >
              NEW
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const nav = useMemo(() => buildNavSections(), []);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
      className="hidden md:flex relative flex-col h-full flex-shrink-0 z-30 font-sans border-r-2"
      style={{
        background: "var(--corp-surface)",
        borderColor: "var(--corp-border)",
      }}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-4 h-16 border-b-2 flex-shrink-0" style={{ borderColor: "var(--corp-border)" }}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Link href="/dashboard" className="flex items-center gap-2.5 font-mono">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-sm border-2 border-blue-400"
                  style={{ background: "#2563eb", boxShadow: "3px 3px 0px 0px #1e3a8a" }}
                >
                  I
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight leading-none text-corp-text">INSYT</span>
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#2563eb]">Corporate</span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-blue-400"
              style={{ background: "#2563eb", boxShadow: "2px 2px 0px 0px #1e3a8a" }}
            >
              I
            </div>
          </Link>
        )}
      </div>

      {/* ── Navigation List ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-mono scrollbar-none">
        {/* Top Items */}
        <div className="space-y-1">
          {nav.topItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href, pathname)}
            />
          ))}
        </div>

        {/* Learn Section */}
        <div className="pt-3 border-t-2" style={{ borderColor: "var(--corp-border)" }}>
          {!collapsed && (
            <p className="px-2 pb-1 text-[10px] font-bangla font-black uppercase tracking-wider text-corp-text-tertiary">
              {nav.learnSection.label}
            </p>
          )}
          <div className="space-y-1">
            {nav.learnSection.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href, pathname)}
              />
            ))}
          </div>
        </div>

        {/* Apply Section */}
        <div className="pt-3 border-t-2" style={{ borderColor: "var(--corp-border)" }}>
          {!collapsed && (
            <p className="px-2 pb-1 text-[10px] font-bangla font-black uppercase tracking-wider text-corp-text-tertiary">
              {nav.applySection.label}
            </p>
          )}
          <div className="space-y-1">
            {nav.applySection.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href, pathname)}
              />
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="pt-3 border-t-2" style={{ borderColor: "var(--corp-border)" }}>
          {!collapsed && (
            <p className="px-2 pb-1 text-[10px] font-bangla font-black uppercase tracking-wider text-corp-text-tertiary">
              {nav.accountSection.label}
            </p>
          )}
          <div className="space-y-1">
            {nav.accountSection.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href, pathname)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* ── COLLAPSE / BACK TOGGLE BUTTON (YELLOW BACKGROUND WITH DARK BROWN ARROW) ── */}
      <div className="p-3 border-t-2 flex-shrink-0" style={{ borderColor: "var(--corp-border)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] hover:bg-amber-300 transition-all font-mono font-black min-h-[44px]"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={20} className="text-amber-950 fill-amber-950 stroke-[3]" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-amber-950">
              <ChevronLeft size={20} className="text-amber-950 fill-amber-950 stroke-[3]" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
