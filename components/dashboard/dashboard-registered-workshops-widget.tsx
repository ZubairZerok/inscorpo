"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Timer } from "lucide-react";
import Link from "next/link";
import { WORKSHOPS_DATA, WorkshopDetail } from "@/lib/data/workshops";
import { fetchUserWorkshopBookings } from "@/lib/db";
import { useAuth } from "@/components/providers/auth-provider";

function parseEventTargetDate(dateStr: string, timeStr: string): Date {
  try {
    const cleanedDate = dateStr.replace(/^[A-Za-z]+,\s*/, "");
    const startTimeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (cleanedDate && startTimeMatch) {
      let hours = parseInt(startTimeMatch[1], 10);
      const minutes = parseInt(startTimeMatch[2], 10);
      const ampm = startTimeMatch[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const parsed = new Date(`${cleanedDate} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  } catch {
    // fallback
  }
  return new Date("2026-08-15T19:30:00+06:00");
}

function calculateTimeLeft(targetDate: Date) {
  const diff = targetDate.getTime() - new Date().getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isLive: false };
}

export function DashboardRegisteredWorkshopsWidget() {
  const { user } = useAuth();
  const [registeredWorkshops, setRegisteredWorkshops] = useState<WorkshopDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    const loadUserBookings = async () => {
      setLoading(true);
      try {
        const storedIds: string[] = JSON.parse(localStorage.getItem("insyt_booked_workshops") || "[]");
        const dbBookings = user ? await fetchUserWorkshopBookings(user.$id) : [];

        const bookedSet = new Set<string>(storedIds);
        dbBookings.forEach((b: any) => {
          if (b.workshopId) bookedSet.add(b.workshopId);
          if (b.$id) bookedSet.add(b.$id);
        });

        // Match against WORKSHOPS_DATA
        const matched = WORKSHOPS_DATA.filter((w) =>
          bookedSet.has(w.id) ||
          Array.from(bookedSet).some((id) => id.includes(w.id) || w.id.includes(id))
        );

        setRegisteredWorkshops(matched);
      } catch {
        setRegisteredWorkshops([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserBookings();
  }, [user]);

  useEffect(() => {
    if (registeredWorkshops.length === 0) return;

    const targetDate = parseEventTargetDate(registeredWorkshops[0].date, registeredWorkshops[0].time);
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [registeredWorkshops]);

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-mono"
    >
      {registeredWorkshops.length > 0 ? (
        <div
          className="p-5 rounded-2xl border-2 border-emerald-500 shadow-[5px_5px_0px_0px_#047857] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #0f2b48 50%, #1e1b4b 100%)",
          }}
        >
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-400 text-emerald-950 border border-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={12} /> SEAT CONFIRMED &amp; REGISTERED
              </span>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                BAU Career Club (BAUCC) x INSYT
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-wide truncate">
              🎟️ {registeredWorkshops[0].title}
            </h3>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-emerald-200 font-sans">
              <span className="flex items-center gap-1"><Calendar size={13} className="text-emerald-400" /> {registeredWorkshops[0].date}</span>
              <span className="flex items-center gap-1"><Clock size={13} className="text-emerald-400" /> {registeredWorkshops[0].time}</span>
              <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-400" /> Verified Pass Issued</span>
            </div>
          </div>

          {/* Countdown Timer Block */}
          <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Timer size={12} className="animate-pulse" /> Event Starts In
            </span>
            <div className="flex items-center gap-1 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-emerald-500/50 shadow-[3px_3px_0px_0px_#047857]">
              <div className="flex flex-col items-center px-1.5 min-w-[34px]">
                <span className="text-base sm:text-lg font-black text-amber-400 leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-black uppercase text-emerald-300/90 mt-0.5">DAYS</span>
              </div>
              <span className="text-emerald-400 font-black text-sm pb-2">:</span>
              <div className="flex flex-col items-center px-1.5 min-w-[34px]">
                <span className="text-base sm:text-lg font-black text-amber-400 leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-black uppercase text-emerald-300/90 mt-0.5">HRS</span>
              </div>
              <span className="text-emerald-400 font-black text-sm pb-2">:</span>
              <div className="flex flex-col items-center px-1.5 min-w-[34px]">
                <span className="text-base sm:text-lg font-black text-amber-400 leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-black uppercase text-emerald-300/90 mt-0.5">MIN</span>
              </div>
              <span className="text-emerald-400 font-black text-sm pb-2">:</span>
              <div className="flex flex-col items-center px-1.5 min-w-[34px]">
                <span className="text-base sm:text-lg font-black text-amber-400 leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-black uppercase text-emerald-300/90 mt-0.5">SEC</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="p-5 rounded-2xl border-2 border-[#2563eb] shadow-[5px_5px_0px_0px_#1e3a8a] text-white flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: "var(--corp-surface)" }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                BAUCC x INSYT LIVE MASTERCLASS
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Sparkles size={13} /> +150 XP Seat Reward
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase text-corp-text">
              CV Writing &amp; LinkedIn Hacks with Niaz Ahmed
            </h3>
            <p className="text-xs font-sans font-medium text-corp-text-secondary">
              Master ATS-friendly CV engineering &amp; LinkedIn recruiter hacks with Bangladesh&apos;s #1 CV Engineer (Founder &amp; CEO, Corporate Ask).
            </p>
          </div>

          <a
            href="https://forms.gle/qYevAczJCgUe4KVPA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 text-center"
          >
            <Ticket size={14} />
            <span>Register Now</span>
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </motion.div>
  );
}
