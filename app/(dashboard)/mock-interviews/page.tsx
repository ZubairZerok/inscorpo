"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, Search, Building2, ChevronRight, BarChart, Sparkles, Trophy } from "lucide-react";
import { interviewScenarios } from "@/lib/data/interviews";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/providers/user-context";
import { RankExplainerModal } from "@/components/dashboard/rank-explainer-modal";

export default function MockInterviewsHub() {
  const { state } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const industries = Array.from(new Set(interviewScenarios.map((s) => s.industry)));

  const filteredInterviews = interviewScenarios.filter((interview) => {
    const matchesSearch =
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry ? interview.industry === selectedIndustry : true;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm">
            <Mic size={14} /> AI Mock Interviews · Live Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ color: "var(--corp-text)" }}>
            Get Corporate Interview-Ready
          </h1>
          <p className="text-xs font-sans font-medium max-w-2xl text-corp-text-secondary">
            Master behavioral and technical questions tailored to your target FMCG, Banking, and Tech roles. Evaluated live by OpenRouter AI.
          </p>
        </div>

        {/* Silver / Current Rank Badge trigger */}
        <div
          onClick={() => setRankModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 border-2 border-slate-950 font-black text-xs font-mono uppercase cursor-pointer hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 self-start sm:self-auto"
        >
          <Trophy size={16} />
          <span>Rank Perks &amp; Info</span>
        </div>
      </div>

      {/* Filters — Blue Borders */}
      <div className="flex flex-col sm:flex-row gap-3 font-mono">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563eb]" />
          <input
            type="text"
            placeholder="Search roles or companies (e.g., Unilever, MTO)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono font-extrabold outline-none border-2 border-blue-400 focus:border-[#2563eb] transition-all bg-corp-surface text-corp-text shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedIndustry(null)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 whitespace-nowrap cursor-pointer",
              selectedIndustry === null
                ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
            )}
          >
            All Categories
          </button>
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all border-2 whitespace-nowrap cursor-pointer",
                selectedIndustry === industry
                  ? "bg-[#2563eb] text-white border-blue-500 shadow-[3px_3px_0px_0px_#1e3a8a]"
                  : "text-corp-text border-blue-400/50 bg-corp-surface hover:bg-corp-bg-secondary"
              )}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Grid — Blue Border Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {filteredInterviews.map((interview, i) => {
          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div
                className="flex flex-col h-full rounded-xl border-2 border-blue-500 shadow-[5px_5px_0px_0px_#2563eb] overflow-hidden"
                style={{ background: "var(--corp-surface)" }}
              >
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-black text-sm border border-blue-400 shadow-sm">
                      {interview.companyLogo}
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 border border-amber-500">
                      {interview.industry}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base uppercase leading-snug" style={{ color: "var(--corp-text)" }}>
                      {interview.role}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563eb] mt-0.5">
                      <Building2 size={13} />
                      <span>{interview.company}</span>
                    </div>
                  </div>

                  {/* Small components with blue borders */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-[#2563eb] border border-blue-300">
                      <BarChart size={11} className="inline mr-1 text-[#2563eb]" /> {interview.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-[#2563eb] border border-blue-300">
                      <Sparkles size={11} className="inline mr-1" /> OpenRouter LLM
                    </span>
                  </div>
                </div>

                <div className="p-4 border-t-2 border-blue-400/40">
                  <Link
                    href={`/mock-interviews/${interview.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-extrabold uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                  >
                    Start Interview <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-20 rounded-xl border-2 border-dashed border-blue-400 font-mono" style={{ background: "var(--corp-surface)" }}>
          <Mic size={48} className="mx-auto mb-4 text-[#2563eb]" />
          <h3 className="text-base font-extrabold uppercase mb-1" style={{ color: "var(--corp-text)" }}>No roles found</h3>
          <p className="text-xs text-corp-text-secondary">Try adjusting your search query or filters.</p>
        </div>
      )}

      <RankExplainerModal
        isOpen={rankModalOpen}
        onClose={() => setRankModalOpen(false)}
        state={state}
      />
    </div>
  );
}
