"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert, Landmark, Award, Users, Calendar,
  BarChart3, Settings, LogOut, Sun, Moon, Database, RefreshCw
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
    <div className="flex h-screen overflow-hidden font-mono bg-corp-bg text-corp-text">
      {/* Side Navigation bar */}
      <aside className="w-64 flex flex-col h-screen flex-shrink-0 bg-corp-surface border-r-2 border-blue-400/40">
        <div className="flex items-center gap-3 p-4 border-b-2 border-blue-400/40 h-16">
          <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center flex-shrink-0 border-2 border-blue-300 shadow-sm">
            IN
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-wider text-corp-text">INSYT Admin</span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#2563eb]">Control Center</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { label: "Cloud Sync & Overview", icon: Database, href: "/admin" },
            { label: "Platform Tasks & Events", icon: RefreshCw, href: "/admin#tasks" },
            { label: "Return to SAAS Hub", icon: LogOut, href: "/jobs" },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-black uppercase transition-all cursor-pointer border ${
                  active
                    ? "bg-[#2563eb] text-white border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a]"
                    : "bg-corp-bg-secondary text-corp-text border-transparent hover:border-blue-400/40 hover:bg-corp-surface"
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t-2 border-blue-400/40 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer border border-blue-400/40 bg-corp-bg-secondary hover:bg-corp-surface text-corp-text"
          >
            {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-500" />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <Link
            href="/jobs"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-black uppercase bg-[#2563eb] text-white hover:bg-blue-600 border border-blue-300 shadow-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top controls */}
        <header className="h-16 flex items-center justify-between px-6 border-b-2 border-blue-400/40 bg-corp-surface">
          <div className="flex items-center gap-2 text-xs font-bold text-corp-text-tertiary">
            <span className="text-[#2563eb]">INSYT.OS</span>
            <span>{"//"}</span>
            <span className="font-extrabold uppercase text-corp-text">Super Administrator Command</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/10 text-[#2563eb] border border-blue-400/40">
              <ShieldAlert size={13} />
              Super Administrator
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-corp-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
