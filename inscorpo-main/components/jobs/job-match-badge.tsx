"use client";

import { useUser } from "@/components/providers/user-context";
import { Sparkles } from "lucide-react";

interface JobMatchBadgeProps {
  jobTitle: string;
  department: string;
  requirements: string[];
}

export function JobMatchBadge({ jobTitle, department, requirements }: JobMatchBadgeProps) {
  const { state } = useUser();
  const userSkills = state.passportProfile?.topSkills || [
    "Financial Modeling", "Excel", "Power BI", "Data Analytics", "Management Trainee", "Communication"
  ];

  // Calculate dynamic skill overlap
  let matchScore = 75; // baseline fit
  const reqText = (jobTitle + " " + department + " " + requirements.join(" ")).toLowerCase();

  userSkills.forEach((skill: string) => {
    if (reqText.includes(skill.toLowerCase())) {
      matchScore += 6;
    }
  });

  matchScore = Math.min(Math.max(matchScore, 72), 98);

  const getBadgeStyle = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    if (score >= 80) return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    return "bg-violet-500/10 text-violet-600 border-violet-500/30";
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(matchScore)}`}>
      <Sparkles size={12} className="animate-pulse" />
      <span>{matchScore}% AI Match Fit</span>
    </div>
  );
}
