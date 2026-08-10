"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, FileDown, Share2, CheckCircle2, ShieldCheck, Star, X,
  Lock, BookOpen, ArrowRight, Sparkles, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";

const PATH_META: Record<string, { title: string; gradient: string; issuer: string }> = {
  "excel-corporate": { title: "Excel for Corporate Careers", gradient: "from-[#064e3b] to-[#10b981]", issuer: "Excel Analytics Division" },
  "corporate-mto": { title: "Corporate Job / MTO Masterclass", gradient: "from-[#881337] to-[#e11d48]", issuer: "Corporate Recruitment Board" },
  "power-bi": { title: "Power BI & Business Analytics", gradient: "from-[#78350f] to-[#f59e0b]", issuer: "Data Analytics Division" },
  "ai-automation": { title: "AI & Automation for Work", gradient: "from-[#4c1d95] to-[#8b5cf6]", issuer: "AI Innovation Lab" },
  "supply-chain": { title: "Supply Chain & Operations", gradient: "from-[#1e293b] to-[#475569]", issuer: "Operations Excellence Board" },
  "business-comm": { title: "Business Communication + PowerPoint", gradient: "from-[#881337] to-[#e11d48]", issuer: "Communication Sciences Board" },
  "project-management": { title: "Project Management", gradient: "from-[#1e3a8a] to-[#2563eb]", issuer: "Project Management Institute" },
  "digital-marketing": { title: "Digital Marketing + Branding", gradient: "from-[#831843] to-[#ec4899]", issuer: "Marketing Excellence Board" },
};

function CornerOrnament({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M4 4 L4 26 Q4 8 22 4 Z" fill="none" stroke="#10b981" strokeWidth="2" />
      <path d="M4 4 L26 4 Q8 4 4 22 Z" fill="none" stroke="#10b981" strokeWidth="2" />
      <circle cx="4" cy="4" r="3" fill="#10b981" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
      <circle cx="34" cy="34" r="30" fill="#022c22" stroke="#10b981" strokeWidth="2" />
      <circle cx="34" cy="34" r="24" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
      <text x="34" y="42" textAnchor="middle" fontSize="20" fontWeight="900" fill="#10b981" fontFamily="monospace">I</text>
    </svg>
  );
}

type CertProps = {
  title: string;
  recipient: string;
  date: string;
  certId: string;
  issuer: string;
  demo?: boolean;
};

