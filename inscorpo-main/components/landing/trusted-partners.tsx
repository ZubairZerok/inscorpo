"use client";

import { motion } from "framer-motion";

const partners = [
  "Microsoft", "British Council", "IDP", "Sonali Bank", "Janata Bank",
  "Agrani Bank", "Rupali Bank", "IFIC Bank", "City Bank", "BRAC Bank",
  "EBL", "DBBL", "Standard Chartered", "HSBC", "McKinsey",
  "BCG", "Deloitte", "EY", "PwC", "KPMG",
];

export function TrustedPartners() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "var(--corp-bg-secondary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[13px] font-medium uppercase tracking-widest mb-10"
          style={{ color: "var(--corp-text-tertiary)" }}
        >
          Trusted by professionals preparing for
        </motion.p>

        {/* Marquee */}
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="mx-6 flex-shrink-0 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-default"
                style={{
                  background: "var(--corp-surface)",
                  border: "1px solid var(--corp-border)",
                }}
              >
                <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: "var(--corp-text-secondary)" }}>
                  {partner}
                </span>
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to right, var(--corp-bg-secondary), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to left, var(--corp-bg-secondary), transparent)" }} />
        </div>
      </div>
    </section>
  );
}
