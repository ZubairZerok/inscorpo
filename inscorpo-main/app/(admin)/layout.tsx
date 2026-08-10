"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert, Landmark, Award, Users, Calendar,
  BarChart3, Settings, LogOut, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--corp-bg)" }}>
      {/* Side Navigation bar */}
      <aside className="w-64 flex flex-col h-screen flex-shrink-0 bg-corp-surface border-r"
        style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
      >
        <div className="flex items-center gap-2.5 p-4 border-b h-16" style={{ borderColor: "var(--corp-border)" }}>
          <div className="w-8 h-8 rounded-lg bg-corp-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--corp-text)" }}>INSYT Admin</span>
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-corp-text-tertiary">Platform Controls</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Overview Analytics", icon: BarChart3, href: "/admin" },
            { label: "System Users", icon: Users, href: "/admin/users" },
            { label: "Course Management", icon: Landmark, href: "/admin/courses" },
            { label: "Certifications Log", icon: Award, href: "/admin/certificates" },
            { label: "Workshop Events", icon: Calendar, href: "/admin/events" },
            { label: "Global Settings", icon: Settings, href: "/admin/settings" }
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                style={{
                  color: active ? "var(--corp-accent)" : "var(--corp-text-secondary)",
                  background: active ? "var(--corp-accent-light)" : "transparent"
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t space-y-1" style={{ borderColor: "var(--corp-border)" }}>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-corp-bg-secondary"
            style={{ color: "var(--corp-text-secondary)" }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-corp-bg-secondary"
            style={{ color: "var(--corp-text-secondary)" }}
          >
            <LogOut size={18} />
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top controls */}
        <header className="h-16 flex items-center justify-between px-6 border-b"
          style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
        >
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--corp-text-tertiary)" }}>
            <span>INSYT.OS</span>
            <span>{"//"}</span>
            <span className="font-semibold text-corp-text">Admin Command</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-600">
              <ShieldAlert size={13} />
              Super Administrator
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
