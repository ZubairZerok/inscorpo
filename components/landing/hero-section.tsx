"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, Sparkles, TrendingUp, Award, Users, 
  Flame, CheckCircle2, ShieldCheck, Cpu, Play, BookOpen, ChevronRight, Activity 
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { fetchGlobalStats } from "@/lib/db";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-mono font-bold text-3xl md:text-4xl text-[#E8ECF4]">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function HeroSection() {
  let state = { xp: 2400, level: 24, streak: 14 };
  let user = null;
  
  try {
    const userCtx = useUser();
    if (userCtx?.state) state = userCtx.state;
  } catch {}
  
  try {
    const authCtx = useAuth();
    if (authCtx?.user) user = authCtx.user;
  } catch {}

  const [stats, setStats] = useState({
    activeLearners: 12500,
    totalPaths: 8,
    totalCourses: 45,
  });

  useEffect(() => {
    async function loadStats() {
      const data = await fetchGlobalStats();
      if (data && (data.activeLearners > 0 || data.totalPaths > 0)) {
        setStats({
          activeLearners: Math.max(data.activeLearners, 12500),
          totalPaths: Math.max(data.totalPaths, 8),
          totalCourses: Math.max(data.totalCourses, 45),
        });
      }
    }
    loadStats();
  }, []);

  const dynamicStats = [
    { label: "Active Learners", value: stats.activeLearners, suffix: "+", icon: Users },
    { label: "Learning Tracks", value: stats.totalPaths, suffix: "+", icon: Sparkles },
    { label: "Courses & Masterclasses", value: stats.totalCourses, suffix: "+", icon: TrendingUp },
    { label: "Certificates Verified", value: 8400, suffix: "+", icon: Award },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-hidden bg-gradient-to-b from-[#06091A] via-[#090E24] to-[#06091A]">
      {/* SaaS Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(rgba(91, 124, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(91, 124, 246, 0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px"
        }} 
      />

      {/* Radial Glow Center */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#3B5BDB]/15 blur-[140px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: SaaS Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            {/* Executive Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#161B27] border border-[#262F45] text-[#5B7CF6] shadow-sm"
            >
              <Sparkles size={14} className="text-[#5B7CF6]" />
              <span>EXECUTIVE CAREER OPERATING SYSTEM</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
              Level Up Your <br />
              <span className="bg-gradient-to-r from-[#5B7CF6] via-[#7090FF] to-[#6B9FFF] bg-clip-text text-transparent">
                Professional Career
              </span>
            </h1>

            {/* Executive Body Copy */}
            <p className="text-base md:text-lg leading-relaxed text-[#A0ABBC] max-w-xl">
              Master Management Trainee (MTO) recruitment, corporate Excel, financial modeling, and AI productivity. Track your progress with XP, verified certificates, and an AI-powered Career Passport.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px] font-bold text-white bg-[#3B5BDB] hover:bg-[#2F4AC0] border border-[#5B7CF6]/40 rounded-xl transition-all duration-200 shadow-lg shadow-[#3B5BDB]/25 hover:shadow-xl hover:shadow-[#3B5BDB]/40 active:scale-[0.98]"
              >
                <span>Launch Dashboard</span>
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/learn"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px] font-semibold text-[#E8ECF4] bg-[#161B27] hover:bg-[#1F2840] border border-[#262F45] rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <BookOpen size={16} className="text-[#5B7CF6]" />
                <span>Explore Learning Tracks</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8B98AD] font-medium pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#3DAA78]" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#3DAA78]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#5B7CF6]" />
                SSL Verified
              </span>
            </div>
          </motion.div>

          {/* Right Column: High-Fidelity Executive SaaS App Interface Shell */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Ambient Backlight Behind App Window */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#3B5BDB]/30 to-[#5B7CF6]/20 rounded-2xl blur-xl opacity-60" />

            {/* Window Container */}
            <div className="relative rounded-2xl bg-[#0E1117] border-2 border-[#262F45] shadow-2xl overflow-hidden">
              
              {/* App Window Header Bar */}
              <div className="px-4 py-3 bg-[#161B27] border-b border-[#262F45] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E11D48]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#2D7D5A]/80" />
                  <span className="ml-2 text-xs font-mono text-[#8B98AD]">insyt.co/dashboard</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3DAA78]/20 text-[#3DAA78] border border-[#3DAA78]/40">
                    <Activity size={10} />
                    LIVE SESSION
                  </span>
                </div>
              </div>

              {/* App Interface Body Mockup */}
              <div className="p-6 space-y-5 bg-[#0E1117]">
                
                {/* Header User Card */}
                <div className="p-4 rounded-xl bg-[#161B27] border border-[#262F45] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B5BDB] to-[#5B7CF6] flex items-center justify-center font-bold text-white shadow-md">
                      {user ? "U" : "E"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Executive Analyst</span>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-[#E09C28]/20 text-[#E09C28] border border-[#E09C28]/30">
                          Diamond Rank
                        </span>
                      </div>
                      <span className="text-xs text-[#8B98AD]">Level 24 &bull; 2,400 XP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E09C28]/10 border border-[#E09C28]/30 text-[#E09C28] text-xs font-mono font-bold">
                    <Flame size={14} className="fill-[#E09C28]" />
                    <span>14 Day Streak</span>
                  </div>
                </div>

                {/* Main Track Progress Card */}
                <div className="p-5 rounded-xl bg-[#1A2235] border border-[#262F45] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-[#5B7CF6]" />
                      <span className="text-xs font-bold uppercase text-[#8B98AD]">Active Career Track</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#5B7CF6]">68% Completed</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    Management Trainee Officer (MTO) Track
                  </h3>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#161B27] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#3B5BDB] to-[#5B7CF6] w-[68%]" />
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-[#A0ABBC]">
                    <span>Next: FMCG Case Reallocation Simulation</span>
                    <Link href="/dashboard" className="text-[#5B7CF6] hover:underline flex items-center gap-1 font-semibold">
                      <span>Continue</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Grid Widgets (Mock Test & Passport) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#161B27] border border-[#262F45] space-y-1.5">
                    <div className="flex items-center justify-between text-[#8B98AD] text-xs">
                      <span>Mock Assessment</span>
                      <Award size={14} className="text-[#E09C28]" />
                    </div>
                    <p className="text-lg font-bold text-white font-mono">92nd Percentile</p>
                    <p className="text-[11px] text-[#3DAA78] font-medium">Top 5% Banking Pool</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161B27] border border-[#262F45] space-y-1.5">
                    <div className="flex items-center justify-between text-[#8B98AD] text-xs">
                      <span>Career Passport</span>
                      <ShieldCheck size={14} className="text-[#5B7CF6]" />
                    </div>
                    <p className="text-lg font-bold text-white font-mono">#INS-8942</p>
                    <p className="text-[11px] text-[#5B7CF6] font-medium">12 Verified Skills</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Executive Stats Counter Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 pt-10 border-t border-[#1F2840] grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {dynamicStats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#161B27] border border-[#262F45] flex items-center justify-center text-[#5B7CF6]">
                  <stat.icon size={18} />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#626C80] pt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
