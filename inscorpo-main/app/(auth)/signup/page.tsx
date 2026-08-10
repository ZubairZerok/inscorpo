"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  User, Target, ChevronRight, Check, Briefcase,
  GraduationCap, Landmark, Brain, Languages, BarChart3, Loader2
} from "lucide-react";
import { account, OAuthProvider } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";

const careerGoals = [
  { id: "banking", label: "Private Banking / BD Bank", icon: Landmark, color: "from-blue-500 to-indigo-600" },
  { id: "corporate", label: "Corporate / MT Programs", icon: Briefcase, color: "from-emerald-500 to-teal-600" },
  { id: "gre-gmat", label: "GRE / GMAT", icon: GraduationCap, color: "from-violet-500 to-purple-600" },
  { id: "ielts", label: "IELTS", icon: Languages, color: "from-rose-500 to-pink-600" },
  { id: "ai", label: "AI & Productivity", icon: Brain, color: "from-amber-500 to-orange-600" },
  { id: "analytics", label: "Business Analytics", icon: BarChart3, color: "from-cyan-500 to-blue-600" },
];

const experienceLevels = [
  { id: "student", label: "Student", description: "Currently in university" },
  { id: "fresh", label: "Fresh Graduate", description: "0-1 years experience" },
  { id: "working", label: "Working Professional", description: "1+ years experience" },
  { id: "career-switch", label: "Career Switcher", description: "Transitioning careers" },
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    careerGoals: [] as string[],
    experienceLevel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get("error");
      if (errorParam) {
        try {
          const parsed = JSON.parse(errorParam);
          setError(parsed.message || "Authentication error occurred.");
        } catch (e) {
          setError(errorParam);
        }
      }
    }
  }, []);

  const totalSteps = 4;

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCareerGoal = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      careerGoals: prev.careerGoals.includes(id)
        ? prev.careerGoals.filter((g) => g !== id)
        : [...prev.careerGoals, id],
    }));
  };

  const handleOAuth = (provider: OAuthProvider) => {
    try {
      account.createOAuth2Session(
        provider,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/signup`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Step 1 Validation
    if (step === 1) {
      if (!formData.email || !formData.email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!formData.password || formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 Validation
    if (step === 2) {
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        setError("Please enter your full name (at least 2 characters).");
        return;
      }
      setStep(3);
      return;
    }

    // Step 3 Validation
    if (step === 3) {
      if (formData.careerGoals.length === 0) {
        setError("Please select at least one career goal to personalize your roadmap.");
        return;
      }
      setStep(4);
      return;
    }

    // Step 4 Final Submission Validation
    if (step === 4) {
      if (!formData.experienceLevel) {
        setError("Please select your current experience level.");
        return;
      }

      setIsLoading(true);
      try {
        // Create account
        await account.create(
          ID.unique(),
          formData.email,
          formData.password,
          formData.fullName
        );
        // Login immediately
        await account.createEmailPasswordSession(
          formData.email,
          formData.password
        );
        document.cookie = "insyt_fallback_session=true; path=/; max-age=31536000";
        
        // Save user career goals & experience level preferences
        await account.updatePrefs({
          careerGoals: formData.careerGoals,
          experienceLevel: formData.experienceLevel,
          subscriptionTier: "starter",
          subscriptionStatus: "active",
        });
        
        router.push("/onboarding");
      } catch (err: any) {
        setError(err.message || "Failed to create account. Email may already be registered.");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Left Panel — Branding */}
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
              Start your career<br />transformation today.
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Join thousands of professionals who are leveling up with structured learning, AI tools, and gamified growth.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? "bg-white w-8" : "bg-white/20 w-4"
                }`}
              />
            ))}
            <span className="ml-3 text-[12px] text-white/50">
              Step {step} of {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-corp-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--corp-text)" }}>
              INSYT Corporate
            </span>
          </Link>

          {/* Progress bar (mobile) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                  i + 1 <= step ? "bg-corp-accent" : ""
                }`}
                style={i + 1 > step ? { background: "var(--corp-border)" } : {}}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Account */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>
                      Create your account
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                      Already have an account?{" "}
                      <Link href="/login" className="text-corp-accent font-semibold hover:underline">Sign in</Link>
                    </p>

                     {/* Social Buttons */}
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => handleOAuth(OAuthProvider.Google)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:shadow-md"
                        style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text)", background: "var(--corp-surface)" }}
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold bg-corp-accent/10 text-corp-accent">
                          G
                        </span>
                        Sign up with Google
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px" style={{ background: "var(--corp-border)" }} />
                      <span className="text-[12px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>or</span>
                      <div className="flex-1 h-px" style={{ background: "var(--corp-border)" }} />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>Email</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                          <input
                            type="email"
                            inputMode="email"
                            autoCapitalize="off"
                            autoCorrect="off"
                            autoComplete="email"
                            value={formData.email} onChange={(e) => updateField("email", e.target.value)}
                            placeholder="you@example.com" required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-corp-accent/30 transition-all"
                            style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                          <input
                            type={showPassword ? "text" : "password"} value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            placeholder="Min 8 characters" required minLength={8}
                            className="w-full pl-10 pr-11 py-2.5 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-corp-accent/30 transition-all"
                            style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>
                      Tell us about yourself
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                      We&apos;ll personalize your experience based on this.
                    </p>
                    <div>
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--corp-text)" }}>Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--corp-text-tertiary)" }} />
                        <input
                          type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)}
                          placeholder="Your full name" required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-corp-accent/30 transition-all"
                          style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Career Goals */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>
                      What are your goals?
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                      Select all that apply. We&apos;ll curate your learning path.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {careerGoals.map((goal) => {
                        const selected = formData.careerGoals.includes(goal.id);
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => toggleCareerGoal(goal.id)}
                            className={`relative flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${
                              selected ? "ring-2 ring-corp-accent shadow-md" : ""
                            }`}
                            style={{
                              background: selected ? "var(--corp-accent-light, #EFF6FF)" : "var(--corp-surface)",
                              border: selected ? "1px solid transparent" : "1px solid var(--corp-border)",
                            }}
                          >
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center flex-shrink-0`}>
                              <goal.icon size={16} className="text-white" />
                            </div>
                            <span className="text-[13px] font-medium" style={{ color: "var(--corp-text)" }}>
                              {goal.label}
                            </span>
                            {selected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-corp-accent flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Experience Level */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--corp-text)" }}>
                      Your experience level
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "var(--corp-text-secondary)" }}>
                      This helps us recommend the right difficulty.
                    </p>
                    <div className="space-y-3">
                      {experienceLevels.map((level) => {
                        const selected = formData.experienceLevel === level.id;
                        return (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => updateField("experienceLevel", level.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ${
                              selected ? "ring-2 ring-corp-accent shadow-md" : ""
                            }`}
                            style={{
                              background: selected ? "var(--corp-accent-light, #EFF6FF)" : "var(--corp-surface)",
                              border: selected ? "1px solid transparent" : "1px solid var(--corp-border)",
                            }}
                          >
                            <div>
                              <p className="text-[14px] font-semibold" style={{ color: "var(--corp-text)" }}>{level.label}</p>
                              <p className="text-[12px]" style={{ color: "var(--corp-text-tertiary)" }}>{level.description}</p>
                            </div>
                            {selected && (
                              <div className="w-5 h-5 rounded-full bg-corp-accent flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-medium transition-all"
                      style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white bg-corp-accent rounded-xl hover:bg-corp-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        {step === totalSteps ? "Create Account" : "Continue"}
                        {step === totalSteps ? <Check size={16} /> : <ArrowRight size={16} />}
                      </>
                    )}
                  </button>
                </div>

                {/* Terms */}
                {step === 1 && (
                  <p className="mt-6 text-center text-[12px]" style={{ color: "var(--corp-text-tertiary)" }}>
                    By signing up, you agree to our{" "}
                    <Link href="#" className="text-corp-accent hover:underline">Terms</Link> and{" "}
                    <Link href="#" className="text-corp-accent hover:underline">Privacy Policy</Link>.
                  </p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
