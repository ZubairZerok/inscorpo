"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Platform",
    question: "What is INSYT Corporate?",
    answer: "INSYT Corporate is The Career Operating System — a premium platform for professional development. It combines structured learning paths, mock tests, AI tools, gamification, and career tracking into one platform. We prepare users for private banking, Bangladesh Bank, corporate jobs, GRE, GMAT, IELTS, and more.",
  },
  {
    category: "Platform",
    question: "How is this different from Coursera or Udemy?",
    answer: "INSYT Corporate isn't a course marketplace. It's a complete career operating system. You don't just watch videos — you level up through XP, earn ranks, build a Career Passport, take proctored mock tests, use AI coaching tools, and track your career growth. Every interaction is gamified and measurable.",
  },
  {
    category: "Pricing",
    question: "Can I start for free?",
    answer: "Yes! The Starter plan gives you access to limited learning paths, 5 mock tests per month, basic career passport, and community access. You can upgrade to Pro anytime to unlock all features.",
  },
  {
    category: "Pricing",
    question: "How does the XP marketplace work?",
    answer: "As you learn, complete tests, and engage with the community, you earn XP. XP unlocks ranks (Bronze → Legend) and can be redeemed in the marketplace for premium courses, templates, exam vouchers, and more.",
  },
  {
    category: "Certificates",
    question: "Are the certificates verified?",
    answer: "Yes. Every certificate has a unique verification URL and QR code. Employers and institutions can verify your credentials instantly. Our architecture is blockchain-ready for future immutable verification.",
  },
  {
    category: "Career",
    question: "What is the Career Passport?",
    answer: "The Career Passport is your professional identity — a comprehensive profile containing your skills, certificates, XP history, achievements, projects, internships, and recommendations. You can share it publicly, download as PDF, or link it to your LinkedIn profile.",
  },
  {
    category: "Career",
    question: "Do you offer job placement support?",
    answer: "The Career Hub connects you with job listings, internships, competitions, scholarships, and events from our partner organizations. We also provide AI-powered resume review and interview preparation tools.",
  },
  {
    category: "Platform",
    question: "What AI tools are available?",
    answer: "We offer 12 AI-powered tools: Resume Review, Mock Interview, Career Advisor, Roadmap Generator, Course Recommender, Skill Gap Analysis, Mock Interview, Email Generator, Business Writing Coach, PowerPoint Reviewer, Excel Formula Assistant, and Study Planner.",
  },
];

function FAQItem({ faq, isOpen, toggle }: { faq: typeof faqs[0]; isOpen: boolean; toggle: () => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: isOpen ? "var(--corp-surface)" : "transparent",
        border: isOpen ? "1px solid var(--corp-border)" : "1px solid transparent",
      }}
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <span className="text-[15px] font-medium pr-4" style={{ color: "var(--corp-text)" }}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} style={{ color: "var(--corp-text-tertiary)" }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-3xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium mb-6"
            style={{
              background: "var(--corp-accent-light)",
              color: "var(--corp-accent)",
              border: "1px solid rgba(37, 99, 235, 0.08)",
            }}
          >
            <HelpCircle size={14} />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--corp-text)" }}>
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-2"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
