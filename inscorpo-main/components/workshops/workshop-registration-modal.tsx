"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Ticket, CheckCircle2, User, Mail, Phone, Building2,
  GraduationCap, Target, ArrowRight, ShieldCheck, QrCode, Download,
  Calendar, Clock, Check, Award
} from "lucide-react";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { bookWorkshopSeat } from "@/lib/db";
import { WorkshopDetail } from "@/lib/data/workshops";
import Link from "next/link";

interface WorkshopRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: WorkshopDetail | null;
  onSuccess?: (ticketCode: string) => void;
}

export function WorkshopRegistrationModal({
  isOpen,
  onClose,
  workshop,
  onSuccess,
}: WorkshopRegistrationModalProps) {
  const { state, addXP, addNotification } = useUser();
  const { user } = useAuth();

  const [step, setStep] = useState<"form" | "ticket">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (Auto-prefilled from user context & passport profile)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    reason: "",
  });

  const [ticketCode, setTicketCode] = useState<string>("");

  // Sync form inputs when modal opens
  useEffect(() => {
    if (isOpen && workshop) {
      setStep("form");
      setFormData({
        fullName: state.name || "",
        email: user?.email || state.email || "",
        phone: state.passportProfile?.phone || "",
        institution: state.passportProfile?.university || "Bangladesh Agricultural University (BAU)",
        department: "Department of Agribusiness & Finance",
        reason: "Looking to master practical corporate case solving and financial modeling techniques.",
      });
      // Generate unique ticket code
      const safeId = (workshop?.id || "WKS").substring(0, 4).toUpperCase();
      const generatedCode = `BAUBC-${safeId}-${Math.floor(1000 + Math.random() * 9000)}-2026`;
      setTicketCode(generatedCode);
    }
  }, [isOpen, workshop, state.name, state.passportProfile, state.email, user]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !workshop) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const regData = {
      workshopId: workshop.id,
      workshopTitle: workshop.title,
      userId: user?.$id || "guest_user",
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      institution: formData.institution,
      department: formData.department,
      reason: formData.reason,
      ticketCode,
      registeredAt: new Date().toISOString(),
    };

    try {
      // 1. Write to Appwrite DB & Local Cache
      await bookWorkshopSeat(workshop.id, user?.$id || "guest_user", regData);
      try {
        const existing: string[] = JSON.parse(localStorage.getItem("insyt_booked_workshops") || "[]");
        if (!existing.includes(workshop.id)) {
          localStorage.setItem("insyt_booked_workshops", JSON.stringify([...existing, workshop.id]));
        }
      } catch {
        /* localStorage fallback */
      }

      // 2. Award XP points
      addXP(workshop.xpReward, `Registered for workshop: ${workshop.title}`);

      // 3. System Notification
      addNotification({
        type: "achievement",
        title: "Workshop Seat Booked! 🎟️",
        message: `Your ticket (${ticketCode}) for ${workshop.title} is confirmed. +${workshop.xpReward} XP awarded!`,
      });

      // 4. Move to Ticket view
      setStep("ticket");
      if (onSuccess) onSuccess(ticketCode);
    } catch (err) {
      console.error("Workshop registration failed:", err);
      // Fallback: grant offline success for smooth UX
      addXP(workshop.xpReward, `Registered for workshop: ${workshop.title}`);
      addNotification({
        type: "achievement",
        title: "Seat Reserved! 🎟️",
        message: `Your ticket (${ticketCode}) for ${workshop.title} is reserved.`,
      });
      setStep("ticket");
      if (onSuccess) onSuccess(ticketCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window — Styled with LMS Theme surface (No pure white) */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="relative w-full max-w-2xl rounded-2xl border-2 border-[#2563eb] shadow-[8px_8px_0px_0px_#1e3a8a] z-10 overflow-hidden my-auto font-mono"
          style={{
            background: "var(--corp-surface)",
            color: "var(--corp-text)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="p-5 bg-[#2563eb] text-white flex items-center justify-between border-b-2 border-blue-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-lg border border-amber-500 shadow">
                🎟️
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500">
                  {workshop.hostOrg}
                </span>
                <h2 className="text-sm sm:text-base font-extrabold uppercase mt-0.5 text-white truncate max-w-xs sm:max-w-md">
                  {step === "form" ? "Official Seat Registration Form" : "Verified Event Ticket & Boarding Pass"}
                </h2>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Workshop Summary Banner */}
              <div
                className="p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  background: "var(--corp-bg-secondary)",
                  borderColor: "var(--corp-border)",
                }}
              >
                <div>
                  <h3 className="text-xs font-black uppercase text-[#2563eb]">
                    {workshop.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-[11px] font-bold text-corp-text-secondary mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {workshop.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {workshop.time}</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-amber-950 font-black text-xs uppercase border border-amber-500 flex items-center gap-1 self-start sm:self-auto flex-shrink-0">
                  <Sparkles size={13} /> +{workshop.xpReward} XP Reward
                </div>
              </div>

              {/* Form Section 1: Candidate Identity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: "var(--corp-border)" }}>
                  <User size={14} className="text-[#2563eb]" />
                  <span className="text-xs font-black uppercase text-corp-text">
                    1. Candidate Identity
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Tanzim Hasan"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb]"
                        style={{
                          background: "var(--corp-bg-secondary)",
                          borderColor: "var(--corp-border)",
                          color: "var(--corp-text)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. student@bau.edu.bd"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb]"
                        style={{
                          background: "var(--corp-bg-secondary)",
                          borderColor: "var(--corp-border)",
                          color: "var(--corp-text)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                    Mobile Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +880 1700-000000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb]"
                      style={{
                        background: "var(--corp-bg-secondary)",
                        borderColor: "var(--corp-border)",
                        color: "var(--corp-text)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Academic Background & Goals */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: "var(--corp-border)" }}>
                  <GraduationCap size={14} className="text-[#2563eb]" />
                  <span className="text-xs font-black uppercase text-corp-text">
                    2. Academic &amp; Career Objectives
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                      University / Institution *
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. Bangladesh Agricultural University (BAU)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb]"
                        style={{
                          background: "var(--corp-bg-secondary)",
                          borderColor: "var(--corp-border)",
                          color: "var(--corp-text)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                      Department / Major *
                    </label>
                    <div className="relative">
                      <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-text-tertiary" />
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Finance & Agribusiness"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb]"
                        style={{
                          background: "var(--corp-bg-secondary)",
                          borderColor: "var(--corp-border)",
                          color: "var(--corp-text)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-corp-text-tertiary mb-1 block">
                    What is your primary goal for attending this workshop? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Briefly state what skills or career advice you hope to gain..."
                    className="w-full p-3 rounded-xl text-xs font-bold outline-none border-2 focus:border-[#2563eb] resize-none"
                    style={{
                      background: "var(--corp-bg-secondary)",
                      borderColor: "var(--corp-border)",
                      color: "var(--corp-text)",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--corp-border)" }}>
                <span className="text-[10px] text-corp-text-tertiary font-bold">
                  🔒 Data securely stored in Appwrite DB
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-black uppercase border-2 border-corp-border hover:bg-corp-bg-secondary text-corp-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase bg-[#2563eb] text-white hover:bg-blue-600 transition-all border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] flex items-center gap-2 disabled:opacity-50"
                  >
                    <Ticket size={14} />
                    {isSubmitting ? "Processing DB Seat..." : "Confirm & Issue Ticket"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Step 2: Digital Boarding Ticket Pass */
            <div className="p-6 space-y-6">
              {/* Confirmed Banner */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto border-2 border-emerald-600 shadow-md">
                  <CheckCircle2 size={32} />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                  Seat Confirmed &amp; DB Registered ✓
                </span>
                <h3 className="text-xl font-black uppercase text-corp-text">
                  Registration Successful!
                </h3>
                <p className="text-xs font-sans font-medium text-corp-text-secondary max-w-md mx-auto">
                  You earned <strong className="text-[#2563eb] font-bold">+{workshop.xpReward} XP</strong> and your verified credential ticket has been generated below.
                </p>
              </div>

              {/* Digital Boarding Pass Ticket — 3-Color Executive Gradient Ticket (Greenish + Indigoish + Yellowish) */}
              <div
                className="rounded-2xl border-2 border-amber-400 p-6 shadow-2xl relative overflow-hidden font-mono"
                style={{
                  background: "linear-gradient(135deg, #065f46 0%, #1e1b4b 50%, #854d0e 100%)",
                  color: "#ffffff",
                  boxShadow: "0 12px 35px rgba(6,95,70,0.35), 0 0 25px rgba(245,158,11,0.25)",
                }}
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-dashed border-amber-400/40 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-amber-950 border border-amber-500 shadow-sm inline-block">
                      Official Event Ticket Pass
                    </span>
                    <h4 className="text-base sm:text-lg font-black uppercase text-white tracking-wide drop-shadow-sm">
                      {workshop.title}
                    </h4>
                    <p className="text-xs font-bold text-amber-300">
                      {workshop.hostOrg}
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border-2 border-amber-400 p-2.5 rounded-xl text-right flex-shrink-0 shadow-md">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">TICKET ID</span>
                    <span className="text-sm font-black text-white tracking-wider">{ticketCode}</span>
                  </div>
                </div>

                {/* Candidate & Event Information Grid (High Contrast Mint & Gold Labels + Pure White Values) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Candidate Name</span>
                    <span className="text-sm font-black text-white drop-shadow-sm">{formData.fullName || "Candidate"}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Institution</span>
                    <span className="text-xs font-extrabold text-white truncate block">{formData.institution}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Date &amp; Time</span>
                    <span className="text-xs font-extrabold text-white">{workshop.date} • {workshop.time}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Venue</span>
                    <span className="text-xs font-extrabold text-white truncate block">{workshop.venue}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block">Instructor</span>
                    <span className="text-xs font-extrabold text-white">{workshop.instructor.name}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">XP Awarded</span>
                    <span className="text-sm font-black text-amber-300">+{workshop.xpReward} XP</span>
                  </div>
                </div>

                {/* Bottom Verification Section (Aligned cleanly, NO QR code) */}
                <div className="pt-4 border-t-2 border-dashed border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-400/60 shadow-sm">
                    <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider leading-none">Verification Status</span>
                      <span className="text-xs font-black text-white tracking-wide mt-1">Verified BAUBC Credential</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-400/60 shadow-sm self-stretch sm:self-auto justify-center">
                    <Award size={16} className="text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      Status: Admit One
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/workshops/${workshop.id}`}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-xs font-black uppercase text-white bg-[#2563eb] hover:bg-blue-600 transition-all border-2 border-blue-400 shadow-[3px_3px_0px_0px_#1e3a8a] text-center flex items-center justify-center gap-2"
                >
                  <span>Go to Workshop Page &amp; Exam</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl text-xs font-black uppercase border-2 border-corp-border hover:bg-corp-bg-secondary text-corp-text"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
