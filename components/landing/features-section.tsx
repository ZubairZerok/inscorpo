"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Brain, Target, Cpu, ShoppingBag, Users,
  ArrowRight, BarChart3, Shield, Zap
} from "lucide-react";

const features = [
  {
    title: "Flagship Learning Paths",
    description: "Structured career tracks for Corporate MTOs, Management Trainees, Business Analytics, Financial Modeling, and AI Productivity.",
    icon: BookOpen,
    variant: "primary",
    span: "md:col-span-2",
  },
  {
    title: "Mock Test Engine",
    description: "Timed assessments with negative marking, adaptive difficulty, percentile rankings, and detailed analytics.",
    icon: Target,
    variant: "primary",
    span: "",
  },
  {
    title: "Career Passport",
    description: "Your professional identity. Skills, certificates, XP, achievements, projects — all in one shareable, verifiable profile.",
    icon: Shield,
    variant: "secondary",
    span: "",
  },
  {
    title: "AI-Powered Tools",
    description: "AI Resume Review, Mock Interview, Career Advisor, Skill Gap Analysis, Email Generator, and 8 more intelligent assistants.",
    icon: Brain,
    variant: "primary",
    span: "md:col-span-2",
  },
  {
    title: "Gamified XP & Ranks",
    description: "Every action earns XP. Rise from Bronze to Legend. Daily streaks, achievements, leaderboards, and rewards.",
    icon: Zap,
    variant: "secondary",
    span: "",
  },
  {
    title: "Marketplace",
    description: "Premium courses, templates, exam vouchers, resume packs — redeem with XP or purchase directly.",
    icon: ShoppingBag,
    variant: "neutral",
    span: "",
  },
  {
    title: "Professional Community",
    description: "Spaces for Excel, Power BI, Finance, AI, Interviews, and more. Earn XP by helping peers.",
    icon: Users,
    variant: "neutral",
    span: "",
  },
  {
    title: "Career Analytics",
    description: "Skill radar charts, learning velocity, weak area analysis, and career readiness scores — data-driven growth.",
    icon: BarChart3,
    variant: "primary",
    span: "",
  },
  {
    title: "Enterprise Ready",
    description: "Organization accounts, team dashboards, bulk enrollment, custom learning paths, and compliance tracking.",
    icon: Cpu,
    variant: "neutral",
    span: "md:col-span-2",
  },
];

const variantStyles = {
  primary: { bg: "rgba(37,99,235,0.12)", icon: "#2563EB", border: "rgba(37,99,235,0.15)" },
  secondary: { bg: "rgba(201,168,76,0.12)", icon: "#C9A84C", border: "rgba(201,168,76,0.2)" },
  neutral: { bg: "rgba(100,116,139,0.1)", icon: "#64748B", border: "rgba(100,116,139,0.15)" },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium mb-6"
            style={{
              background: "var(--corp-accent-light)",
              color: "var(--corp-accent)",
              border: "1px solid rgba(37, 99, 235, 0.08)",
            }}
          >
            <Zap size={14} />
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Everything You Need to{" "}
            <span className="text-gradient">Level Up</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--corp-text-secondary)" }}>
            A complete career operating system designed for ambitious professionals.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden ${feature.span}`}
              style={{
                background: "var(--corp-surface)",
                border: `1px solid ${variantStyles[feature.variant as keyof typeof variantStyles].border}`,
              }}
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: `linear-gradient(135deg, rgba(37,99,235,0.02) 0%, transparent 60%)`,
              }} />

              <div className="relative z-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: variantStyles[feature.variant as keyof typeof variantStyles].bg }}
                >
                  <feature.icon
                    size={20}
                    style={{ color: variantStyles[feature.variant as keyof typeof variantStyles].icon }}
                  />
                </div>
                <h3 className="text-[16px] font-semibold mb-2" style={{ color: "var(--corp-text)" }}>
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                  {feature.description}
                </p>
              </div>

              {/* Corner arrow */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                <ArrowRight size={16} style={{ color: "var(--corp-text-tertiary)" }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
