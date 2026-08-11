"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, CheckCircle2, Sparkles, FileText, ArrowRight } from "lucide-react";

export function LeadMagnetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <>
      {/* Floating Trigger Banner */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)",
            border: "1px solid rgba(201, 168, 76, 0.4)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Sparkles size={14} className="text-[#F0D080]" />
          <span>Get Free 2026 MTO & Career Guide PDF</span>
          <Download size={14} />
        </button>
      </div>

      {/* Modal Backdrop & Body */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0d1f3c 0%, #112244 100%)",
                borderColor: "rgba(201, 168, 76, 0.3)",
              }}
            >
              {/* Close Button — Touch Target 44px+ */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {!submitted ? (
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C9A84C]/20 text-[#F0D080] border border-[#C9A84C]/30">
                    <FileText size={13} /> Exclusive 2026 Resource
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      Download the Executive MTO & Corporate Career Blueprint
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Get 40+ pages of management trainee case breakdowns, ATS resume templates, and financial modeling shortcuts used by candidates at top corporate firms.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      inputMode="email"
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full px-4 py-3 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-[#C9A84C] transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-xs font-bold text-[#0d1f3c] bg-gradient-to-r from-[#F0D080] to-[#C9A84C] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span>Download Blueprint PDF</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-white/40">
                    Zero spam. Unsubscribe anytime with 1 click.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Guide Sent to Your Email!</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Check your inbox ({email}) for your instant access download link to the 2026 MTO Blueprint.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
