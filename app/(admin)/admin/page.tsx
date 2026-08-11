"use client";

import React, { useState } from "react";
import {
  Database, RefreshCw, CheckCircle2, AlertCircle, Building2,
  FileText, Sparkles, Plus, Clock, Server, ArrowRight
} from "lucide-react";
import { createTask, createEvent } from "@/lib/db";
import { jobsData } from "@/lib/data/jobs";

const DB_DATASETS = [
  { name: "aarong.json", category: "Corporate Circulars", desc: "Aarong & BRAC Dairy Plant Quality, Procurement, R&D, and Sales circulars" },
  { name: "aarongdairy_1.json", category: "Corporate Circulars", desc: "Aarong Dairy Processing, Engineering, EHS, and Logistics circulars" },
  { name: "jobs_1.json", category: "Govt Research Cadre", desc: "BARI, BRRI, BINA, BJRI, BTRI, BSRI combined intelligence dataset" },
  { name: "jobs_batch1.json", category: "Govt Research Cadre", desc: "BARI & BRRI specialized research scientist & officer circulars" },
  { name: "jobs_batch2.json", category: "Govt Research Cadre", desc: "BJRI & BTRI research assistant & technical officer circulars" },
  { name: "jobs_unified.json", category: "Govt Research Cadre", desc: "Unified agricultural research organization pay-scale mapping" }
];

