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
import { CompanyLogo } from "./company-logo";

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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] rounded-lg border-2 border-blue-400 shadow-[6px_6px_0px_0px_#2563eb] flex flex-col overflow-hidden bg-corp-surface text-corp-text"
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b-2 border-blue-400/30 flex items-center justify-between bg-corp-bg-secondary">
            <div className="flex items-center gap-3 min-w-0">
              <CompanyLogo company={job.company} size={44} />
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb]">1-Click Fast Track Application</span>
                <h3 className="text-base font-black text-corp-text truncate uppercase">{job.title}</h3>
                <p className="text-xs font-bold text-corp-text-secondary truncate">{job.company} · {job.location}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-amber-950 border-2 border-amber-500 shadow-sm cursor-pointer"
            >
              <X size={16} className="stroke-[3]" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {step === 1 ? (
              <>
                {/* Passport Verified Badge Header */}
                <div className="p-4 rounded-md bg-blue-500/10 border-2 border-blue-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-[#2563eb]">
                      <ShieldCheck size={16} className="text-[#2563eb]" /> INSYT Verified Career Passport Attached
                    </span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-blue-500/20 text-[#2563eb] border border-blue-400/40">
                      SHA-256 Validated
                    </span>
                  </div>
                  <p className="text-xs font-sans font-medium text-corp-text-secondary">
                    Your verified skills, completed certificates, academic credentials, and High-DPI resume PDF will be directly dispatched to {job.company}'s HR portal.
                  </p>
                </div>

                {/* Candidate Overview Card */}
                <div className="p-5 rounded-md border-2 border-blue-400 space-y-4 bg-corp-bg-secondary">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-blue-400/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-[#2563eb] text-white font-black flex items-center justify-center text-sm shadow-sm border border-blue-300">
                        {state.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-corp-text">{state.name}</h4>
                        <p className="text-xs font-sans text-corp-text-secondary">{profile.headline}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-[#2563eb] text-white border border-blue-300">
                      Level {state.level} · {state.xp.toLocaleString()} XP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <Mail size={13} className="text-[#2563eb]" />
                      <span className="truncate">{state.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <Phone size={13} className="text-[#2563eb]" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-corp-text-secondary">
                      <GraduationCap size={13} className="text-[#2563eb]" />
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
                  <label className="text-xs font-black uppercase text-corp-text flex items-center justify-between">
                    <span>Personal Statement / Cover Note to HR (Optional)</span>
                    <span className="text-[10px] text-corp-text-tertiary font-medium">Max 300 words</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Dear ${job.company} HR Team,\n\nI am writing to express my strong interest in the ${job.title} position...`}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full p-3.5 rounded-md text-xs font-mono outline-none border-2 border-blue-400 focus:border-[#2563eb] transition-all bg-corp-bg-secondary text-corp-text"
                  />
                </div>
              </>
            ) : (
              /* Step 2: Submission Confirmation Preview */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-md bg-blue-500/10 text-[#2563eb] flex items-center justify-center mx-auto border-2 border-blue-400 shadow-sm">
                  <ShieldCheck size={36} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase text-corp-text">Ready to Dispatch Application</h3>
                  <p className="text-xs font-sans font-medium text-corp-text-secondary max-w-md mx-auto">
                    You are applying to <strong>{job.company}</strong> for <strong>{job.title}</strong> using your verified INSYT Passport Profile.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-corp-bg-secondary border-2 border-blue-400 text-xs font-mono space-y-1 text-left">
                  <p className="text-corp-text-tertiary">Ref ID: <strong className="text-[#2563eb]">{verificationId}</strong></p>
                  <p className="text-corp-text-tertiary">Recipient: <strong className="text-corp-text">{job.company} Talent Acquisition</strong></p>
                  <p className="text-corp-text-tertiary">Package: <strong>Career Passport CV + {completedCertsCount} Certificates + Video Pitch</strong></p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t-2 border-blue-400/30 flex items-center justify-between gap-4 bg-corp-bg-secondary">
            {step === 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-md text-xs font-black uppercase border-2 border-blue-400 text-corp-text bg-corp-surface hover:bg-corp-bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-md text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-300 shadow-[2px_2px_0px_0px_#1e3a8a] flex items-center gap-1.5 cursor-pointer"
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
                  className="px-5 py-2.5 rounded-md text-xs font-black uppercase border-2 border-blue-400 text-corp-text bg-corp-surface hover:bg-corp-bg-secondary transition-colors cursor-pointer"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-md text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-300 shadow-[3px_3px_0px_0px_#1e3a8a] flex items-center gap-2 tracking-wider cursor-pointer"
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
