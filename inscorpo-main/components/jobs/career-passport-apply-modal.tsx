"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, ShieldCheck, Sparkles, User, Mail, Phone,
  GraduationCap, Award, FileText, Send, Building2, Lock, ArrowRight,
  ExternalLink
} from "lucide-react";
import { JobListing } from "@/lib/data/jobs";
import { UserState } from "@/lib/state/types";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing;
  state: UserState;
  onSuccess: (coverNote: string) => void;
}

export function CareerPassportApplyModal({
  isOpen,
  onClose,
  job,
  state,
  onSuccess,
}: ApplyModalProps) {
  const [coverNote, setCoverNote] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const profile = state.passportProfile || {
    headline: "Fresh Graduate Candidate & MTO Applicant",
    university: "Dhaka University (IBA)",
    degree: "BBA (Finance & Marketing)",
    phone: "+880 1711-000000",
    summary: "Motivated corporate aspirant with verified skills in financial modeling, SHL numerical reasoning, and executive presentations.",
  };

  const completedCertsCount = state.courseProgress.filter((c) => c.progress === 100).length;
  const verificationId = `INSYT-PASSPORT-APP-${job.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(coverNote);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b flex items-center justify-between"
            style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-corp-accent/10 text-corp-accent flex items-center justify-center text-xl font-bold flex-shrink-0 border border-corp-accent/20">
                {job.logo}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-corp-accent">1-Click Fast Track Application</span>
                <h3 className="text-base font-bold text-corp-text truncate">{job.title}</h3>
                <p className="text-xs text-corp-text-secondary">{job.company} · {job.location}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-corp-bg-secondary hover:bg-corp-border flex items-center justify-center text-corp-text-tertiary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {step === 1 ? (
              <>
                {/* Passport Verified Badge Header */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-slate-900/20 border border-corp-accent/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-corp-accent">
                      <ShieldCheck size={16} className="text-emerald-500" /> INSYT Verified Career Passport Attached
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      SHA-256 Validated
                    </span>
                  </div>
                  <p className="text-xs text-corp-text-secondary">
                    Your verified skills, completed certificates, academic credentials, and High-DPI resume PDF will be directly dispatched to {job.company}'s HR portal.
                  </p>
                </div>

                {/* Candidate Overview Card */}
                <div className="p-5 rounded-2xl border space-y-4" style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--corp-border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-corp-accent to-corp-cyan text-white font-bold flex items-center justify-center text-sm shadow-md">
                        {state.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-corp-text">{state.name}</h4>
                        <p className="text-xs text-corp-text-secondary">{profile.headline}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-corp-accent/10 text-corp-accent border border-corp-accent/20">
                      Level {state.level} · {state.xp.toLocaleString()} XP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <Mail size={13} className="text-corp-accent" />
                      <span className="truncate">{state.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <Phone size={13} className="text-corp-accent" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <GraduationCap size={13} className="text-corp-accent" />
                      <span className="truncate">{profile.university} ({profile.degree})</span>
                    </div>
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <Award size={13} className="text-amber-500" />
                      <span>{completedCertsCount} Verified Certificates</span>
                    </div>
                  </div>
                </div>

                {/* Cover Note Section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-corp-text flex items-center justify-between">
                    <span>Personal Statement / Cover Note to HR (Optional)</span>
                    <span className="text-[10px] text-corp-text-tertiary font-normal">Max 300 words</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Dear ${job.company} HR Team,\n\nI am writing to express my strong interest in the ${job.title} position...`}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full p-3.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-corp-accent/30 transition-all leading-relaxed"
                    style={{
                      background: "var(--corp-bg-secondary)",
                      border: "1px solid var(--corp-border)",
                      color: "var(--corp-text)"
                    }}
                  />
                </div>
              </>
            ) : (
              /* Step 2: Submission Confirmation Preview */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <ShieldCheck size={36} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-corp-text">Ready to Dispatch Application</h3>
                  <p className="text-xs text-corp-text-secondary max-w-md mx-auto">
                    You are applying to <strong>{job.company}</strong> for <strong>{job.title}</strong> using your verified INSYT Passport Profile.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-corp-bg-secondary border text-xs font-mono space-y-1 text-left" style={{ borderColor: "var(--corp-border)" }}>
                  <p className="text-corp-text-tertiary">Ref ID: <strong className="text-corp-accent">{verificationId}</strong></p>
                  <p className="text-corp-text-tertiary">Recipient: <strong className="text-corp-text">{job.company} Talent Acquisition</strong></p>
                  <p className="text-corp-text-tertiary">Package: <strong>Career Passport CV + {completedCertsCount} Certificates + Video Pitch</strong></p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t flex items-center justify-between gap-4"
            style={{ background: "var(--corp-bg-secondary)", borderColor: "var(--corp-border)" }}>
            {step === 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border text-corp-text hover:bg-corp-border transition-colors"
                  style={{ borderColor: "var(--corp-border)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Review & Transmit</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border text-corp-text hover:bg-corp-border transition-colors"
                  style={{ borderColor: "var(--corp-border)" }}
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <span>Transmitting Credentials...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Application Now</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
