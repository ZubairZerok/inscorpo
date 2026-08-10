"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Landmark, Briefcase, GraduationCap, Languages,
  Brain, BarChart3, Presentation, FileText,
  ArrowRight, BookOpen, Award
} from "lucide-react";
import Link from "next/link";
import { fetchPaths, PathDoc } from "@/lib/db";

const iconMap: Record<string, any> = {
  GraduationCap,
  Landmark,
  BarChart3,
  Presentation,
  Briefcase,
  Users: BookOpen, // fallback
  Brain,
  Languages,
  FileText,
  Award
};

export function LearningPathsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [paths, setPaths] = useState<PathDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      try {
        const dbPaths = await fetchPaths();
        setPaths(dbPaths.slice(0, 5)); // show top 5
      } catch (err) {
        console.error("Failed to fetch paths for preview", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPaths();
  }, []);

  const levelsMap: Record<string, string> = {
    "gre-gmat": "All Levels",
    "gmat": "Intermediate → Advanced",
    "excel-analytics": "Beginner → Advanced",
    "business-communication": "All Levels",
    "career-branding": "Beginner → Intermediate",
    "recruitment-success": "All Levels",
    "business-strategy": "Intermediate → Advanced",
  };

  const tagsMap: Record<string, string> = {
    "excel-analytics": "Most Popular",
    "gre-gmat": "Trending",
    "recruitment-success": "Hot",
  };

  return (
    <section id="paths" className="relative py-28 overflow-hidden" style={{ background: "var(--corp-bg-secondary)" }}>
      <div className="mx-auto max-w-7xl px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium mb-6"
            style={{
              background: "var(--corp-surface)",
              color: "var(--corp-accent)",
              border: "1px solid var(--corp-border)",
            }}
          >
            <BookOpen size={14} />
            Learning Paths
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Choose Your{" "}
            <span className="text-gradient">Career Track</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--corp-text-secondary)" }}>
            Structured learning paths designed by industry experts. Each path includes modules, practice, simulations, and certification.
          </p>
        </motion.div>

        {/* Scrollable Path Cards */}
        {isLoading ? (
          <div className="flex justify-center py-10 text-corp-text-secondary">Loading paths...</div>
        ) : paths.length === 0 ? (
          <div className="flex justify-center py-10 text-corp-text-secondary">No paths found in the database.</div>
        ) : (
          <div className="relative">
            <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
              style={{ scrollbarWidth: "none" }}
            >
              {paths.map((path, i) => {
                const coursesCount = path.modules || 0;
                const hoursSum = path.hours || 0;
                const pathLevel = levelsMap[path.slug] || "All Levels";
                const pathTag = tagsMap[path.slug];
                const subTopics = path.topics ? (path.topics.slice(0, 3).join(" · ") + (path.topics.length > 3 ? "..." : "")) : "";
                const Icon = iconMap[path.icon] || BookOpen;

                return (
                  <Link key={path.slug} href={`/learn/${path.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative flex-shrink-0 w-[300px] snap-start rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer h-full"
                      style={{
                        background: "var(--corp-surface)",
                        border: "1px solid var(--corp-border)",
                      }}
                      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                    >
                      {/* Tag */}
                      {pathTag && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-white ${
                            pathTag === "Most Popular" ? "bg-corp-accent" :
                            pathTag === "Trending" ? "bg-emerald-500" :
                            "bg-amber-500"
                          }`}>
                            {pathTag}
                          </span>
                        </div>
                      )}

                      {/* Gradient Header */}
                      <div className={`h-28 bg-gradient-to-br ${path.gradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute bottom-4 left-5">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Icon size={20} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5" />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--corp-text)" }}>
                          {path.title}
                        </h3>
                        <p className="text-[13px] mb-4 min-h-[40px]" style={{ color: "var(--corp-text-secondary)" }}>
                          {subTopics}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-[12px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                          <span>{coursesCount} Courses</span>
                          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                          <span>{hoursSum} Hours</span>
                        </div>

                        {/* Level Badge */}
                        <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--corp-border)" }}>
                          <span className="text-[12px] font-medium" style={{ color: "var(--corp-text-tertiary)" }}>
                            {pathLevel}
                          </span>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
                            style={{ background: "var(--corp-accent-light)" }}
                          >
                            <ArrowRight size={14} className="text-corp-accent" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-6 w-8 pointer-events-none"
              style={{ background: "linear-gradient(to right, var(--corp-bg-secondary), transparent)" }} />
            <div className="absolute right-0 top-0 bottom-6 w-8 pointer-events-none"
              style={{ background: "linear-gradient(to left, var(--corp-bg-secondary), transparent)" }} />
          </div>
        )}
      </div>
    </section>
  );
}