function CertificateCard({ title, recipient, date, certId, issuer, demo }: CertProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl select-none border-2 border-[#10b981] shadow-[6px_6px_0px_0px_#10b981]"
      style={{
        background: "linear-gradient(145deg, #022c22 0%, #064e3b 40%, #0f172a 100%)",
        minHeight: "320px",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#10b981]" />

      {demo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-1">
          <p className="text-[90px] font-mono font-extrabold tracking-widest rotate-[-30deg] opacity-10 text-white">SAMPLE</p>
        </div>
      )}

      <div className="absolute top-4 left-4"><CornerOrnament /></div>
      <div className="absolute top-4 right-4"><CornerOrnament rotate={90} /></div>
      <div className="absolute bottom-4 left-4"><CornerOrnament rotate={270} /></div>
      <div className="absolute bottom-4 right-4"><CornerOrnament rotate={180} /></div>

      <div className="relative z-10 flex flex-col items-center justify-between p-8 md:p-10 text-white font-mono" style={{ minHeight: "320px" }}>
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#10b981] text-emerald-950 flex items-center justify-center font-black text-sm border border-emerald-300">
              I
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-widest text-[#10b981]">INSYT</p>
              <p className="text-[9px] tracking-[0.15em] uppercase text-emerald-200">Corporate Board</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/20 border border-[#10b981] text-[#10b981]">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-extrabold tracking-wide uppercase">Verified Credential</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#FDE047" className="text-amber-300" />)}
        </div>

        <div className="text-center space-y-3 flex-1 flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-[0.35em] font-extrabold text-emerald-300">Certificate of Completion</p>
          <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-white">
            {title}
          </h2>
          <div className="space-y-0.5">
            <p className="text-[10px] tracking-widest uppercase text-emerald-200">This is to certify that</p>
            <p className="text-2xl font-extrabold text-[#FEF08A]">{recipient}</p>
          </div>
          <p className="text-xs leading-relaxed max-w-sm text-emerald-100 font-sans font-medium">
            has successfully completed all required coursework and demonstrated professional competency in the executive program.
          </p>
        </div>

        <div className="w-full border-t-2 border-white/20 my-3" />

        <div className="w-full flex items-end justify-between text-xs">
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#10b981]">Course Director</p>
              <p className="text-[10px] font-bold text-white">{issuer}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <WaxSeal />
            <p className="text-[8px] uppercase tracking-widest text-[#10b981]">Official Seal</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-[#10b981]">Issued: {date}</p>
            <p className="text-[10px] font-mono text-emerald-200">ID: {certId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedCertCard({ title, progress, pathSlug }: { title: string; progress: number; pathSlug: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border-2 border-rose-500 shadow-[5px_5px_0px_0px_#881337] bg-slate-900/95 p-8 text-white space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-rose-500/20 text-rose-400 border-2 border-rose-500 flex items-center justify-center flex-shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold font-mono uppercase text-white">{title}</h3>
            <p className="text-xs text-rose-200 font-medium">Complete 100% of the track to unlock credential</p>
          </div>
        </div>

        <Link
          href={`/learn/${pathSlug}`}
          className="px-5 py-2.5 rounded-lg text-xs font-mono font-extrabold text-white bg-[#e11d48] hover:bg-rose-600 transition-all shadow-[3px_3px_0px_0px_#881337] border-2 border-rose-300 uppercase flex items-center gap-1.5"
        >
          <span>Continue Track</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="flex justify-between text-xs font-mono font-extrabold text-rose-200">
          <span>Track Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
          <div className="h-full bg-[#10b981]" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { state } = useUser();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState<any | null>(null);
  const certRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const issueDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const earnedCerts = state.courseProgress
    .filter((c) => c.progress === 100)
    .map((c) => ({
      slug: c.id,
      title: c.title,
      pathSlug: c.id,
      certId: `INSYT-${c.id.slice(0, 8).toUpperCase()}-${state.level}`,
      issuer: PATH_META[c.id]?.issuer ?? "INSYT Academic Board",
      unlocked: true,
    }));

  const lockedCerts = state.enrolledPathSlugs
    .filter((slug) => !earnedCerts.some((c) => c.pathSlug === slug))
    .map((slug) => {
      const meta = PATH_META[slug];
      if (!meta) return null;
      const pathCourses = state.courseProgress.filter((c) => c.id.includes(slug.split("-")[0]));
      const avgProgress = pathCourses.length > 0
        ? Math.round(pathCourses.reduce((a, c) => a + c.progress, 0) / pathCourses.length)
        : 0;
      return { slug, title: meta.title, progress: avgProgress, pathSlug: slug };
    })
    .filter(Boolean) as { slug: string; title: string; progress: number; pathSlug: string }[];

  const handleDownloadPdf = useCallback(async (certSlug: string, certTitle: string) => {
    setDownloading(certSlug);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      let el = certRefs.current[certSlug];
      if (!el && certSlug === "demo") {
        el = certRefs.current["demo"];
      }

      if (!el) {
        const content = `INSYT CORPORATE CERTIFICATE OF COMPLETION\nProgram: ${certTitle}\nRecipient: ${state.name || "Executive Operator"}\nDate: ${issueDate}\nCredential ID: INSYT-CERT-VERIFIED-2026\n\nVerified by INSYT Academic Board & BAUBC`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `INSYT-Certificate-${certTitle.replace(/\s+/g, "-")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(null);
        return;
      }

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#022c22",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 3, canvas.height / 3] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`INSYT-Certificate-${certTitle.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setDownloading(null);
    }
  }, [state.name, issueDate]);

  const demoCert = {
    title: "Excel for Corporate Careers",
    recipient: state.name || "Your Name",
    date: issueDate,
    certId: "INSYT-DEMO-2026",
    issuer: "Excel Analytics Division",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-mono uppercase tracking-tight" style={{ color: "var(--corp-text)" }}>
          Verified Credentials
        </h1>
        <p className="text-xs sm:text-sm mt-1 font-medium" style={{ color: "var(--corp-text-secondary)" }}>
          Premium certificates issued upon 100% track completion — downloadable, shareable, and cryptographically verifiable.
        </p>
      </div>

      {/* Demo preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <p className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#10b981]">
            Official Certificate Preview
          </p>
        </div>
        <div ref={(el) => { certRefs.current["demo"] = el; }}>
          <CertificateCard {...demoCert} demo />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
            Enroll in a learning track and complete 100% to earn your personalized certificate.
          </p>
          <button
            onClick={() => handleDownloadPdf("demo", demoCert.title)}
            disabled={downloading === "demo"}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-mono font-extrabold text-emerald-950 bg-[#10b981] hover:bg-emerald-400 transition-all shadow-[3px_3px_0px_0px_#064e3b] border-2 border-emerald-300 uppercase flex-shrink-0"
          >
            <FileDown size={14} />
            {downloading === "demo" ? "Generating..." : "Download Preview PDF"}
          </button>
        </div>
      </div>

      {/* Earned certificates */}
      {earnedCerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-0.5" style={{ background: "var(--corp-border)" }} />
            <p className="text-xs font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 text-[#10b981]">
              <CheckCircle2 size={14} /> Earned Certificates
            </p>
            <div className="flex-1 h-0.5" style={{ background: "var(--corp-border)" }} />
          </div>

          {earnedCerts.map((cert) => (
            <div key={cert.slug} className="space-y-3">
              <div ref={(el) => { certRefs.current[cert.slug] = el; }}>
                <CertificateCard
                  title={cert.title}
                  recipient={state.name}
                  date={issueDate}
                  certId={cert.certId}
                  issuer={cert.issuer}
                />
              </div>
              <div className="flex items-center gap-2 justify-end flex-wrap font-mono">
                <button onClick={() => setInspecting(cert)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold border-2 border-corp-border hover:bg-corp-bg-secondary text-corp-text">
                  <ExternalLink size={12} /> Inspect
                </button>
                <a
                  href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.title)}&organizationName=INSYT+Corporate&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(`https://insyt.co/verify/${cert.certId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold text-white bg-[#0A66C2] border-2 border-blue-400 shadow-[2px_2px_0px_0px_#1e3a8a]"
                >
                  <Share2 size={12} /> LinkedIn
                </a>
                <button
                  onClick={() => handleDownloadPdf(cert.slug, cert.title)}
                  disabled={downloading === cert.slug}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold text-emerald-950 bg-[#10b981] hover:bg-emerald-400 border-2 border-emerald-300 shadow-[2px_2px_0px_0px_#064e3b] uppercase"
                >
                  <FileDown size={12} />
                  {downloading === cert.slug ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked / in-progress certificates */}
      {lockedCerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-0.5" style={{ background: "var(--corp-border)" }} />
            <p className="text-xs font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 text-rose-500">
              <Lock size={14} /> In-Progress Certificates
            </p>
            <div className="flex-1 h-0.5" style={{ background: "var(--corp-border)" }} />
          </div>

          {lockedCerts.map((cert) => (
            <LockedCertCard
              key={cert.slug}
              title={cert.title}
              progress={cert.progress}
              pathSlug={cert.pathSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

