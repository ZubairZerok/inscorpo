"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database, Server, RefreshCw, FileText, CheckCircle2, ShieldAlert,
  Building2, Layers, Cpu, Award, ArrowUpRight, Search, Code, Check
} from "lucide-react";
import { getGovJobStats, getGovOrganizations, getSkillTaxonomy, getUnifiedDB } from "@/lib/data/gov-jobs-db";

export default function DBExplorerPage() {
  const [stats, setStats] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [taxonomy, setTaxonomy] = useState<any>(null);
  const [unifiedDbData, setUnifiedDbData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<"overview" | "organizations" | "taxonomy" | "raw">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string | null }>({
    loading: false,
    message: null,
  });

  useEffect(() => {
    const s = getGovJobStats();
    const orgs = getGovOrganizations();
    const tax = getSkillTaxonomy();
    const uni = getUnifiedDB();

    setStats(s);
    setOrganizations(orgs);
    setTaxonomy(tax);
    setUnifiedDbData(uni);
  }, []);

  const triggerSync = async () => {
    setSyncStatus({ loading: true, message: "Syncing JSON DB collections..." });
    try {
      const res = await fetch("/api/db/gov-jobs");
      const data = await res.json();
      if (data.success) {
        setSyncStatus({
          loading: false,
          message: `Successfully verified and cached ${data.totalCount} jobs across ${data.organizations.length} organizations!`,
        });
      } else {
        setSyncStatus({ loading: false, message: `Sync warning: ${data.error}` });
      }
    } catch (e: any) {
      setSyncStatus({ loading: false, message: `Sync failed: ${e.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                INSYT SAAS Database Explorer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                JSON DB Collection
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              File Location: <code className="text-slate-300 font-mono">DB/jobs_unified.json</code> | 126 Normalized Jobs | 6 Research Institutes
            </p>
          </div>
        </div>

        <button
          onClick={triggerSync}
          disabled={syncStatus.loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus.loading ? "animate-spin" : ""}`} />
          {syncStatus.loading ? "Verifying DB..." : "Verify & Sync DB"}
        </button>
      </div>

      {syncStatus.message && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {syncStatus.message}
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
              <span>Total Organizations</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalOrganizations}</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">BARI, BINA, BJRI, BRRI, BTRI, BSRI</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
              <span>Total Normalized Jobs</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalJobs}</div>
            <div className="text-[11px] text-blue-400 mt-1 font-medium">Across Grade 9 to Grade 16</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
              <span>Sanctioned Vacancies</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalVacancies}</div>
            <div className="text-[11px] text-amber-400 mt-1 font-medium">Recruitment Circular Batch 01</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
              <span>Skill Taxonomy Tiers</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">4 Tiers</div>
            <div className="text-[11px] text-purple-400 mt-1 font-medium">26 Skill Bundles Mapped</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSelectedTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            selectedTab === "overview"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Overview & Schema
        </button>
        <button
          onClick={() => setSelectedTab("organizations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            selectedTab === "organizations"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Organizations & Circulars
        </button>
        <button
          onClick={() => setSelectedTab("taxonomy")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            selectedTab === "taxonomy"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Skill Taxonomy (Tier 1-4)
        </button>
        <button
          onClick={() => setSelectedTab("raw")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            selectedTab === "raw"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Raw JSON Inspection
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Database Scope & Governance Principles
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              This dataset is constructed from official Bangladesh Government Research Organization recruitment circulars (BARI, BINA, BJRI, BRRI, BTRI, BSRI). Salary scales represent National Pay Scale 2015 basic salary. Pre-joining skills represent mandatory circular requirements, while post-joining skills represent inferred operational competencies required for research advancement.
            </p>
          </div>

          {/* Org Breakdown Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
              Government Research Institutes Breakdown
            </div>
            <div className="divide-y divide-slate-800">
              {stats.orgStats.map((o: any) => (
                <div key={o.acronym} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 text-sm">{o.acronym}</span>
                      <span className="text-slate-300 font-medium">{o.name}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Deadline: {o.deadline} | INSYT Priority: <strong className="text-white">{o.insytPriority}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{o.jobsCount} Jobs</div>
                      <div className="text-[11px] text-slate-400">{o.vacanciesCount} Total Vacancies</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "organizations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org) => (
            <div key={org.acronym} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {org.acronym}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {org.latest_supplied_recruitment?.total_vacancies || 0} Vacancies
                </span>
              </div>

              <h3 className="font-bold text-white text-base">{org.organization}</h3>
              <p className="text-xs text-slate-400">
                {org.type} • {org.ministry} ({org.headquarters})
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div>
                  <strong className="text-white">Circular Ref:</strong> {org.latest_supplied_recruitment?.circular_date}
                </div>
                <div>
                  <strong className="text-white">Selection Mode:</strong> {org.latest_supplied_recruitment?.selection}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "taxonomy" && taxonomy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400">Tier 1: Core Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {taxonomy.tier_1_core.map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-blue-400">Tier 2: High Value Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {taxonomy.tier_2_high_value.map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-purple-400">Tier 3: Specialized Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {taxonomy.tier_3_specialized.map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">Tier 4: Operational Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {taxonomy.tier_4_operational.map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "raw" && unifiedDbData && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px]">
          <pre>{JSON.stringify(unifiedDbData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
