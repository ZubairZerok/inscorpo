"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, Users, Ticket, Trophy, Sparkles,
  Flame, CheckCircle2, AlertCircle, ArrowRight, X, Search, Filter,
  Share2, Shield, Gift, ExternalLink, Timer, ChevronRight, Grid3X3, List,
  BarChart3, Globe, Brain, Award
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

interface EventItem {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  time: string;
  location: string;
  category: "Competition" | "Workshop" | "Summit" | "Webinar";
  status: "Upcoming" | "Live Now" | "Past";
  description: string;
  host: string;
  hostLogoIcon: React.ReactNode;
  capacity: number;
  registered: number;
  prize?: string;
  xpReward: number;
  passportStamp: string;
  credentialTitle: string;
  featured?: boolean;
  voucherCode?: string;
  tags: string[];
}

const EVENTS: EventItem[] = [
  {
    id: "deckathon-2026",
    title: "Deckathon 2026 — Corporate PPT Championship",
    date: "2026-09-05",
    displayDate: "Sep 5, 2026",
    time: "10:00 AM – 5:00 PM",
    location: "BAU Campus, Mymensingh",
    category: "Competition",
    status: "Upcoming",
    description: "Bangladesh's premier corporate presentation competition. Build a real business pitch for a top MNC brief in 4 hours. Judges from Unilever, BRAC & GP.",
    host: "BAUBC × INSYT",
    hostLogoIcon: <Trophy size={20} className="text-[#2563eb]" />,
    capacity: 200,
    registered: 178,
    prize: "৳50,000 + PPO Interviews",
    xpReward: 500,
    passportStamp: "DECK26",
    credentialTitle: "Deckathon 2026 Participant",
    featured: true,
    voucherCode: "DECKATHON26",
    tags: ["PPT", "Business Case", "MNC", "PPO"],
  },
  {
    id: "beyond-summit-26",
    title: "BEYOND Summit 2026 — Development Sector Career Fair",
    date: "2026-09-20",
    displayDate: "Sep 20, 2026",
    time: "9:00 AM – 6:00 PM",
    location: "Dhaka International Convention City",
    category: "Summit",
    status: "Upcoming",
    description: "Connecting 500+ students with UNDP, World Bank, BRAC, and icddr,b. Direct recruitment drives + UN fellowship info sessions.",
    host: "BEYOND Initiative × INSYT",
    hostLogoIcon: <Globe size={20} className="text-[#2563eb]" />,
    capacity: 500,
    registered: 312,
    xpReward: 300,
    passportStamp: "BEYOND",
    credentialTitle: "BEYOND Summit 2026 Delegate",
    featured: true,
    voucherCode: "BEYOND26",
    tags: ["NGO", "UN", "Development", "Fellowship"],
  },
  {
    id: "excel-live-aug",
    title: "Excel Mastery Live Bootcamp — Financial Modeling",
    date: "2026-08-22",
    displayDate: "Aug 22, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "Online (Zoom)",
    category: "Workshop",
    status: "Upcoming",
    description: "3-hour live session covering advanced Excel financial modeling, VLOOKUP arrays, PivotTables for corporate reporting.",
    host: "INSYT Academy",
    hostLogoIcon: <BarChart3 size={20} className="text-[#2563eb]" />,
    capacity: 100,
    registered: 87,
    xpReward: 150,
    passportStamp: "EXCEL",
    credentialTitle: "Advanced Excel Workshop",
    featured: false,
    tags: ["Excel", "Finance", "Live"],
  },
  {
    id: "ace-case-challenge",
    title: "ACE 2026 — Analytical Case Excellence",
    date: "2026-08-15",
    displayDate: "Aug 15, 2026",
    time: "Full Day Event",
    location: "IBA, University of Dhaka",
    category: "Competition",
    status: "Upcoming",
    description: "FMCG Case study championship with real business briefs from top MNCs. Open to all university students.",
    host: "IBA DSU × INSYT",
    hostLogoIcon: <Brain size={20} className="text-[#2563eb]" />,
    capacity: 300,
    registered: 290,
    prize: "৳30,000 + Certificates",
    xpReward: 400,
    passportStamp: "ACE26",
    credentialTitle: "ACE Case Excellence Participant",
    featured: false,
    voucherCode: "ACE26",
    tags: ["Case Study", "FMCG", "Analytics"],
  },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] font-mono font-extrabold uppercase text-amber-300">{label}</span>
    </div>
  );
}

