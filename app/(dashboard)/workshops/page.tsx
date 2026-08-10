"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, User, Sparkles, Check, CheckCircle2, Flame, AlertCircle, RefreshCw,
  Presentation, BookOpen, BarChart3, Brain, Briefcase, TrendingUp, Ticket, ArrowRight,
  ShieldCheck, Award, QrCode
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { fetchWorkshops, fetchUserWorkshopBookings } from "@/lib/db";
import { useAuth } from "@/components/providers/auth-provider";
import { WORKSHOPS_DATA, WorkshopDetail } from "@/lib/data/workshops";
import { WorkshopRegistrationModal } from "@/components/workshops/workshop-registration-modal";
import Link from "next/link";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function WorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<WorkshopDetail[]>(WORKSHOPS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  // Modal State
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab filter: "all" vs "my_tickets"
  const [activeTab, setActiveTab] = useState<"all" | "my_tickets">("all");

  const loadData = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const [dbWorkshops, userBookings] = await Promise.all([
        fetchWorkshops(),
        user ? fetchUserWorkshopBookings(user.$id) : Promise.resolve([]),
      ]);

      if (dbWorkshops && dbWorkshops.length > 0) {
        const mapped: WorkshopDetail[] = dbWorkshops.map((w: any, idx: number) => {
          const wid = w.id || w.$id || WORKSHOPS_DATA[idx]?.id || "mto-assessment-masterclass";
          const matchLocal = WORKSHOPS_DATA.find(
            (item) => item.id === wid || item.id === w.id || item.title === w.title
          );
          if (matchLocal) return { ...matchLocal, id: matchLocal.id };

          return {
            id: wid,
            title: w.title || "Corporate Executive Workshop",
            tagline: w.description || "Interactive Executive Training Session",
            category: w.level || "Corporate",
            level: (w.level || "Intermediate") as any,
            date: w.date || "Upcoming Saturday",
            time: w.time ? `${w.time} (${w.duration || "2 Hours"})` : "7:30 PM (BST)",
            duration: w.duration || "2.0 Hours",
            status: "upcoming" as const,
            spotsRemaining: w.spots || 20,
            totalCapacity: 150,
            xpReward: 100,
            examXpReward: 150,
            hostOrg: "BAU Business Club (BAUBC) x INSYT",
            instructor: {
              name: w.host || "Corporate Specialist",
              role: "Executive Trainer",
              company: "INSYT Partner Network",
              avatar: "CT",
              bio: "Senior corporate practitioner with extensive field experience.",
            },
            venue: "Live Zoom Executive Suite",
            description: w.description || "",
            agenda: [],
            learningOutcomes: [],
            credentialName: "BAUBC Verified Certificate",
            examQuestions: [],
          };
        });
        setWorkshops(mapped);
      } else {
        setWorkshops(WORKSHOPS_DATA);
      }

      const bookedSet = new Set<string>();
      userBookings.forEach((b: any) => {
        if (b.workshopId) bookedSet.add(b.workshopId);
        if (b.$id) bookedSet.add(b.$id);
      });
      try {
        const storedIds: string[] = JSON.parse(localStorage.getItem("insyt_booked_workshops") || "[]");
        storedIds.forEach((id: string) => bookedSet.add(id));
      } catch {
        /* fallback */
      }
      setBookedIds(bookedSet);
    } catch {
      setWorkshops(WORKSHOPS_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOpenRegistration = (w: WorkshopDetail, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedWorkshop(w);
    setIsModalOpen(true);
  };

  const displayedWorkshops = activeTab === "all"
    ? workshops
    : workshops.filter((w) => bookedIds.has(w.id));

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-6 font-sans pb-24 text-slate-900 dark:text-white">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            <Award size={13} /> Partnered with BAU Business Club (BAUBC)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase flex items-center gap-2 text-corp-text">
            <Presentation className="w-8 h-8 text-[#2563eb]" /> Live Workshops &amp; Credentials
          </h1>
          <p className="text-xs sm:text-sm font-medium text-corp-text-secondary">
            Register for live masterclasses, obtain digital event passes, and earn verified credentials issued by BAUBC.
          </p>
        </div>

        {/* Tab switcher — Blue Borders */}
        <div className="flex p-1.5 rounded-xl border-2 border-blue-400 bg-corp-surface font-mono text-xs font-extrabold self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            All Workshops ({workshops.length})
          </button>
          <button
            onClick={() => setActiveTab("my_tickets")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "my_tickets"
                ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_#1e3a8a]"
                : "text-corp-text-secondary hover:text-corp-text"
            }`}
          >
            <Ticket size={13} />
            My Tickets ({bookedIds.size})
          </button>
        </div>
      </motion.div>

      {/* State: Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 font-mono">
          <div className="text-xs font-extrabold text-corp-text-tertiary">Loading workshops...</div>
        </div>
      ) : fetchError ? (
        <motion.div variants={item} className="flex flex-col items-center gap-4 py-16 font-mono">
          <AlertCircle size={32} className="text-rose-500" />
          <p className="text-sm font-extrabold uppercase text-corp-text">Could not load workshops</p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold font-mono bg-[#2563eb] text-white uppercase shadow-[3px_3px_0px_0px_#1e3a8a]"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-5 font-mono">
          {displayedWorkshops.length === 0 ? (
            <div className="py-16 text-center text-xs font-extrabold rounded-xl border-2 border-dashed border-blue-400 bg-corp-surface text-corp-text-tertiary">
              {activeTab === "my_tickets"
                ? "You haven't registered for any workshops yet. Book a seat below!"
                : "No workshops available at the moment."}
            </div>
          ) : (
            displayedWorkshops.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] overflow-hidden bg-corp-surface group transition-all hover:-translate-y-0.5"
              >
                {/* Left: Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                      {w.hostOrg}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-[#2563eb] border border-blue-300">
                      {w.category} • {w.level}
                    </span>
                    <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
                      <Flame size={13} className="animate-pulse fill-amber-500" />
                      {w.spotsRemaining} Seats Left
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black uppercase text-corp-text group-hover:text-[#2563eb] transition-colors">
                      <Link href={`/workshops/${w.id}`}>{w.title}</Link>
                    </h3>
                    <p className="text-xs font-sans font-medium mt-1 leading-relaxed text-corp-text-secondary">
                      {w.tagline || w.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-corp-text-tertiary">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#2563eb]" /> {w.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#2563eb]" /> {w.time}</span>
                    <span className="flex items-center gap-1.5"><User size={13} className="text-[#2563eb]" /> {w.instructor.name} ({w.instructor.company})</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div
                  className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-3 pt-4 md:pt-0 border-t-2 md:border-t-0 border-blue-400/40 flex-shrink-0"
                >
                  <div className="text-xs font-mono">
                    <p className="font-extrabold text-[#2563eb] flex items-center gap-1">
                      <Sparkles size={12} />
                      +{w.xpReward} XP Reward
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/workshops/${w.id}`}
                      className="px-4 py-2.5 rounded-xl text-xs font-mono font-extrabold border-2 border-blue-400 hover:bg-corp-bg-secondary text-corp-text flex items-center gap-1 transition-all"
                    >
                      <span>Details &amp; Exam</span>
                      <ArrowRight size={13} />
                    </Link>

                    {bookedIds.has(w.id) ? (
                      <Link
                        href={`/workshops/${w.id}`}
                        className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500/15 text-emerald-600 border-2 border-emerald-500 uppercase flex items-center gap-1"
                      >
                        <Check size={13} />
                        Ticket Ready
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleOpenRegistration(w, e)}
                        className="px-5 py-2.5 rounded-xl text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 active:scale-95 cursor-pointer z-10"
                      >
                        <Ticket size={13} />
                        Book Seat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Registration Modal Form */}
      <WorkshopRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshop={selectedWorkshop}
        onSuccess={(ticketCode) => {
          if (selectedWorkshop) {
            setBookedIds((prev) => new Set([...prev, selectedWorkshop.id]));
          }
        }}
      />
    </motion.div>
  );
}
