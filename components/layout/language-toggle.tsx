"use client";

import { useLanguage } from "@/components/providers/language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs hover:bg-corp-bg-secondary"
      style={{
        borderColor: "var(--corp-border)",
        color: "var(--corp-text)",
        background: "var(--corp-surface)",
      }}
      title="Switch Language / ভাষা পরিবর্তন করুন"
    >
      <Globe size={13} className="text-corp-accent" />
      <span className="font-mono">{lang === "en" ? "EN" : "বাং"}</span>
      <span className="text-[10px] text-corp-text-tertiary">| {lang === "en" ? "বাংলা" : "English"}</span>
    </button>
  );
}
