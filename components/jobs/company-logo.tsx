"use client";

import { useState } from "react";
import { getCompanyLogoUrl } from "@/lib/data/company-logos";

interface CompanyLogoProps {
  company: string;
  acronym?: string;
  className?: string;
  size?: number;
}

export function CompanyLogo({ company, acronym, className = "", size = 48 }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const logoUrl = getCompanyLogoUrl(acronym || company);

  const getInitials = (str: string) => {
    if (acronym) return acronym;
    const words = str.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const initials = getInitials(company);

  if (hasError || !logoUrl) {
    return (
      <div
        className={`flex items-center justify-center font-mono font-black text-white bg-[#2563eb] border-2 border-blue-300 rounded-sm shadow-sm select-none shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(12, Math.floor(size * 0.35)) }}
        title={company}
      >
        <svg
          className="w-full h-full p-1"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" rx="8" fill="#2563eb" />
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="38"
            fontWeight="900"
            fontFamily="monospace"
          >
            {initials}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center bg-white p-1 rounded-sm border-2 border-blue-400 overflow-hidden shadow-sm shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoUrl}
        alt={`${company} Logo`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain p-0.5"
        loading="eager"
      />
    </div>
  );
}
