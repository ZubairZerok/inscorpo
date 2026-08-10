"use client";

import { useState } from "react";
import { Upload, Sparkles, Check, AlertCircle, FileText, X } from "lucide-react";
import { useUser } from "@/components/providers/user-context";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeUploadModal({ isOpen, onClose }: ResumeUploadModalProps) {
  const { updatePassportProfile, addNotification } = useUser();
  const [resumeText, setResumeText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!resumeText.trim() || resumeText.length < 20) {
      setErrorMsg("Please paste at least 20 characters of resume content.");
      return;
    }

    setParsing(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/resume-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      setParsing(false);

      if (res.ok && data) {
        await updatePassportProfile({
          headline: data.headline,
          university: data.university,
          degree: data.degree,
          gradYear: data.gradYear,
          location: data.location,
          summary: data.summary,
          customSkills: data.skills || data.topSkills || [],
          topSkills: data.skills || data.topSkills || [],
        });

        addNotification({
          type: "achievement",
          title: "🤖 Career Passport Auto-Filled!",
          message: "AI successfully parsed your CV and updated your verified Passport credentials.",
        });

        onClose();
      } else {
        setErrorMsg(data.error || "Failed to parse resume.");
      }
    } catch {
      setParsing(false);
      setErrorMsg("Network error during AI resume parsing.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 relative"
        style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--corp-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-corp-accent/10 flex items-center justify-center text-corp-accent">
              <Sparkles size={18} />
            </div>
            <h3 className="text-base font-bold" style={{ color: "var(--corp-text)" }}>AI Resume / CV Auto-Fill</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-corp-text-tertiary hover:text-corp-text">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
          Paste your plain text resume or CV below. AI will automatically extract your headline, skills, education, and executive summary to update your Career Passport.
        </p>

        <textarea
          rows={7}
          placeholder="Paste CV text here (e.g. John Doe, BBA student at BAU, proficient in Financial Modeling, Excel XLOOKUP, Power BI...)"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-4 rounded-2xl text-xs outline-none bg-corp-bg-secondary border border-corp-border text-corp-text font-mono focus:ring-2 focus:ring-corp-accent/20"
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-xs font-semibold border border-corp-border text-corp-text-secondary hover:bg-corp-bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={parsing}
            className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all shadow-md flex items-center justify-center gap-2"
          >
            {parsing ? (
              <span>AI Parsing Resume...</span>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Auto-Fill Passport</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
