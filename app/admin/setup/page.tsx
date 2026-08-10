"use client";

import { useState } from "react";
import { Database, CheckCircle2, AlertCircle, Loader2, Terminal, Key, Zap } from "lucide-react";

export default function SetupPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const runSetup = async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setResults([]);
    setStatus("idle");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      setResults(data.results || [data.error || "Unknown error"]);
      setStatus(data.success ? "success" : "error");
    } catch (err: any) {
      setResults([err.message]);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 50%, #0a1628 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #2563eb, #0891b2)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 0 32px rgba(37,99,235,0.4)",
            }}
          >
            <Database size={28} color="white" />
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "white",
              margin: 0,
              marginBottom: "0.5rem",
            }}
          >
            INSYT Database Setup
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
            This will create the Appwrite database, all collections, attributes and seed all content.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Warning box */}
          <div
            style={{
              background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.2)",
              borderRadius: 12,
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.75rem",
            }}
          >
            <AlertCircle size={16} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: "0.8125rem", color: "#eab308", lineHeight: 1.6 }}>
              <strong>Admin only.</strong> Your Appwrite API key must have{" "}
              <strong>databases.write, collections.write, documents.write</strong> scopes. Never share this key publicly.
            </div>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.8125rem", marginBottom: "0.75rem", fontWeight: 600 }}>
              WHAT THIS CREATES:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                "Database: 6a56075800013fce1aa1",
                "9 Collections + Attributes",
                "5 Learning Paths",
                "24 Courses",
                "5 Tasks",
                "5 Events",
                "8 Mock Tests",
                "5 Workshops",
                "5 Community Posts",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "#cbd5e1",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#2563eb",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              <Key size={12} style={{ display: "inline", marginRight: 6 }} />
              APPWRITE API KEY
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="standard_xxxxxxxxxxxxxxxxxxxxxx..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "0.75rem 1rem",
                color: "white",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "monospace",
              }}
            />
            <p style={{ color: "#475569", fontSize: "0.75rem", marginTop: "0.375rem" }}>
              Go to Appwrite Console → API Keys → Create Key with databases & documents scopes
            </p>
          </div>

          {/* Run Button */}
          <button
            onClick={runSetup}
            disabled={loading || !apiKey.trim()}
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: 12,
              border: "none",
              background:
                loading || !apiKey.trim()
                  ? "rgba(37,99,235,0.3)"
                  : "linear-gradient(135deg, #2563eb, #0891b2)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9375rem",
              cursor: loading || !apiKey.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Setting up database... (this takes ~30s)
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Full Database Setup
              </>
            )}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              {/* Status banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  marginBottom: "0.75rem",
                  background:
                    status === "success"
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(239,68,68,0.1)",
                  border:
                    status === "success"
                      ? "1px solid rgba(16,185,129,0.2)"
                      : "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {status === "success" ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : (
                  <AlertCircle size={16} color="#ef4444" />
                )}
                <span
                  style={{
                    color: status === "success" ? "#10b981" : "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {status === "success"
                    ? "✅ Database setup complete! Your INSYT app is now live with real data."
                    : "❌ Setup encountered errors. Check the log below."}
                </span>
              </div>

              {/* Log terminal */}
              <div
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#161b22",
                    padding: "0.625rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderBottom: "1px solid #21262d",
                  }}
                >
                  <Terminal size={12} color="#58a6ff" />
                  <span style={{ color: "#58a6ff", fontSize: "0.75rem", fontWeight: 600 }}>
                    Setup Log
                  </span>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    maxHeight: "300px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    lineHeight: 1.8,
                  }}
                >
                  {results.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        color: r.startsWith("✅")
                          ? "#56d364"
                          : r.startsWith("❌")
                          ? "#f85149"
                          : r.startsWith("ℹ️")
                          ? "#58a6ff"
                          : r.startsWith("===")
                          ? "#e3b341"
                          : r.startsWith("---")
                          ? "#8b949e"
                          : "#c9d1d9",
                      }}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {status === "success" && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <a
                    href="/dashboard"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      background: "linear-gradient(135deg, #10b981, #0891b2)",
                      color: "white",
                      borderRadius: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Zap size={16} />
                    Go to Dashboard →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: "0.75rem", marginTop: "1rem" }}>
          Admin route — not accessible to regular users
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
