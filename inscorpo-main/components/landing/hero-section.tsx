"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Award, Users } from "lucide-react";
import Link from "next/link";

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
    <span ref={ref} className="font-mono font-bold text-3xl md:text-4xl" style={{ color: "#E8EFFE" }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

import { useUser } from "@/components/providers/user-context";
import { useAuth } from "@/components/providers/auth-provider";
import { fetchGlobalStats } from "@/lib/db";

export function HeroSection() {
  let state = { xp: 0, level: 1, streak: 0 };
  let user = null;
  
  try {
    const userCtx = useUser();
    state = userCtx.state;
  } catch {}
  
  try {
    const authCtx = useAuth();
    user = authCtx.user;
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
    { label: "Learning Paths", value: stats.totalPaths, suffix: "+", icon: Sparkles },
    { label: "Courses Available", value: stats.totalCourses, suffix: "+", icon: TrendingUp },
    { label: "Certificates Issued", value: 8400, suffix: "+", icon: Award },
  ];

  // Derive dynamic floating passport cards
  const userRank = state.xp >= 5000 ? "Platinum" : "Gold";
  const userXpFormatted = state.xp.toLocaleString();
  
  const dynamicFloatingCards = [
    {
      title: "Career Passport",
      subtitle: user ? `Level ${state.level} · ${userRank} Rank` : "Level 24 · Diamond Rank",
      gradient: "from-corp-accent to-corp-cyan",
      delay: 0,
    },
    {
      title: "Mock Test Score",
      subtitle: "92nd Percentile · Banking",
      gradient: "from-corp-cyan to-emerald-500",
      delay: 0.3,
    },
    {
      title: "Weekly Streak",
      subtitle: user ? `${state.streak} Days · ${userXpFormatted} XP` : "14 Days · 2,400 XP",
      gradient: "from-amber-500 to-orange-500",
      delay: 0.6,
    },
  ];
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #06091a 0%, #081130 35%, #0c1a40 65%, #06091a 100%)" }}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "linear-gradient(rgba(37,99,235,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.6) 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }} />


      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium mb-8"
              style={{
                background: "var(--corp-accent-light, #EFF6FF)",
                color: "var(--corp-accent)",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <Sparkles size={14} />
              The Career Operating System
            </motion.div>

            {/* Headline */}
            <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight mb-6">
              <span style={{ color: "#E8EFFE" }}>
                Level Up Your
              </span>
              <br />
              {/* #14: text-gradient applied ONLY to hero H1 */}
              <span className="text-gradient">
                Professional Career
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: "rgba(232,239,254,0.72)" }}>
              Master Management Trainee (MTO) recruitment, corporate Excel, financial modeling, and AI productivity. 
              Track your progress with XP, ranks, and a Career Passport that proves your expertise.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-white bg-corp-accent rounded-xl hover:bg-corp-accent-hover transition-all duration-300 shadow-lg shadow-corp-accent/30 hover:shadow-xl hover:shadow-corp-accent/40 hover:gap-3 active:scale-[0.97]"
              >
                Start Free
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px] font-semibold rounded-xl transition-all duration-300 active:scale-[0.97]"
                style={{
                  color: "rgba(232,239,254,0.85)",
                  border: "1px solid rgba(37,99,235,0.4)",
                  background: "rgba(37,99,235,0.08)",
                }}
              >
                <div className="w-8 h-8 rounded-full bg-corp-accent/20 flex items-center justify-center">
                  <Play size={14} className="text-corp-accent ml-0.5" />
                </div>
                See How It Works
              </button>
            </div>

            {/* #57 Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-[12px]" style={{ color: "rgba(232,239,254,0.5)" }}>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SSL secured
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-corp-accent" />
                {stats.activeLearners.toLocaleString()}+ learners
              </span>
            </div>
          </motion.div>

          {/* Right: Floating UI Cards */}
          <div className="relative hidden lg:block h-[520px]">
            {dynamicFloatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.4 + card.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute glass-strong rounded-2xl p-5 shadow-xl cursor-default ${
                  i === 0 ? "top-8 left-4 w-64 animate-float" :
                  i === 1 ? "top-36 right-0 w-72 animate-float-delayed" :
                  "bottom-16 left-12 w-60 animate-float-slow"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                  {i === 0 && <Award size={18} className="text-white" />}
                  {i === 1 && <TrendingUp size={18} className="text-white" />}
                  {i === 2 && <Sparkles size={18} className="text-white" />}
                </div>
                <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--corp-text)" }}>{card.title}</p>
                <p className="text-[12px]" style={{ color: "var(--corp-text-tertiary)" }}>{card.subtitle}</p>

                {/* Mini progress bar */}
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--corp-border)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + i * 15}%` }}
                    transition={{ delay: 1.2 + card.delay, duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${card.gradient}`}
                  />
                </div>
              </motion.div>
            ))}


          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {dynamicStats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.15)" }}>
                  <stat.icon size={18} className="text-corp-accent" />
                </div>
                <span className="font-mono font-bold text-3xl md:text-4xl" style={{ color: "#E8EFFE" }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="text-[13px] font-medium" style={{ color: "rgba(232,239,254,0.55)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
