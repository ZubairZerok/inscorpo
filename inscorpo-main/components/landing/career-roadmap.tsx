"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Star, Zap, Crown, Diamond, Flame, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const ranks = [
  { name: "Bronze", xp: "0", icon: Award, color: "#CD7F32", bgColor: "rgba(205,127,50,0.08)", slug: "excel-corporate", desc: "Start your journey" },
  { name: "Silver", xp: "2,500", icon: Star, color: "#A0AEC0", bgColor: "rgba(160,174,192,0.08)", slug: "corporate-mto", desc: "Build your foundation" },
  { name: "Gold", xp: "7,500", icon: Trophy, color: "#D97706", bgColor: "rgba(217,119,6,0.08)", slug: "power-bi", desc: "Master core skills" },
  { name: "Platinum", xp: "15,000", icon: Zap, color: "#6366F1", bgColor: "rgba(99,102,241,0.08)", slug: "ai-automation", desc: "Advanced expertise" },
  { name: "Diamond", xp: "30,000", icon: Diamond, color: "#0891B2", bgColor: "rgba(8,145,178,0.08)", slug: "supply-chain", desc: "Executive level" },
  { name: "Elite", xp: "50,000", icon: Flame, color: "#DC2626", bgColor: "rgba(220,38,38,0.08)", slug: "business-comm", desc: "Industry leader" },
  { name: "Legend", xp: "100,000", icon: Crown, color: "#D97706", bgColor: "rgba(217,119,6,0.12)", slug: "project-management", desc: "Career legend" },
];

export function CareerRoadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
            <Trophy size={14} />
            Progression System
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Your Career{" "}
            <span className="text-gradient">Progression</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--corp-text-secondary)" }}>
            Every action earns XP. Rise through the ranks from Bronze to Legend.
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: "var(--corp-border)" }}
          />

          {ranks.map((rank, i) => (
            <motion.div
              key={rank.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex items-center mb-8 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Card */}
              <div className={`w-full md:w-[calc(50%-32px)] ${i % 2 === 0 ? "md:pr-0" : "md:pl-0"}`}>
                <Link href={`/learn/${rank.slug}`} className="block">
                  <div
                    className="group rounded-2xl p-5 transition-all duration-300 cursor-pointer hover:shadow-md"
                    style={{
                      background: "var(--corp-surface)",
                      border: "1px solid var(--corp-border)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: rank.bgColor }}
                      >
                        <rank.icon size={22} style={{ color: rank.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold" style={{ color: "var(--corp-text)" }}>
                          {rank.name}
                        </h3>
                        <p className="text-[13px] font-mono" style={{ color: "var(--corp-text-tertiary)" }}>
                          {rank.xp} XP
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--corp-text-secondary)" }}>
                          {rank.desc}
                        </p>
                      </div>
                      <ArrowRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "var(--corp-accent)" }} />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.3 }}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    background: rank.bgColor,
                    borderColor: rank.color,
                  }}
                />
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block w-[calc(50%-32px)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
