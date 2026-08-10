"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, ChevronDown, ChevronUp, MessageSquare,
  BookOpen, Zap, Shield, Send, CheckCircle2
} from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const faqs = [
  {
    q: "How does the XP system work?",
    a: "Every action earns XP — completing lessons (40 XP), finishing quizzes (50 XP), taking mock tests (100–200 XP), daily check-ins (25 XP), and helping peers in the community. XP determines your Career Rank (Bronze → Silver → Gold → Platinum → Diamond → Elite → Legend)."
  },
  {
    q: "What is the Career Passport?",
    a: "Your Career Passport is a verifiable professional identity document hosted at insyt.co/passport/[username]. It displays your skill progress, completed certifications, project portfolios, recommendations, and XP achievements."
  },
  {
    q: "How do mock tests work?",
    a: "Mock tests simulate real exam conditions with time limits, negative marking (where applicable), and adaptive difficulty. After submission, you receive an accuracy score, estimated percentile ranking, XP reward, and a detailed per-question explanation review."
  },
  {
    q: "What is included in the Pro plan?",
    a: "Pro plan gives you: unlimited access to all 7 learning paths with all 50+ modules, unlimited mock tests, full Career Passport with PDF export, the complete AI tools suite (12 tools), priority community support, certificate generation, Career Hub access, and workshop discounts."
  },
  {
    q: "Can I cancel the Pro subscription anytime?",
    a: "Yes. You can cancel your Pro subscription at any time from Settings → Subscription. Your access remains active until the end of the current billing period."
  },
];

const quickLinks = [
  { icon: BookOpen, title: "Learning Paths Guide", desc: "How to navigate and complete learning paths" },
  { icon: Zap, title: "XP & Ranks Explained", desc: "Understand the full gamification system" },
  { icon: Shield, title: "Career Passport Setup", desc: "Share and verify your professional identity" },
  { icon: MessageSquare, title: "Community Rules", desc: "Community standards and posting guidelines" },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setMessage("");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6 font-sans"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--corp-text)" }}>
          ❓ Help &amp; Support Center
        </h1>
        <p className="text-sm font-medium" style={{ color: "var(--corp-text-secondary)" }}>
          Find answers to common questions, browse guides, or contact support directly.
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, idx) => {
          const colors = ["var(--game-blue)", "var(--game-rose)", "var(--game-amber)", "var(--game-blue-dark)"];
          const accent = colors[idx % colors.length];
          return (
            <div
              key={link.title}
              className="p-5 rounded-3xl border transition-all hover:-translate-y-1 cursor-pointer"
              style={{
                background: "var(--corp-surface)",
                borderColor: "var(--corp-border)",
                boxShadow: "var(--shadow-soft-ui)",
              }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-white" style={{ background: accent }}>
                <link.icon size={18} />
              </div>
              <h3 className="text-xs font-extrabold mb-1" style={{ color: "var(--corp-text)" }}>{link.title}</h3>
              <p className="text-[11px] font-medium leading-snug" style={{ color: "var(--corp-text-tertiary)" }}>{link.desc}</p>
            </div>
          );
        })}
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        variants={item}
        className="rounded-3xl border overflow-hidden"
        style={{
          background: "var(--corp-surface)",
          borderColor: "var(--corp-border)",
          boxShadow: "var(--shadow-soft-ui)",
        }}
      >
        <div className="p-5 border-b" style={{ borderColor: "var(--corp-border)" }}>
          <h2 className="text-xs font-extrabold uppercase tracking-tight flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
            <HelpCircle size={16} style={{ color: "var(--game-blue)" }} />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y-2 divide-corp-border">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-corp-bg-secondary"
              >
                <span className="text-xs font-extrabold uppercase pr-4" style={{ color: "var(--corp-text)" }}>
                  {faq.q}
                </span>
                {openFaq === idx
                  ? <ChevronUp size={16} className="text-[#2563eb] flex-shrink-0" />
                  : <ChevronDown size={16} className="text-corp-text-tertiary flex-shrink-0" />
                }
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-5 pb-5 text-xs font-sans font-medium leading-relaxed"
                      style={{ color: "var(--corp-text-secondary)" }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        variants={item}
        className="p-5 rounded-xl border-2 border-corp-border shadow-[5px_5px_0px_0px_#2563eb] font-mono"
        style={{ background: "var(--corp-surface)" }}
      >
        <h2 className="text-xs font-extrabold uppercase tracking-tight mb-4 flex items-center gap-2" style={{ color: "var(--corp-text)" }}>
          <MessageSquare size={16} className="text-[#2563eb]" />
          Contact Support
        </h2>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-[#2563eb] text-white flex items-center justify-center border border-blue-300">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-extrabold uppercase" style={{ color: "var(--corp-text)" }}>Message Sent!</h3>
              <p className="text-xs font-sans font-medium" style={{ color: "var(--corp-text-secondary)" }}>
                Our support team typically responds within 24 hours on business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2.5 rounded-lg text-xs font-extrabold bg-[#2563eb] text-white uppercase shadow-[3px_3px_0px_0px_#1e3a8a] border border-blue-300"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className="w-full h-28 p-3.5 rounded-lg text-xs font-mono font-medium outline-none border-2 border-corp-border focus:border-[#2563eb] bg-corp-bg-secondary text-corp-text resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-extrabold text-white bg-[#2563eb] hover:bg-blue-600 transition-all shadow-[3px_3px_0px_0px_#1e3a8a] border border-blue-300 uppercase"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

