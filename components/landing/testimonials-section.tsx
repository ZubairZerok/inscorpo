"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Farhan Ahmed",
    role: "Management Trainee, Eastern Bank",
    quote: "INSYT Corporate completely transformed my preparation strategy. The mock tests with adaptive difficulty and detailed analytics helped me understand my weak areas. I secured a top-10 percentile score.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80",
    initials: "FA",
  },
  {
    name: "Nusrat Jahan",
    role: "Bangladesh Bank AD Officer",
    quote: "The banking preparation modules are incredibly thorough. The Career Passport feature helped me present my skills to the selection committee in a structured, verifiable format.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=96&q=80",
    initials: "NJ",
  },
  {
    name: "Rafiul Islam",
    role: "Financial Analyst, Standard Chartered",
    quote: "The financial modeling modules combined with AI-powered study plans kept me on track. The gamification system made studying addictive — I genuinely looked forward to earning XP every day.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
    initials: "RI",
  },
  {
    name: "Tasnim Rahman",
    role: "Business Analyst, Grameenphone",
    quote: "The business analytics path from Excel to Power BI was exactly what I needed. The practical simulations and capstone projects gave me portfolio-ready work samples.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=96&q=80",
    initials: "TR",
  },
  {
    name: "Mehedi Hasan",
    role: "IELTS 8.0, Scholarship Recipient",
    quote: "The IELTS preparation path is world-class. The AI writing coach gave me instant feedback on essays, and the speaking simulations helped me build confidence.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=96&q=80",
    initials: "MH",
  },
  {
    name: "Sabrina Akter",
    role: "Consultant, BCG (incoming)",
    quote: "The interview preparation and corporate communication modules are gold. The AI mock interview tool is remarkably realistic and gave me actionable feedback.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80",
    initials: "SA",
  },
];

export function TestimonialsSection() {
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
              background: "var(--corp-gold-light, #FFFBEB)",
              color: "var(--corp-gold)",
              border: "1px solid rgba(217, 119, 6, 0.08)",
            }}
          >
            <Star size={14} />
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Loved by{" "}
            <span className="text-gradient-gold">Ambitious Professionals</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--corp-text-secondary)" }}>
            Hear from learners who transformed their careers with INSYT Corporate.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: "var(--corp-surface)",
                border: "1px solid var(--corp-border)",
              }}
            >
              {/* Quote icon */}
              <Quote size={24} className="mb-4 opacity-10" style={{ color: "var(--corp-text)" }} />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--corp-text-secondary)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author & Verification */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--corp-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-corp-border">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement!;
                        parent.classList.add("bg-gradient-to-br", "from-corp-accent", "to-corp-cyan", "flex", "items-center", "justify-center");
                        parent.innerHTML = `<span class="text-white text-[12px] font-bold">${t.initials}</span>`;
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[14px] font-semibold" style={{ color: "var(--corp-text)" }}>
                        {t.name}
                      </p>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified Alum
                      </span>
                    </div>
                    <p className="text-[12px]" style={{ color: "var(--corp-text-tertiary)" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
