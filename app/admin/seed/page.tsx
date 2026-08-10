"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Database, Play } from "lucide-react";

export default function SeedDatabasePage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleSeed = async () => {
    if (!apiKey) {
      setError("Please provide an API Key.");
      return;
    }
    setLoading(true);
    setError("");
    setLogs(["Starting database seed process..."]);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          projectId: "6a56075800013fce1aa1", // from lib/appwrite.ts
          endpoint: "https://sgp.cloud.appwrite.io/v1",
          databaseId: "InsytCorp",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to seed database.");
      } else {
        setLogs((prev) => [...prev, ...(data.results || []), "✅ Database successfully seeded!"]);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1121] text-white p-8 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#121A2F] border border-[#1E293B] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Appwrite Database Seeder</h1>
            <p className="text-sm text-gray-400">Initialize collections and mock data for INSYT</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-yellow-500">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <strong className="block mb-1">Important:</strong>
              This will create missing collections (`paths`, `courses`, `profiles`, `tasks`, `events`) and insert initial mock records into your Appwrite database. 
              You need an <strong>API Key</strong> with <code>collections.write</code> and <code>documents.write</code> scopes.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appwrite Server API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full bg-[#0B1121] border border-[#1E293B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <button
            onClick={handleSeed}
            disabled={loading || !apiKey}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Play size={18} /> Start Seeding
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm flex gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-[#0B1121] border border-[#1E293B] rounded-xl p-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Execution Logs
            </h3>
            <div className="space-y-1.5 h-64 overflow-y-auto font-mono text-[11px] text-gray-400">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes("Failed") || log.includes("error") ? "text-red-400" : log.includes("✅") ? "text-emerald-400 font-bold" : ""}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