export default function EventsPage() {
  const { state, addXP, addNotification } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [claimedVoucher, setClaimedVoucher] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");

  const [countdown, setCountdown] = useState({ days: 28, hours: 14, mins: 32, secs: 10 });

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const featuredEvent = EVENTS.find((e) => e.featured) || EVENTS[0];

  const filtered = EVENTS.filter((e) => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleRegister = (event: EventItem) => {
    if (registeredIds.has(event.id)) return;

    setRegisteredIds((prev) => new Set(prev).add(event.id));

    addXP(event.xpReward, `Registered for event: ${event.title}`);

    addNotification({
      type: "achievement",
      title: `Registered for ${event.title.split("—")[0].trim()}!`,
      message: `Ticket confirmed. +${event.xpReward} XP awarded & credential stamp added to your profile!`,
    });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6 font-sans pb-16"
    >
      {/* Featured Banner */}
      <motion.div variants={item}>
        <div
          className="rounded-xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-2 border-blue-400 font-mono"
          style={{
            background: "#2563eb",
            boxShadow: "5px 5px 0px 0px #1e3a8a",
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
                  <Flame size={12} className="inline mr-1" /> Featured Event
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase bg-white/20 text-white border border-white/30">
                  {featuredEvent.category}
                </span>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  {featuredEvent.title}
                </h1>
                <p className="mt-2 text-xs text-blue-100 font-sans font-medium">{featuredEvent.description}</p>
              </div>

              {/* Fixed Position Date/Clock Meta Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono font-bold text-blue-100 flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 flex-shrink-0"><Calendar size={13} className="flex-shrink-0" /> {featuredEvent.displayDate}</span>
                <span className="inline-flex items-center gap-1.5 flex-shrink-0"><Clock size={13} className="flex-shrink-0" /> {featuredEvent.time}</span>
                <span className="inline-flex items-center gap-1.5 flex-shrink-0"><MapPin size={13} className="flex-shrink-0" /> {featuredEvent.location}</span>
              </div>

              {featuredEvent.prize && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-extrabold">
                  <Trophy size={14} className="fill-amber-300" />
                  <span>Prize: {featuredEvent.prize}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setSelectedEvent(featuredEvent)}
                  className="px-5 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-amber-500 shadow-[3px_3px_0px_0px_#78350f] flex items-center gap-2 cursor-pointer"
                >
                  <Ticket size={13} /> Register Now
                </button>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-5 rounded-xl border-2 border-white/30 bg-white/10 space-y-3 shadow-md flex-shrink-0">
              <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-300 text-center">
                <Timer size={11} className="inline mr-1" /> Event Starts In
              </p>
              <div className="flex items-center gap-4">
                <CountdownBlock label="Days" value={countdown.days} />
                <span className="text-white/40 text-xl font-extrabold">:</span>
                <CountdownBlock label="Hrs" value={countdown.hours} />
                <span className="text-white/40 text-xl font-extrabold">:</span>
                <CountdownBlock label="Min" value={countdown.mins} />
                <span className="text-white/40 text-xl font-extrabold">:</span>
                <CountdownBlock label="Sec" value={countdown.secs} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Controls — Blue Borders */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Competition", "Workshop", "Summit"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 ${
                activeCategory === cat
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-[#2563eb]" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs font-mono bg-corp-surface border-2 border-blue-400 text-corp-text focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>
      </motion.div>

      {/* Events Grid — Blue Borders */}
      {view === "list" && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((event) => {
            const registered = registeredIds.has(event.id);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] p-5 space-y-4 font-mono overflow-hidden"
                style={{ background: "var(--corp-surface)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2563eb]/15 text-[#2563eb] flex items-center justify-center flex-shrink-0 border-2 border-blue-400">
                    {event.hostLogoIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold uppercase leading-snug line-clamp-2" style={{ color: "var(--corp-text)" }}>
                      {event.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-sans font-medium leading-relaxed line-clamp-2" style={{ color: "var(--corp-text-secondary)" }}>
                  {event.description}
                </p>

                {/* Fixed Clock & Date Meta Strip */}
                <div className="flex flex-wrap gap-[#10px] text-xs font-bold text-corp-text-tertiary">
                  <span className="flex items-center gap-1 flex-shrink-0"><Calendar size={12} className="flex-shrink-0 text-[#2563eb]" /> {event.displayDate}</span>
                  <span className="flex items-center gap-1 flex-shrink-0"><Clock size={12} className="flex-shrink-0 text-[#2563eb]" /> {event.time}</span>
                  <span className="flex items-center gap-1 flex-shrink-0"><MapPin size={12} className="flex-shrink-0 text-[#2563eb]" /> {event.location}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t-2 border-blue-400/40">
                  <div className="text-xs font-extrabold text-[#2563eb] flex items-center gap-1">
                    <Sparkles size={12} /> +{event.xpReward} XP
                  </div>

                  {registered ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-blue-50 text-[#2563eb] border border-[#2563eb] flex items-center gap-1">
                      <CheckCircle2 size={13} /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ticket size={12} /> Register
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Registration Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg rounded-2xl border-4 border-blue-500 bg-white text-slate-900 p-6 space-y-5 z-10 font-mono shadow-[6px_6px_0px_0px_#1e3a8a]"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 uppercase leading-snug">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs text-slate-600 font-sans font-medium">{selectedEvent.description}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-400/40 space-y-2 text-xs text-slate-800 font-bold">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-[#2563eb]" /> {selectedEvent.displayDate}</div>
                <div className="flex items-center gap-2"><Clock size={14} className="text-[#2563eb]" /> {selectedEvent.time}</div>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-[#2563eb]" /> {selectedEvent.location}</div>
                <div className="flex items-center gap-2"><Award size={14} className="text-[#2563eb]" /> Organizer: {selectedEvent.host}</div>
              </div>

              <button
                onClick={() => {
                  handleRegister(selectedEvent);
                  setSelectedEvent(null);
                }}
                disabled={registeredIds.has(selectedEvent.id)}
                className="w-full py-3 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
              >
                {registeredIds.has(selectedEvent.id) ? "Already Registered ✓" : `Confirm Ticket (+${selectedEvent.xpReward} XP)`}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
