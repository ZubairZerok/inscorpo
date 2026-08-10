"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Search, Filter, Trophy, Users, Clock, Award, 
  ChevronRight, CheckCircle2, Play, Sparkles, X, Gift, ArrowUpRight,
  Briefcase, Building2, ShieldCheck, MapPin, Tag, Check, Calendar
} from "lucide-react";
import { challengesData, Challenge } from "@/lib/data/challenges";
import { useUser } from "@/components/providers/user-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ChallengesPage() {
  const router = useRouter();
  const { state, addNotification } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Past">("All");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [selectedPpoOnly, setSelectedPpoOnly] = useState<boolean>(false);
  const [activeChallengeModal, setActiveChallengeModal] = useState<Challenge | null>(null);
  const [registeredSuccessId, setRegisteredSuccessId] = useState<string | null>(null);

  const categories = Array.from(new Set(challengesData.map(c => c.category)));
  const featuredChallenges = challengesData.filter(c => c.ppoOffered || c.registeredCount > 10000);

  const filteredChallenges = challengesData.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.hostEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === "All" ? true :
                       activeTab === "Active" ? c.status === "Active" :
                       c.status === "Finished";
    
    const matchesCat = selectedCategory ? c.category === selectedCategory : true;
    const matchesTeam = selectedTeamSize ? c.teamSize.includes(selectedTeamSize) : true;
    const matchesPpo = selectedPpoOnly ? Boolean(c.ppoOffered) : true;

    return matchesSearch && matchesTab && matchesCat && matchesTeam && matchesPpo;
  });

  const activeCount = challengesData.filter(c => c.status === "Active").length;
  const finishedCount = 73;

  const handleRegisterChallenge = (challenge: Challenge) => {
    setRegisteredSuccessId(challenge.id);
    addNotification({
      type: "achievement",
      title: "Registered for Opportunity",
      message: `Successfully registered for ${challenge.title}. Check your dashboard for submission deadlines.`
    });
    setTimeout(() => {
      setRegisteredSuccessId(null);
      setActiveChallengeModal(null);
      router.push(`/challenges/${challenge.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-20">

      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white" style={{ background: "#2563eb", boxShadow: "3px 3px 0px 0px #1e3a8a" }}>
            <Trophy size={14} /> National Opportunity Hub
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase" style={{ color: "var(--corp-text)" }}>
            Competitions &amp; PPI Offers
          </h1>

          <p className="text-sm font-medium max-w-2xl font-sans" style={{ color: "var(--corp-text-secondary)" }}>
            Participate in official hackathons, FMCG case challenges, and recruitment drives with Pre-Placement Offers (PPOs/PPIs) and cash prizes.
          </p>
        </div>

        {/* Live Metrics Block — Blue Borders */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] flex-shrink-0 font-mono"
          style={{ background: "var(--corp-surface)" }}
        >
          <div className="text-center px-3">
            <p className="text-2xl font-black text-amber-500">{activeCount}</p>
            <p className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Active Drives</p>
          </div>
          <div className="w-0.5 h-10 bg-blue-400/40" />
          <div className="text-center px-3">
            <p className="text-2xl font-black text-[#2563eb]">21,340+</p>
            <p className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Opportunities</p>
          </div>
          <div className="w-0.5 h-10 bg-blue-400/40" />
          <div className="text-center px-3">
            <p className="text-2xl font-black text-rose-500">53,920+</p>
            <p className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Candidates</p>
          </div>
        </div>
      </div>

      {/* FEATURED COMPETITIONS */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
            <Sparkles size={16} className="text-amber-500" /> Featured Premier Competitions &amp; PPO Drives
          </h2>
          <span className="text-[10px] font-extrabold text-[#2563eb] uppercase">Auto-Updated Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredChallenges.slice(0, 3).map((fc) => (
            <div
              key={fc.id}
              onClick={() => setActiveChallengeModal(fc)}
              className="p-5 rounded-2xl text-white space-y-3 cursor-pointer hover:-translate-y-1 transition-all relative overflow-hidden border-2 border-blue-400"
              style={{
                background: "#2563eb",
                boxShadow: "5px 5px 0px 0px #1e3a8a",
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase">
                <span className="text-amber-300 truncate max-w-[180px]">{fc.hostEntity}</span>
                {fc.ppoOffered && (
                  <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 font-black flex items-center gap-1 border border-amber-500">
                    <Briefcase size={10} /> PPI Offer
                  </span>
                )}
              </div>

              <h3 className="font-black text-sm uppercase leading-snug line-clamp-2 text-white">{fc.title}</h3>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20 text-white/90 font-bold">
                <span className="text-amber-300">{fc.prize.split("+")[0]}</span>
                <span className="text-[10px]">{fc.daysLeft || "Active"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS — Blue Borders */}
      <div
        className="p-4 rounded-2xl border-2 border-blue-500 shadow-[4px_4px_0px_0px_#2563eb] space-y-4 font-mono"
        style={{ background: "var(--corp-surface)" }}
      >
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("All")}
              className={cn(
                "px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 cursor-pointer",
                activeTab === "All"
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              )}
            >
              All Drives
            </button>
            <button
              onClick={() => setActiveTab("Active")}
              className={cn(
                "px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 flex items-center gap-1.5 cursor-pointer",
                activeTab === "Active"
                  ? "bg-amber-400 text-amber-950 border-amber-500 shadow-[3px_3px_0px_0px_#78350f]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              )}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("Past")}
              className={cn(
                "px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 cursor-pointer",
                activeTab === "Past"
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              )}
            >
              Past Library ({finishedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563eb]" />
            <input
              type="text"
              placeholder="Search by company, title, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 focus:border-[#2563eb] transition-all bg-corp-surface text-corp-text shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* OPPORTUNITIES GRID — Blue Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {filteredChallenges.map((challenge) => {
          const isDone = state.completedChallengeIds.includes(challenge.id);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="flex flex-col h-full rounded-xl p-6 border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] overflow-hidden"
                style={{ background: "var(--corp-surface)" }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-[#2563eb] uppercase tracking-wider block truncate max-w-[190px]">
                      {challenge.hostEntity}
                    </span>
                    <span className="text-[10px] font-bold text-corp-text-tertiary flex items-center gap-1">
                      <MapPin size={10} /> {challenge.location} · {challenge.teamSize}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {challenge.ppoOffered && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1">
                        <Briefcase size={9} /> PPI Offer
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-[#2563eb] border border-blue-300">
                      {challenge.fee}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-extrabold uppercase text-base leading-snug mb-2 line-clamp-2" style={{ color: "var(--corp-text)" }}>
                    {challenge.title}
                  </h3>
                  <p className="text-xs line-clamp-3 leading-relaxed font-sans font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                    {challenge.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {challenge.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-[#2563eb] border border-blue-300">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t-2 border-blue-400/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-extrabold text-amber-500">
                      <Gift size={13} /> {challenge.prize.split("+")[0]}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-corp-text-tertiary font-extrabold">
                      <Users size={12} /> {challenge.registeredCount.toLocaleString()} Candidates
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveChallengeModal(challenge)}
                    className={cn(
                      "w-full py-3 rounded-lg font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider border-2 cursor-pointer",
                      isDone 
                        ? "bg-blue-50 text-[#2563eb] border-blue-400"
                        : "bg-[#2563eb] hover:bg-blue-600 text-white shadow-[3px_3px_0px_0px_#1e3a8a] border-blue-400"
                    )}
                  >
                    {isDone ? (
                      <><CheckCircle2 size={15} /> Registered</>
                    ) : (
                      <><Zap size={14} className="fill-current" /> View Details &amp; Register</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAILS MODAL — Blue Border */}
      <AnimatePresence>
        {activeChallengeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setActiveChallengeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative border-4 border-blue-500 overflow-hidden font-mono"
              style={{ background: "var(--corp-surface)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveChallengeModal(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-corp-bg-secondary text-corp-text-tertiary cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#2563eb] text-white border border-blue-300">
                    {activeChallengeModal.hostEntity}
                  </span>
                  {activeChallengeModal.ppoOffered && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                      PPO Included
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold uppercase" style={{ color: "var(--corp-text)" }}>
                  {activeChallengeModal.title}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-corp-bg-secondary space-y-2 border-2 border-blue-400/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Host Organization:</span>
                  <span className="font-extrabold text-[#2563eb]">{activeChallengeModal.hostEntity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Eligibility &amp; Team Size:</span>
                  <span className="font-extrabold" style={{ color: "var(--corp-text)" }}>{activeChallengeModal.teamSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corp-text-tertiary">Prize / Compensation:</span>
                  <span className="font-extrabold text-amber-500">{activeChallengeModal.prize}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase text-corp-text-tertiary">Opportunity Brief</h4>
                <p className="text-xs leading-relaxed text-corp-text-secondary font-sans font-medium">
                  {activeChallengeModal.description}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-blue-400/40 flex items-center justify-between gap-4">
                <span className="text-xs font-extrabold text-[#2563eb] flex items-center gap-1">
                  <ShieldCheck size={16} /> Verified Opportunity
                </span>

                {registeredSuccessId === activeChallengeModal.id ? (
                  <span className="px-6 py-2.5 rounded-lg text-xs font-extrabold text-[#2563eb] bg-blue-50 border border-[#2563eb] flex items-center gap-2">
                    <Check size={16} /> Confirmed
                  </span>
                ) : (
                  <button
                    onClick={() => handleRegisterChallenge(activeChallengeModal)}
                    className="px-6 py-3 rounded-lg text-xs font-extrabold text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-[3px_3px_0px_0px_#000] border-2 border-slate-950 uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Registration</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
