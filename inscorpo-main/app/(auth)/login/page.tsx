"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  Sparkles, TrendingUp, Award, Users, Loader2
} from "lucide-react";
import { account, OAuthProvider } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("insyt_remembered_email") || "";
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem("insyt_remembered_email"));
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetUrl, setTargetUrl] = useState("/dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get("from");
      if (fromParam && fromParam.startsWith("/")) {
        setTargetUrl(fromParam);
      }
      const errorParam = params.get("error");
      if (errorParam) {
        try {
          const parsed = JSON.parse(errorParam);
          if (parsed.type === "user_oauth2_provider_failure" || parsed.code === 424) {
            setError("Google Login is not configured. Please sign in with your Email and Password.");
          } else {
            const rawMsg = parsed.message || errorParam;
            setError(typeof rawMsg === "string" ? rawMsg.slice(0, 200) : "Authentication error occurred.");
          }
        } catch {
          setError(errorParam.slice(0, 200));
        }
      }
    }

    // Check if user is already logged in
    const checkActiveSession = async () => {
      try {
        const user = await account.get();
        if (user) {
          router.push(targetUrl);
        }
      } catch {
        // Not logged in — user can proceed to sign in
      }
    };
    checkActiveSession();
  }, [targetUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Persist or clear remembered email
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("insyt_remembered_email", email);
      } else {
        localStorage.removeItem("insyt_remembered_email");
      }
    }

    try {
      // Clear any leftover or active session before attempting a new login
      try {
        await account.deleteSession("current");
      } catch {
        // Ignored if no session was active
      }

      await account.createEmailPasswordSession(email, password);
      // Wait for session cookie/storage to commit and set a fallback cookie for Next.js proxy
      document.cookie = "insyt_fallback_session=true; path=/; max-age=31536000";
      window.location.href = targetUrl;
    } catch (err: any) {
      if (err?.message?.includes("prohibited when a session is active") || err?.code === 409) {
        // Force session cleanup and retry once
        try {
          await account.deleteSession("current");
          await account.createEmailPasswordSession(email, password);
          document.cookie = "insyt_fallback_session=true; path=/; max-age=31536000";
          window.location.href = targetUrl;
          return;
        } catch (retryErr: any) {
          setError(retryErr.message || "Session conflict. Please refresh and try again.");
        }
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    try {
      try {
        await account.deleteSession("current");
      } catch {}
      account.createOAuth2Session(
        provider,
        `${window.location.origin}${targetUrl}`,
        `${window.location.origin}/login`
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-corp-accent via-blue-600 to-corp-cyan">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 blur-xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-base">I</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold tracking-tight text-white">INSYT</span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/60">Corporate</span>
            </div>
          </Link>

          {/* Center Content */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome back to<br />your career OS.
            </h1>
            <p className="text-lg text-white/70 max-w-md mb-10">
              Continue leveling up your professional skills, track your progress, and achieve your career goals.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {[
                { icon: Users, label: "Active Learners", value: "12,500+" },
                { icon: Award, label: "Certificates", value: "8,400+" },
                { icon: TrendingUp, label: "Career Upgrades", value: "3,200+" },
                { icon: Sparkles, label: "AI Tools", value: "12" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <stat.icon size={16} className="text-white/80" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{stat.value}</p>
                    <p className="text-white/50 text-[11px]">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-[12px] text-white/40">
            © {new Date().getFullYear()} INSYT. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-corp-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--corp-text)" }}>
              INSYT Corporate
            </span>
          </Link>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>
            Sign in to your account
          </h2>
          <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-corp-accent font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium">
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleOAuth(OAuthProvider.Google)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:shadow-md"
              style={{
                border: "1px solid var(--corp-border)",
                color: "var(--corp-text)",
                background: "var(--corp-surface)",
              }}
            >
              <span className="w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold bg-corp-accent/10 text-corp-accent">
                G
              </span>
              Sign in with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--corp-border)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--corp-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                <input
                  type="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] transition-all duration-200 outline-none focus:ring-2 focus:ring-corp-accent/30"
                  style={{
                    background: "var(--corp-surface)",
                    border: "1px solid var(--corp-border)",
                    color: "var(--corp-text)",
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-[14px] transition-all duration-200 outline-none focus:ring-2 focus:ring-corp-accent/30"
                  style={{
                    background: "var(--corp-surface)",
                    border: "1px solid var(--corp-border)",
                    color: "var(--corp-text)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--corp-text-tertiary)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-corp-accent"
                />
                <span className="text-[13px]" style={{ color: "var(--corp-text-secondary)" }}>
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] font-medium text-corp-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white bg-corp-accent rounded-xl hover:bg-corp-accent-hover transition-all duration-300 shadow-md hover:shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
