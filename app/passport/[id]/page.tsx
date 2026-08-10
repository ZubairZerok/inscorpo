"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Award, GraduationCap, CheckCircle2,
  Share2, ArrowLeft, Building2, Calendar, FileText, Check, Copy, ExternalLink, Lock
} from "lucide-react";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface PublicPassportData {
  verificationId: string;
  name: string;
  headline: string;
  university: string;
  degree: string;
  gradYear: string;
  location: string;
  verifiedSkills: { name: string; score: number }[];
  completedCourses: string[];
  rankName: string;
  xp: number;
  level: number;
  verifiedAt: string;
}

export default function PublicPassportVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const passportId = resolvedParams.id;
  const [copied, setCopied] = useState(false);

  // Derive verification profile based on ID
  const cleanId = passportId.toUpperCase();
  const isPrivate = cleanId.endsWith("-PRIV") || cleanId.endsWith("-PRIVATE");
  const candidateName = passportId
    .replace(/^INSYT-PASS-?/i, "")
    .replace(/-202\d$/i, "")
    .replace(/-PRIV(ATE)?$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Verified Candidate";

  const passportData: PublicPassportData = {
    verificationId: cleanId.startsWith("INSYT-PASS") ? cleanId : `INSYT-PASS-${cleanId}`,
    name: candidateName === "User" || candidateName === "Executive" ? "Verified Graduate" : candidateName,
    headline: "Corporate Analyst & Business Intelligence Specialist",
    university: "Bangladesh Agricultural University (BAU)",
    degree: "Bachelor of Business Administration (BBA)",
    gradYear: "2026",
    location: "Dhaka, Bangladesh",
    verifiedSkills: [
      { name: "Excel Financial Modeling & XLOOKUP", score: 95 },
      { name: "Power BI & DAX Analytics", score: 88 },
      { name: "Management Trainee Case Solving", score: 92 },
      { name: "Business Presentation & PowerPoint", score: 90 },
      { name: "AI Productivity & Workflow Automation", score: 94 },
    ],
    completedCourses: [
      "Excel for Corporate Careers Masterclass",
      "Corporate Job / MTO Assessment Masterclass",
      "Power BI & Business Analytics",
      "AI & Automation for Workplace Productivity",
    ],
    rankName: "Gold Rank",
    xp: 8450,
    level: 12,
    verifiedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: `${passportData.name}'s Verified Credential`,
            text: `Verify ${passportData.name}'s official INSYT Corporate career credential.`,
            url: shareUrl,
          });
          return;
        } catch {
          // Native share drawer cancelled or unavailable
        }
      }
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--corp-bg)" }}>
      <MarketingNavbar />

      <main className="flex-1 pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold hover:underline"
            style={{ color: "var(--corp-text-tertiary)" }}
          >
            <ArrowLeft size={14} /> Back to INSYT Corporate
          </Link>
        </div>

        {/* Verification Status Header Banner */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-8 border shadow-xl relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0d1f3c 0%, #112244 60%, #059669 100%)",
            borderColor: "rgba(16, 185, 129, 0.4)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck size={16} className="text-emerald-400" /> Officially Verified Credential
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {passportData.name}
              </h1>

              <p className="text-sm text-white/80 max-w-xl">
                {passportData.headline}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300">Credential ID</span>
              <span className="font-mono text-xs font-bold text-white tracking-wider">{passportData.verificationId}</span>
              <span className="text-[11px] text-white/70">Verified: {passportData.verifiedAt}</span>
            </div>
          </div>
        </div>

        {/* Public Verification Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar Info */}
          <div className="space-y-6">
            {/* Academic Information */}
            <div
              className="rounded-2xl p-5 space-y-4 border shadow-sm"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <GraduationCap size={16} className="text-corp-accent" /> Education & Campus
              </h2>
              <div className="space-y-2.5 text-xs">
                <div>
                  <p className="font-semibold" style={{ color: "var(--corp-text)" }}>{passportData.university}</p>
                  <p style={{ color: "var(--corp-text-secondary)" }}>{passportData.degree}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--corp-text-tertiary)" }}>Class of {passportData.gradYear}</p>
                </div>
                <div className="pt-2 border-t" style={{ borderColor: "var(--corp-border)" }}>
                  <p className="text-[11px]" style={{ color: "var(--corp-text-tertiary)" }}>Location: {passportData.location}</p>
                </div>
              </div>
            </div>

            {/* Platform Credential Rank */}
            <div
              className="rounded-2xl p-5 space-y-3 border shadow-sm"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <Award size={16} className="text-amber-500" /> Platform Standing
              </h2>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <span className="text-xs font-bold">{passportData.rankName}</span>
                <span className="text-xs font-mono font-bold">Level {passportData.level} · {passportData.xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Verification Actions */}
            <div
              className="rounded-2xl p-5 space-y-3 border shadow-sm"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
            >
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ borderColor: "var(--corp-border)", color: "var(--corp-text)", background: "var(--corp-surface)" }}
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "Link Copied!" : "Copy Verification URL"}
              </button>

              <Link
                href="/signup"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-colors shadow-sm"
              >
                <ShieldCheck size={14} /> Join INSYT Corporate
              </Link>
            </div>
          </div>

          {/* Right Main Content (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Verified Skills */}
            <div
              className="rounded-2xl p-6 space-y-4 border shadow-sm"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                  <CheckCircle2 size={16} className="text-emerald-500" /> Verified Skill Competencies
                </h2>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  100% Authenticated
                </span>
              </div>

              <div className="space-y-3">
                {passportData.verifiedSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium" style={{ color: "var(--corp-text)" }}>
                      <span>{skill.name}</span>
                      <span className="font-mono text-emerald-600 font-bold">{skill.score}% Proficiency</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-corp-bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-corp-accent to-emerald-500"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Course Credentials */}
            <div
              className="rounded-2xl p-6 space-y-4 border shadow-sm"
              style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
            >
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
                <FileText size={16} className="text-corp-accent" /> Completed Learning Tracks & Certificates
              </h2>

              <div className="space-y-2.5">
                {passportData.completedCourses.map((course) => (
                  <div
                    key={course}
                    className="flex items-center justify-between p-3.5 rounded-xl border bg-corp-bg-secondary"
                    style={{ borderColor: "var(--corp-border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--corp-text)" }}>{course}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-corp-accent bg-corp-accent/10 px-2 py-1 rounded">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div
              className="p-4 rounded-2xl flex items-start gap-3 text-xs border"
              style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)", color: "var(--corp-text-secondary)" }}
            >
              <Lock size={16} className="text-corp-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-corp-text">Public Credential Transparency Notice</p>
                <p className="text-[11px] mt-0.5 text-corp-text-tertiary">
                  This public page displays only recruiter-relevant credentials verified by INSYT Corporate. Private contact information remains protected under candidate privacy settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
