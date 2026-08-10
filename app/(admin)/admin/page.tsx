"use client";

import React, { useState } from "react";
import {
  Users, Award, Calendar, TrendingUp, DollarSign,
  CheckCircle2, ArrowUpRight
} from "lucide-react";
import { createTask, createEvent } from "@/lib/db";

const stats = [
  { label: "Total Revenue", value: "৳245,500", desc: "+18% from last month", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { label: "Active Learners", value: "12,540", desc: "+8% user signups", icon: Users, color: "text-corp-accent", bg: "bg-corp-accent/10" },
  { label: "Certificates Issued", value: "8,420", desc: "+15% pass rate increase", icon: Award, color: "text-amber-600", bg: "bg-amber-500/10" },
  { label: "Workshop Enrollees", value: "320", desc: "For next upcoming webinars", icon: Calendar, color: "text-purple-600", bg: "bg-purple-500/10" }
];

const logs = [
  { user: "Farhan Ahmed", action: "Completed Banking Mock Exam", status: "Score: 84%", time: "3 mins ago" },
  { user: "Nusrat Jahan", action: "Claimed Excel Formula Pack", status: "XP Spent: 2000", time: "10 mins ago" },
  { user: "Rafiul Islam", action: "Registered for BAUBC Webinar", status: "Seat Confirmed", time: "25 mins ago" },
  { user: "Mehedi Hasan", action: "Certified: Advanced Excel", status: "Token Generated", time: "1 hour ago" }
];

export default function AdminPage() {
  // Tasks Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskXp, setTaskXp] = useState("");
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [taskMessage, setTaskMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Events Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTaskLoading(true);
    setTaskMessage(null);
    try {
      await createTask({
        title: taskTitle,
        xp: parseInt(taskXp) || 0,
      });
      setTaskMessage({ text: "Global task published successfully to Appwrite DB!", type: "success" });
      setTaskTitle("");
      setTaskXp("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish task. Check Appwrite connection.";
      setTaskMessage({ text: message, type: "error" });
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEventLoading(true);
    setEventMessage(null);
    try {
      await createEvent({
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        type: eventType,
      });
      setEventMessage({ text: "Global event published successfully to Appwrite DB!", type: "success" });
      setEventTitle("");
      setEventDate("");
      setEventTime("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish event. Check Appwrite connection.";
      setEventMessage({ text: message, type: "error" });
    } finally {
      setIsEventLoading(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--corp-text)" }}>Overview Analytics</h1>
        <p className="text-[13px]" style={{ color: "var(--corp-text-secondary)" }}>
          Real-time metrics, system signups, payment statistics, and recent credential issuance audits.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl transition-all hover:shadow-md"
            style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-[12px] font-semibold text-corp-text-tertiary">{stat.label}</span>
                <h3 className="text-2xl font-bold font-mono" style={{ color: "var(--corp-text)" }}>{stat.value}</h3>
                <p className="text-[11px] text-corp-text-tertiary flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-600" />
                  {stat.desc}
                </p>
              </div>

              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: logs & analytics charts overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent logs */}
        <div className="lg:col-span-2 p-5 rounded-2xl space-y-4" style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}>
          <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--corp-border)" }}>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--corp-text)" }}>Recent Operators Activities</h3>
            <button className="text-[12px] font-semibold text-corp-accent flex items-center gap-0.5 hover:underline">
              Inspect logs <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--corp-border)" }}>
            {logs.map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-[13px]">
                <div className="space-y-0.5">
                  <p className="font-semibold" style={{ color: "var(--corp-text)" }}>{log.user}</p>
                  <p className="text-[11px]" style={{ color: "var(--corp-text-tertiary)" }}>{log.action} · {log.time}</p>
                </div>
                <span className="text-[12px] font-semibold font-mono text-corp-accent">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}>
          <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--corp-border)" }}>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--corp-text)" }}>System Health</h3>
          </div>

          <div className="space-y-3.5 text-[13px]">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--corp-text-secondary)" }}>API Gateway</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Stable</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--corp-text-secondary)" }}>Prisma DB Engine</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> 9ms Query</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--corp-text-secondary)" }}>Supabase Auth Proxy</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--corp-text-secondary)" }}>Vercel Edge Network</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> 100% Up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Tasks & Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Form */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}>
          <h3 className="text-[14px] font-bold pb-2 border-b" style={{ color: "var(--corp-text)", borderColor: "var(--corp-border)" }}>
            Publish Global Task
          </h3>
          <form onSubmit={handleCreateTask} className="space-y-4 text-[13px]">
            {taskMessage && (
              <div className={`p-2.5 rounded-lg border text-[12px] font-medium ${
                taskMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}>
                {taskMessage.text}
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Complete Banking Quiz"
                className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-corp-accent/30"
                style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>XP Reward</label>
              <input
                type="number"
                value={taskXp}
                onChange={(e) => setTaskXp(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-corp-accent/30"
                style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isTaskLoading}
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-corp-accent hover:bg-corp-accent-hover transition-colors disabled:opacity-75"
            >
              {isTaskLoading ? "Publishing..." : "Publish Task"}
            </button>
          </form>
        </div>

        {/* Event Form */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}>
          <h3 className="text-[14px] font-bold pb-2 border-b" style={{ color: "var(--corp-text)", borderColor: "var(--corp-border)" }}>
            Publish Global Event
          </h3>
          <form onSubmit={handleCreateEvent} className="space-y-4 text-[13px]">
            {eventMessage && (
              <div className={`p-2.5 rounded-lg border text-[12px] font-medium ${
                eventMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}>
                {eventMessage.text}
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Excel Workshop — BAUBC"
                className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-corp-accent/30"
                style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>Date</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. Jul 18"
                  className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-corp-accent/30"
                  style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>Time</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 3:00 PM"
                  className="w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-corp-accent/30"
                  style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: "var(--corp-text-secondary)" }}>Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none"
                style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text)" }}
              >
                <option>Workshop</option>
                <option>Competition</option>
                <option>Webinar</option>
                <option>Seminar</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isEventLoading}
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-corp-accent hover:bg-corp-accent-hover transition-colors disabled:opacity-75"
            >
              {isEventLoading ? "Publishing..." : "Publish Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
