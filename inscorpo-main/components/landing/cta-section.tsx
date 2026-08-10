"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 overflow-hidden" style={{
      background: "linear-gradient(145deg, #060F24 0%, #0F2040 50%, #0A1A38 100%)"
    }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "linear-gradient(rgba(37,99,235,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.8) 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }} />


      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* #22: Removed pill badge — headline speaks for itself */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: "#E8EFFE" }}>
            Ready to Transform
            <br />
            <span className="text-gradient">Your Career?</span>
          </h2>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(232,239,254,0.65)" }}>
            Join thousands of professionals who are leveling up their careers with INSYT Corporate.
            Start free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-[16px] font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:gap-3 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #F0D080, #C9A84C)",
                color: "#0d1f3c",
                boxShadow: "0 8px 32px rgba(201,168,76,0.3)",
              }}
            >
              Get Started Free
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[16px] font-semibold rounded-xl transition-all duration-300 active:scale-[0.97]"
              style={{
                color: "rgba(232,239,254,0.85)",
                border: "1px solid rgba(37,99,235,0.4)",
                background: "rgba(37,99,235,0.08)",
              }}
            >
              Learn More
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[13px]" style={{ color: "rgba(232,239,254,0.4)" }}>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Free to start
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
