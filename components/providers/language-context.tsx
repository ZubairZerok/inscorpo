"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.learn": "Learning Paths",
    "nav.jobs": "Job Board",
    "nav.passport": "Career Passport",
    "nav.ai": "AI Tools",
    "nav.community": "Community",
    "nav.events": "Events",
    "nav.reviews": "Company Reviews",
    "nav.pricing": "Pricing",
    "hero.title": "The Career Operating System",
    "hero.subtitle": "Level up your career with INSYT Corporate. Master banking, MTO tracks, business analytics, corporate skills, and AI productivity.",
    "hero.cta_start": "Start Free",
    "hero.cta_learn": "See How It Works",
    "jobs.title": "Corporate Job Board & Placements",
    "jobs.apply": "Apply with Career Passport",
    "jobs.applied": "Applied",
    "drill.title": "5-Minute Corporate Skill Rapid Drill",
    "drill.start": "Start 5-Minute Drill",
    "passport.title": "Professional Identity & Career Passport",
  },
  bn: {
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.learn": "লার্নিং ট্র্যাকস",
    "nav.jobs": "জব বোর্ড",
    "nav.passport": "ক্যারিয়ার পাসপোর্ট",
    "nav.ai": "এআই টুলস",
    "nav.community": "কমিউনিটি",
    "nav.events": "ইভেন্টস",
    "nav.reviews": "কোম্পানি রিভিউ",
    "nav.pricing": "প্রাইসিং",
    "hero.title": "আপনার ক্যারিয়ার অপারেটিং সিস্টেম",
    "hero.subtitle": "ইনসাইট কর্পোরেটের সাথে ক্যারিয়ার গ্রোথ করুন। ব্যাংকিং, এমটিও ট্র্যাক, বিজনেস অ্যানালিটিক্স, কর্পোরেট স্কিলস এবং এআই অটোমেশন মাস্টার করুন।",
    "hero.cta_start": "ফ্রি শুরু করুন",
    "hero.cta_learn": "কীভাবে কাজ করে",
    "jobs.title": "কর্পোরেট জব বোর্ড ও প্লেসমেন্ট",
    "jobs.apply": "পাসপোর্ট দিয়ে আবেদন করুন",
    "jobs.applied": "আবেদন করা হয়েছে",
    "drill.title": "৫-মিনিটের কর্পোরেট স্কিল র‍্যাপিড ড্রিল",
    "drill.start": "৫-মিনিটের ড্রিল শুরু করুন",
    "passport.title": "প্রফেশনাল আইডেন্টিটি ও ক্যারিয়ার পাসপোর্ট",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("insyt_lang") as Language;
      if (saved === "en" || saved === "bn") {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("insyt_lang", newLang);
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