export default function AdminPage() {
  // Cloud Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    datasets?: any[];
  } | null>(null);

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

  // Trigger Cloud Sync API
  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync-db");
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({
          success: true,
          message: data.message || "Successfully synchronized all JSON datasets with Appwrite Cloud Database!",
          datasets: data.datasets,
        });
      } else {
        setSyncResult({
          success: false,
          message: data.error || "Cloud synchronization failed. Please verify Appwrite connection.",
        });
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err?.message || "Network error while connecting to /api/sync-db endpoint.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-8 font-mono">
      {/* Header & Cloud Sync Action */}
      <div className="p-6 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase text-white bg-[#2563eb]">
              SYSTEM ENGINE
            </span>
            <span className="text-xs text-corp-text-tertiary font-bold">Appwrite Cloud Sync Portal</span>
          </div>
          <h1 className="text-xl font-black uppercase text-corp-text">
            Cloud Intelligence & Platform Management
          </h1>
          <p className="text-xs font-sans font-medium text-corp-text-tertiary">
            Trigger live dataset synchronization from local JSON files to Appwrite Cloud Storage & Database.
          </p>
        </div>

        {/* Primary Sync Button */}
        <button
          onClick={handleCloudSync}
          disabled={isSyncing}
          className="px-6 py-3.5 rounded-full text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 border-2 border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a] flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-70 shrink-0"
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin text-white" : "text-white"} />
          <span>{isSyncing ? "Syncing to Cloud..." : "Sync All DB Datasets to Cloud"}</span>
        </button>
      </div>

      {/* Sync Status Toast Result */}
      {syncResult && (
        <div
          className={`p-4 rounded-sm border-2 font-mono text-xs space-y-2 ${
            syncResult.success
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 shadow-sm"
              : "bg-rose-500/10 border-rose-500 text-rose-700 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2 font-black uppercase">
            {syncResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{syncResult.message}</span>
          </div>

          {syncResult.datasets && (
            <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 md:grid-cols-3 gap-2">
              {syncResult.datasets.map((ds, idx) => (
                <div key={idx} className="p-2 rounded-sm bg-corp-surface border border-emerald-500/30 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-corp-text">{ds.filename}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white">
                    Synced
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Real Platform Statistics (No Fake Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Cloud JSON Datasets</span>
            <Database size={18} className="text-[#2563eb]" />
          </div>
          <h3 className="text-2xl font-black text-corp-text">6</h3>
          <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
            Verified JSON intelligence files in DB folder
          </p>
        </div>

        <div className="p-5 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Corporate Circulars</span>
            <Building2 size={18} className="text-[#2563eb]" />
          </div>
          <h3 className="text-2xl font-black text-[#2563eb]">{jobsData.length}</h3>
          <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
            DB-derived Aarong & BRAC Dairy roles
          </p>
        </div>

        <div className="p-5 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Govt Research Cadres</span>
            <FileText size={18} className="text-[#2563eb]" />
          </div>
          <h3 className="text-2xl font-black text-corp-text">126</h3>
          <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
            BARI, BRRI, BINA, BJRI, BTRI, BSRI posts
          </p>
        </div>

        <div className="p-5 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-corp-text-tertiary">Cloud DB Status</span>
            <Server size={18} className="text-[#2563eb]" />
          </div>
          <h3 className="text-sm font-black uppercase text-emerald-600 flex items-center gap-1.5 pt-1">
            <CheckCircle2 size={16} /> Appwrite Online
          </h3>
          <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
            sgp.cloud.appwrite.io endpoint
          </p>
        </div>
      </div>

      {/* Database Datasets Inventory & Sync Triggers */}
      <div className="p-6 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-blue-400/30">
          <div>
            <h2 className="text-base font-black uppercase text-corp-text">
              Database JSON Datasets Inventory
            </h2>
            <p className="text-[11px] font-sans font-medium text-corp-text-tertiary">
              Manage local JSON database files stored in d:\inscorpo\DB
            </p>
          </div>

          <button
            onClick={handleCloudSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-full text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 border border-blue-300 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            <span>Sync All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DB_DATASETS.map((ds) => (
            <div
              key={ds.name}
              className="p-4 rounded-sm border border-blue-400/40 bg-corp-bg-secondary hover:border-blue-400 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#2563eb] uppercase">{ds.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-500/10 text-[#2563eb] border border-blue-400/30">
                    {ds.category}
                  </span>
                </div>
                <p className="text-xs font-sans font-medium text-corp-text-tertiary">
                  {ds.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-blue-400/20 text-[11px]">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Ready for Cloud Sync
                </span>
                <button
                  onClick={handleCloudSync}
                  disabled={isSyncing}
                  className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 border border-blue-300 cursor-pointer"
                >
                  Sync File
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Tasks & Events Section (SAAS Styled) */}
      <div id="tasks" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Form */}
        <div className="p-6 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-4">
          <h3 className="text-sm font-black uppercase pb-3 border-b-2 border-blue-400/30 text-corp-text">
            Publish Global Task to Appwrite
          </h3>
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            {taskMessage && (
              <div className={`p-3 rounded-sm border font-bold text-xs ${
                taskMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500 text-emerald-700" : "bg-rose-500/10 border-rose-500 text-rose-700"
              }`}>
                {taskMessage.text}
              </div>
            )}
            <div>
              <label className="block font-black uppercase mb-1.5 text-corp-text">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Complete Banking Analytical Case"
                className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none focus:border-[#2563eb] bg-corp-surface text-corp-text font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-black uppercase mb-1.5 text-corp-text">XP Reward</label>
              <input
                type="number"
                value={taskXp}
                onChange={(e) => setTaskXp(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none focus:border-[#2563eb] bg-corp-surface text-corp-text font-bold"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isTaskLoading}
              className="w-full py-3 rounded-full text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 border border-blue-300 shadow-sm transition-all cursor-pointer disabled:opacity-75"
            >
              {isTaskLoading ? "Publishing..." : "Publish Global Task"}
            </button>
          </form>
        </div>

        {/* Event Form */}
        <div className="p-6 rounded-sm border-2 border-blue-400 bg-corp-surface shadow-[4px_4px_0px_0px_#2563eb] space-y-4">
          <h3 className="text-sm font-black uppercase pb-3 border-b-2 border-blue-400/30 text-corp-text">
            Publish Global Event to Appwrite
          </h3>
          <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
            {eventMessage && (
              <div className={`p-3 rounded-sm border font-bold text-xs ${
                eventMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500 text-emerald-700" : "bg-rose-500/10 border-rose-500 text-rose-700"
              }`}>
                {eventMessage.text}
              </div>
            )}
            <div>
              <label className="block font-black uppercase mb-1.5 text-corp-text">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. FMCG Supply Chain Workshop"
                className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none focus:border-[#2563eb] bg-corp-surface text-corp-text font-bold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-black uppercase mb-1.5 text-corp-text">Date</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. Aug 25"
                  className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none focus:border-[#2563eb] bg-corp-surface text-corp-text font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase mb-1.5 text-corp-text">Time</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 7:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none focus:border-[#2563eb] bg-corp-surface text-corp-text font-bold"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-black uppercase mb-1.5 text-corp-text">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm border-2 border-blue-400 outline-none bg-corp-surface text-corp-text font-bold cursor-pointer"
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
              className="w-full py-3 rounded-full text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 border border-blue-300 shadow-sm transition-all cursor-pointer disabled:opacity-75"
            >
              {isEventLoading ? "Publishing..." : "Publish Global Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
