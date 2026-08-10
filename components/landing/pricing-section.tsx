"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Single Course",
    price: { monthly: "৳499", annual: "৳499" },
    period: "one-time",
    description: "Perfect for targeting 1 specific skill (e.g. Corporate Excel).",
    features: [
      "Lifetime access to 1 chosen course",
      "Interactive formula sandboxes",
      "Course Completion Certificate",
      "Downloadable Excel/PPT templates",
      "Community Support",
      "bKash & Nagad instant payment",
    ],
    cta: "Buy Single Course",
    highlighted: false,
  },
  {
    name: "Flagship Pathway Pass",
    price: { monthly: "৳1,999", annual: "৳1,999" },
    period: "one-time",
    description: "Complete end-to-end career track (MTO or Business Analytics).",
    features: [
      "Lifetime access to full 4-course path",
      "MTO Assessment & Case Study mastery",
      "Verified Career Passport Badge",
      "Capstone Project Expert Review",
      "AI Resume Audit & Mock Interviewer",
      "Priority HR Circular alerts",
      "Direct verification URL for recruiters",
    ],
    cta: "Get Flagship Pass",
    highlighted: true,
    badge: "Executive Choice",
  },
  {
    name: "Pro All-Access",
    price: { monthly: "৳799", annual: "৳599" },
    period: "/mo",
    description: "Unlimited access to ALL paths, courses, and AI tools.",
    features: [
      "ALL Learning Paths & Master Courses",
      "Unlimited AI Career Tools (all 12)",
      "Unlimited Timed SHL Mock Tests",
      "Full Career Passport + PDF Export",
      "All Ranks, XP Bonuses & Rewards",
      "Certificate Generation on all courses",
      "Priority Community Support",
    ],
    cta: "Start Pro Pass",
    highlighted: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-28 overflow-hidden" style={{ background: "var(--corp-bg-secondary)" }}>
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
              background: "var(--corp-surface)",
              color: "var(--corp-accent)",
              border: "1px solid var(--corp-border)",
            }}
          >
            <Sparkles size={14} />
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Invest in Your{" "}
            <span className="text-gradient">Future</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--corp-text-secondary)" }}>
            Choose the plan that fits your career goals. Upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-xl" style={{ background: "var(--corp-surface)", border: "1px solid var(--corp-border)" }}>
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                !annual ? "bg-corp-accent text-white shadow-sm" : ""
              }`}
              style={annual ? { color: "var(--corp-text-secondary)" } : {}}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                annual ? "bg-corp-accent text-white shadow-sm" : ""
              }`}
              style={!annual ? { color: "var(--corp-text-secondary)" } : {}}
            >
              Annual
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-[#0d1f3c]" style={{ background: "linear-gradient(135deg, #F0D080, #C9A84C)" }}>
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                plan.highlighted ? "shadow-xl scale-[1.02] md:scale-105" : ""
              }`}
              style={{
                background: plan.highlighted
                  ? "linear-gradient(145deg, #060F24 0%, #0F2040 50%, #142A52 100%)"
                  : "var(--corp-surface)",
                border: plan.highlighted
                  ? "1px solid rgba(201,168,76,0.4)"
                  : "1px solid var(--corp-border)",
              }}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-[11px] font-bold shadow-lg text-[#0d1f3c]"
                    style={{ background: "linear-gradient(135deg, #F0D080, #C9A84C)" }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[18px] font-semibold mb-2" style={{ color: plan.highlighted ? "#F0D080" : "var(--corp-text)" }}>
                  {plan.name}
                </h3>
                <p className="text-[13px] mb-4" style={{ color: plan.highlighted ? "rgba(232,239,254,0.7)" : "var(--corp-text-secondary)" }}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: plan.highlighted ? "#FFFFFF" : "var(--corp-text)" }}>
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.period && (
                    <span className="text-[14px]" style={{ color: plan.highlighted ? "rgba(232,239,254,0.55)" : "var(--corp-text-tertiary)" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: plan.highlighted ? "rgba(201,168,76,0.2)" : "rgba(5,150,105,0.1)"
                      }}
                    >
                      <Check size={12} style={{ color: plan.highlighted ? "#C9A84C" : "#059669" }} />
                    </div>
                    <span className="text-[13px]" style={{ color: plan.highlighted ? "rgba(232,239,254,0.85)" : "var(--corp-text-secondary)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.highlighted ? (
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #F0D080, #C9A84C)",
                    color: "#0d1f3c",
                    boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  href={plan.name === "Enterprise" ? "mailto:sales@insyt.co?subject=INSYT%20Enterprise%20Plan%20Inquiry" : "/signup"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 hover:bg-corp-accent-light dark:hover:bg-white/5 active:scale-[0.97]"
                  style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text)" }}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
