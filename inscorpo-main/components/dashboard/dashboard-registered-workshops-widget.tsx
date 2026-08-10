"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, ArrowRight, Presentation, Award, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { WORKSHOPS_DATA, WorkshopDetail } from "@/lib/data/workshops";
import { fetchUserWorkshopBookings } from "@/lib/db";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardRegisteredWorkshopsWidget() {
  const { user } = useAuth();
  const [registeredWorkshops, setRegisteredWorkshops] = useState<WorkshopDetail[]>([]);
  const [loading, setLoading] = useState(true);

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
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-400 text-emerald-950 border border-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={12} /> SEAT CONFIRMED &amp; REGISTERED
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                BAU Business Club x INSYT
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

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/workshops/${registeredWorkshops[0].id}`}
              className="px-5 py-3 rounded-xl text-xs font-black uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] flex items-center gap-2 active:scale-95 text-center"
            >
              <Ticket size={14} />
              <span>View Ticket &amp; Exam</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="p-5 rounded-2xl border-2 border-[#2563eb] shadow-[5px_5px_0px_0px_#1e3a8a] text-white flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: "var(--corp-surface)" }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                BAUBC x INSYT LIVE MASTERCLASS
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Sparkles size={13} /> +100 XP Seat Reward
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase text-corp-text">
              Management Trainee (MTO) Assessment Center Masterclass
            </h3>
            <p className="text-xs font-sans font-medium text-corp-text-secondary">
              Master practical case solving &amp; get co-branded event certificates issued by BAU Business Club.
            </p>
          </div>

          <Link
            href="/workshops"
            className="px-5 py-3 rounded-xl text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 text-center"
          >
            <Ticket size={14} />
            <span>Book Seat Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </motion.div>
  );
}
