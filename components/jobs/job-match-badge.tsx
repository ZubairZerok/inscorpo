"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface JobMatchBadgeProps {
  jobId?: string;
  jobTitle?: string;
  department?: string;
  requirements?: string[];
}

export function JobMatchBadge({ jobId, jobTitle }: JobMatchBadgeProps) {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const targetId = jobId || jobTitle || "";

  const checkStoredFit = () => {
    try {
      const stored = localStorage.getItem(`insyt_cv_fit_${targetId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.matchScore === "number") {
          setMatchScore(parsed.matchScore);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setMatchScore(null);
  };

  useEffect(() => {
    checkStoredFit();

    const handleUpdate = () => checkStoredFit();
    window.addEventListener("insyt_fit_check_updated", handleUpdate);
    return () => window.removeEventListener("insyt_fit_check_updated", handleUpdate);
  }, [targetId]);

  // Do not render anything by default unless fit check has actually been run
  if (matchScore === null) return null;

  const getBadgeStyle = (score: number) => {
    if (score >= 85) return "bg-blue-500/15 text-[#2563eb] border-2 border-blue-400";
    if (score >= 70) return "bg-sky-500/15 text-sky-600 border-2 border-sky-400";
    return "bg-amber-400 text-amber-950 border border-amber-500";
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase ${getBadgeStyle(matchScore)}`}>
      <Sparkles size={11} />
      <span>{matchScore}% Verified Fit</span>
    </div>
  );
}
