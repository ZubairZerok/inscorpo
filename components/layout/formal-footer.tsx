"use client";

import Link from "next/link";
import { Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

const footerNavigation = {
  product: [
    { name: "Learning Paths", href: "/learn" },
    { name: "Mock Test Engine", href: "/mock-tests" },
    { name: "Career Passport", href: "/career-passport" },
    { name: "AI Assistant Suite", href: "/ai" },
    { name: "XP Marketplace", href: "/marketplace" },
  ],
  solutions: [
    { name: "Management Trainee (MTO)", href: "/learn" },
    { name: "Business Analytics & Excel", href: "/learn" },
    { name: "Banking Prep (AD & Officer)", href: "/learn" },
    { name: "GRE & GMAT Strategy", href: "/learn" },
  ],
  company: [
    { name: "About INSYT Corporate", href: "/about" },
    { name: "Career Opportunities", href: "/jobs" },
    { name: "Professional Community", href: "/community" },
    { name: "Pro Membership Pass", href: "/subscription" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Security & Compliance", href: "#" },
    { name: "Cookie Preferences", href: "#" },
  ],
};

export function FormalFooter() {
  return (
    <footer className="relative border-t border-[#262F45] bg-[#0A0D14] text-[#E8ECF4] pt-16 pb-12 overflow-hidden">
      {/* Background glow accent */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#3B5BDB]/40 to-transparent" 
        aria-hidden="true" 
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-[#1F2840]">
          {/* Brand & Description Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B5BDB] to-[#4B94E0] flex items-center justify-center shadow-lg shadow-[#3B5BDB]/20">
                <span className="text-white font-bold text-base">I</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-[#5B7CF6] transition-colors">
                  INSYT <span className="font-light text-[#A0ABBC]">Corporate</span>
                </span>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#626C80]">
                  Career Operating System
                </span>
              </div>
            </Link>

            <p className="text-[13px] leading-relaxed text-[#A0ABBC] max-w-sm">
              The executive-grade Career Operating System for Bangladesh&apos;s ambitious corporate candidates, management trainees, and business leaders.
            </p>

            <div className="pt-2 space-y-2 text-[13px] text-[#8B98AD]">
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#5B7CF6]" />
                <a href="mailto:hello@insyt.co" className="hover:text-white transition-colors">
                  hello@insyt.co
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#5B7CF6]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Operational Status Badge */}
            <div className="pt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161B27] border border-[#262F45] text-[12px] text-[#A0ABBC]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DAA78] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DAA78]" />
                </span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-white mb-4">
              Product
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              {footerNavigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[#A0ABBC] hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-white mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              {footerNavigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[#A0ABBC] hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[#A0ABBC] hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[#A0ABBC] hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Metadata & Social Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#626C80]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#5B7CF6]" />
            <span>&copy; {new Date().getFullYear()} INSYT Corporate. All rights reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-[#A0ABBC]">
            <a 
              href="https://linkedin.com/company/insytcorporate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight size={12} />
            </a>
            <a 
              href="https://facebook.com/insytcorporate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Facebook</span>
              <ArrowUpRight size={12} />
            </a>
            <a 
              href="https://youtube.com/@insytcorporate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>YouTube</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
