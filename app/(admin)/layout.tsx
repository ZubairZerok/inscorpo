"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert, LogOut, Database, RefreshCw, Layers, Lock, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const ALLOWED_ADMIN_EMAILS = [
  "z65gt9@gmail.com",
  "zubaiirh@gmail.com"
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const userEmail = user?.email?.toLowerCase() || "";
  const isAllowedAdmin = user && ALLOWED_ADMIN_EMAILS.includes(userEmail);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center font-mono p-6">
        <div className="p-6 rounded-sm border-2 border-blue-400 bg-white shadow-[4px_4px_0px_0px_#2563eb] flex items-center gap-3">
          <RefreshCw size={20} className="animate-spin text-[#2563eb]" />
          <span className="text-xs font-black uppercase text-slate-900">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Access Restricted Lockout Screen
  if (!isAllowedAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full p-8 rounded-sm border-2 border-red-500 bg-white shadow-[6px_6px_0px_0px_#dc2626] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto text-red-600 shadow-sm">
            <Lock size={30} />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase text-white bg-red-600">
              SECURITY LOCKOUT
            </span>
            <h1 className="text-xl font-black uppercase text-slate-900">
              Admin Access Restricted
            </h1>
            <p className="text-xs font-sans font-bold text-slate-600">
              Super Administrator portal is strictly restricted to verified administrative accounts:
            </p>
            <div className="py-2.5 px-3 rounded-sm bg-slate-100 border border-red-500/30 text-[11px] font-mono text-slate-900 font-black space-y-1 text-left">
              <div className="flex items-center gap-2 text-red-600"><ShieldAlert size={12} /> z65gt9@gmail.com</div>
              <div className="flex items-center gap-2 text-red-600"><ShieldAlert size={12} /> zubaiirh@gmail.com</div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 font-sans">
              {user ? `Currently authenticated as: ${user.email}` : "No active session detected. Please sign in with an admin account."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/login"
              className="flex-1 py-2.5 rounded-full text-xs font-black uppercase bg-red-600 hover:bg-red-700 text-white border border-red-400 shadow-sm transition-all text-center"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/jobs"
              className="flex-1 py-2.5 rounded-full text-xs font-black uppercase bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-all text-center"
            >
              Return to App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin Layout (Forced Light Mode SAAS Theme)
  return (
    <div className="flex h-screen overflow-hidden font-mono bg-[#f8fafc] text-slate-900">
      {/* Side Navigation bar */}
      <aside className="w-64 flex flex-col h-screen flex-shrink-0 bg-white border-r-2 border-blue-400/40">
        <div className="flex items-center gap-3 p-4 border-b-2 border-blue-400/40 h-16">
          <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center flex-shrink-0 border-2 border-blue-300 shadow-sm">
            IN
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black uppercase tracking-wider text-slate-900 truncate">INSYT Admin</span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#2563eb]">Control Center</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-black uppercase transition-all cursor-pointer border ${
              pathname === "/admin"
                ? "bg-[#2563eb] text-white border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "bg-slate-100 text-slate-800 border-transparent hover:border-blue-400/40 hover:bg-white"
            }`}
          >
            <Database size={16} />
            <span>Cloud Sync & Overview</span>
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-black uppercase transition-all cursor-pointer border bg-slate-100 text-slate-800 border-transparent hover:border-blue-400/40 hover:bg-white"
          >
            <LogOut size={16} />
            <span>Return to SAAS Hub</span>
          </Link>
        </nav>

        <div className="p-3 border-t-2 border-blue-400/40 space-y-2 bg-slate-50">
          <div className="px-3 py-2 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-800 font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>

          <Link
            href="/jobs"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-black uppercase bg-[#2563eb] text-white hover:bg-blue-600 border border-blue-300 shadow-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top controls */}
        <header className="h-16 flex items-center justify-between px-6 border-b-2 border-blue-400/40 bg-white">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-[#2563eb]">INSYT.OS</span>
            <span>{"//"}</span>
            <span className="font-extrabold uppercase text-slate-900">Super Administrator Command</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/10 text-[#2563eb] border border-blue-400/40">
              <ShieldAlert size={13} />
              {user.email}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
