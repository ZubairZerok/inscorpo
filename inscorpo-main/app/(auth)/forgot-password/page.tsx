"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { account } from "@/lib/appwrite";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const redirectUrl = `${window.location.origin}/login`;
      await account.createRecovery(email, redirectUrl);
      setSent(true);
    } catch (err: any) {
      console.warn("Appwrite recovery notice:", err);
      // Even if Appwrite recovery returns user not found, show clean message or fallback state
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-corp-accent via-blue-600 to-corp-cyan">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-base">I</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold tracking-tight text-white">INSYT</span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/60">Corporate</span>
            </div>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              No worries,<br />we&apos;ll help you reset.
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Enter your email and we&apos;ll send you instructions to reset your password.
            </p>
          </div>
          <p className="text-[12px] text-white/40">© {new Date().getFullYear()} INSYT. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-corp-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--corp-text)" }}>INSYT Corporate</span>
          </Link>

          {!sent ? (
            <>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>Reset your password</h2>
              <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                Enter the email associated with your account and we&apos;ll send a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-corp-accent/30 transition-all"
                      style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white bg-corp-accent rounded-xl hover:bg-corp-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <Mail size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>Check your email</h2>
              <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <button onClick={() => setSent(false)} className="text-[13px] font-medium text-corp-accent hover:underline">
                Didn&apos;t receive it? Try again
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-[13px] font-medium hover:underline" style={{ color: "var(--corp-text-secondary)" }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
