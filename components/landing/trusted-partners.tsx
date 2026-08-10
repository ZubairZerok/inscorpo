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
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#06091a] to-[#0A0D14] border-t border-[#161B27]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[12px] font-bold uppercase tracking-[0.2em] mb-8 text-[#626C80]"
        >
          Trusted by professionals preparing for top MNCs & Institutions
        </motion.p>

        {/* Marquee with smooth CSS alpha mask */}
        <div 
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="mx-3 flex-shrink-0 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 cursor-default bg-[#161B27]/80 border border-[#262F45] backdrop-blur-sm"
              >
                <span className="text-[13px] font-semibold whitespace-nowrap text-[#A0ABBC] hover:text-white transition-colors">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
