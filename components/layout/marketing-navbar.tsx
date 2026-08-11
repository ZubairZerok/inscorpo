"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-md py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-full bg-corp-accent flex items-center justify-center overflow-hidden">
              <span className="text-white font-bold text-sm relative z-10">I</span>
              <div className="absolute inset-0 bg-gradient-to-br from-corp-accent to-corp-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--corp-text)" }}>
                INSYT
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: "var(--corp-text-tertiary)" }}>
                Corporate
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[14px] font-medium rounded-full transition-colors duration-200 text-[#A0ABBC] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-[13px] font-bold rounded-full text-white bg-[#3B5BDB] hover:bg-[#2F4AC0] border border-[#5B7CF6]/40 transition-all duration-200 shadow-md shadow-[#3B5BDB]/20"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-corp-accent-light dark:hover:bg-white/5"
            style={{ color: "var(--corp-text)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] z-40 mx-4 rounded-3xl glass-strong shadow-xl p-6 md:hidden flex flex-col gap-3"
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 text-[14px] font-medium rounded-full text-center transition-colors hover:bg-corp-accent-light dark:hover:bg-white/5 text-[#A0ABBC] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 text-[14px] font-bold rounded-full text-center text-white bg-[#3B5BDB] hover:bg-[#2F4AC0] border border-[#5B7CF6]/40 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


