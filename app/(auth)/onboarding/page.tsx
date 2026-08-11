"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Briefcase, GraduationCap, Award, Sparkles, CheckCircle2,
  ChevronRight, ArrowRight, ShieldCheck, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/user-context";
import { account } from "@/lib/appwrite";

const CAREER_GOALS = [
  { id: "mto", title: "Management Trainee Officer (MTO)", icon: "🏆", desc: "Targeting MNCs & Bank leadership tracks (BRAC Bank, Unilever, GP, BAT)" },
  { id: "finance", title: "Corporate Finance & Banking", icon: "📊", desc: "Financial modeling, credit analysis, valuation, and investment banking" },
  { id: "tech", title: "Tech, Product & Data Analytics", icon: "💻", desc: "Software engineering, product management, Power BI, and AI automation" },
  { id: "comm", title: "Business Communication & Pitching", icon: "🎤", desc: "Executive presentations, slide decks, cold email strategy, and workplace communication" },
];

const EXP_LEVELS = [
  { id: "undergrad", label: "University Undergrad (Final Year / Junior)", detail: "Preparing early for campus placements" },
  { id: "fresh_grad", label: "Fresh Graduate (0-1 Year Experience)", detail: "Actively applying to MTO and corporate entry circulars" },
  { id: "mid_corp", label: "Mid-Level Professional (1-3 Years Experience)", detail: "Upskilling for promotion or sector transition" },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { addXP, enrollInPath, addNotification } = useUser();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("mto");
  const [selectedExp, setSelectedExp] = useState("fresh_grad");
  const [enrolling, setEnrolling] = useState(false);

  const handleFinishOnboarding = async () => {
    setEnrolling(true);

    try {
      await account.updatePrefs({
        careerGoals: [selectedGoal],
        experienceLevel: selectedExp,
      });
    } catch {}

    // Auto-enroll based on goal
    if (selectedGoal === "mto") enrollInPath("corporate-mto", "Corporate Job / MTO Masterclass");
    else if (selectedGoal === "finance") enrollInPath("excel-corporate", "Excel for Corporate Careers");
    else if (selectedGoal === "tech") enrollInPath("ai-automation", "AI & Automation for Work");
    else enrollInPath("business-comm", "Business Communication & Slide Pitching");

    // Award welcome XP
    addXP(100, "🎉 Completed Onboarding Wizard & Activated Career Passport");

    addNotification({
      type: "achievement",
      title: "Welcome to INSYT Corporate!",
      message: "Your personalized learning roadmap and Career Passport have been initialized.",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--corp-bg)" }}>
      <div className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6"
        style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}>

        {/* Top Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-corp-text-tertiary">
            <span>Step {step} of 4</span>
            <span>{step === 1 ? "Career Goal" : step === 2 ? "Experience" : step === 3 ? "Roadmap" : "Welcome Bonus"}</span>
          </div>
          <div className="h-2 rounded-full bg-corp-bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-corp-accent to-emerald-500 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: "var(--corp-text)" }}>What is your primary career goal?</h2>
              <p className="text-xs mt-1 text-corp-text-secondary">We will tailor your daily drills, AI resume recommendations, and course tracks.</p>
            </div>

            <div className="space-y-2.5">
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    selectedGoal === goal.id
                      ? "border-corp-accent bg-corp-accent/10 ring-2 ring-corp-accent/20"
                      : "border-corp-border bg-corp-bg-secondary hover:border-corp-accent/50"
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-corp-text">{goal.title}</p>
                    <p className="text-[11px] text-corp-text-tertiary mt-0.5">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Continue to Experience Level</span>
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Experience Standing */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: "var(--corp-text)" }}>Select your current standing</h2>
              <p className="text-xs mt-1 text-corp-text-secondary">Helps recruiters benchmark your Career Passport profile.</p>
            </div>

            <div className="space-y-2.5">
              {EXP_LEVELS.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExp(exp.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    selectedExp === exp.id
                      ? "border-corp-accent bg-corp-accent/10 ring-2 ring-corp-accent/20 font-bold"
                      : "border-corp-border bg-corp-bg-secondary"
                  }`}
                >
                  <p className="text-xs text-corp-text">{exp.label}</p>
                  <p className="text-[11px] text-corp-text-tertiary mt-0.5">{exp.detail}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3.5 px-5 rounded-2xl text-xs font-semibold border border-corp-border text-corp-text"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Preview Tailored Roadmap</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Roadmap Preview */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: "var(--corp-text)" }}>Your Tailored Learning Roadmap</h2>
              <p className="text-xs mt-1 text-corp-text-secondary">Based on your selections, we will auto-enroll you into your starter track.</p>
            </div>

              <div className="p-5 rounded-2xl bg-corp-bg-secondary border border-corp-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-corp-accent/10 flex items-center justify-center text-corp-accent">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-corp-text">
                      {selectedGoal === "mto"
                        ? "Corporate Management Trainee (MTO) Preparation"
                        : selectedGoal === "finance"
                        ? "Excel Financial Modeling & Corporate Finance"
                        : selectedGoal === "tech"
                        ? "AI & Automation for Work Productivity"
                        : "Business Communication & Slide Pitching Masterclass"}
                    </p>
                    <p className="text-[11px] text-corp-text-tertiary">Recommended Starter Path</p>
                  </div>
                </div>
                <ul className="text-xs text-corp-text-secondary space-y-1.5 list-disc list-inside pt-2 border-t border-corp-border">
                  {selectedGoal === "mto" ? (
                    <>
                      <li>MTO Assessment Case Solving Templates</li>
                      <li>Behavioral Interview STAR Frameworks</li>
                      <li>Verified Certificate of Completion</li>
                    </>
                  ) : selectedGoal === "finance" ? (
                    <>
                      <li>3-Statement Financial Modeling Sandboxes</li>
                      <li>DCF Valuation & Sensitivity Analysis</li>
                      <li>Verified Certificate of Completion</li>
                    </>
                  ) : selectedGoal === "tech" ? (
                    <>
                      <li>Power BI & Interactive Dashboards</li>
                      <li>Prompt Engineering & Workflow Automation</li>
                      <li>Verified Certificate of Completion</li>
                    </>
                  ) : (
                    <>
                      <li>McKinsey Issue Trees & Slide Storytelling</li>
                      <li>Executive Cold Email & Memo Writing</li>
                      <li>Verified Certificate of Completion</li>
                    </>
                  )}
                </ul>
              </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-5 rounded-2xl text-xs font-semibold border border-corp-border text-corp-text"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl text-xs font-bold text-white bg-corp-accent hover:bg-corp-accent-hover transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Claim +100 XP Welcome Bonus</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Finish */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Sparkles size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-corp-text">You're All Set!</h2>
              <p className="text-xs mt-1 text-corp-text-secondary">+100 XP Welcome Bonus awarded to your account.</p>
            </div>

            <button
              onClick={handleFinishOnboarding}
              disabled={enrolling}
              className="w-full py-4 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {enrolling ? (
                <span>Initialising Dashboard...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Launch My Career Dashboard</span>
                </>
              )}
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
