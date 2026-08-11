import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Learning Paths", href: "#paths" },
    { label: "Mock Tests", href: "#" },
    { label: "Career Passport", href: "#" },
    { label: "AI Tools", href: "#" },
    { label: "Marketplace", href: "#" },
  ],
  Learning: [
    { label: "Banking Preparation", href: "#" },
    { label: "Corporate Strategy", href: "#" },
    { label: "IELTS", href: "#" },
    { label: "Business Analytics", href: "#" },
    { label: "AI Productivity", href: "#" },
    { label: "Corporate Skills", href: "#" },
  ],
  Company: [
    { label: "About INSYT", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Partners", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--corp-surface)", borderTop: "1px solid var(--corp-border)" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-corp-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
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
            <p className="text-[13px] leading-relaxed mb-6 max-w-xs" style={{ color: "var(--corp-text-secondary)" }}>
              The Career Operating System. Level up your professional career with structured learning, AI tools, and gamified growth.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@insyt.co" className="flex items-center gap-2 text-[13px] transition-colors hover:text-corp-accent" style={{ color: "var(--corp-text-tertiary)" }}>
                <Mail size={14} />
                hello@insyt.co
              </a>
              <span className="flex items-center gap-2 text-[13px]" style={{ color: "var(--corp-text-tertiary)" }}>
                <MapPin size={14} />
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--corp-text)" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors duration-200 hover:text-corp-accent"
                      style={{ color: "var(--corp-text-tertiary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--corp-border)" }}
        >
          <p className="text-[12px]" style={{ color: "var(--corp-text-tertiary)" }}>
            © {new Date().getFullYear()} INSYT. All rights reserved. Made with ❤️ in Bangladesh.
          </p>
          <div className="flex items-center gap-2">
            {/* LinkedIn */}
            <a href="https://linkedin.com/company/insytcorporate" target="_blank" rel="noopener noreferrer"
              aria-label="INSYT LinkedIn"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-corp-accent/10"
              style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text-tertiary)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com/insytcorporate" target="_blank" rel="noopener noreferrer"
              aria-label="INSYT Facebook"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-corp-accent/10"
              style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text-tertiary)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/insytcorporate" target="_blank" rel="noopener noreferrer"
              aria-label="INSYT Instagram"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-corp-accent/10"
              style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text-tertiary)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com/@insytcorporate" target="_blank" rel="noopener noreferrer"
              aria-label="INSYT YouTube"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-corp-accent/10"
              style={{ border: "1px solid var(--corp-border)", color: "var(--corp-text-tertiary)" }}
            >
              <svg width="16" height="12" viewBox="0 0 24 17" fill="currentColor">
                <path d="M23.5 2.5s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.8 0 12 0 12 0S7.2 0 4.7.4c-.6.1-1.9.1-3 1.3C.8 2.5.5 4.5.5 4.5S.2 6.8.2 9v2.1c0 2.2.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7 19.8 12 19.8 12 19.8s4.8 0 7.3-.4c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5V9c0-2.2-.3-4.5-.3-4.5zM9.7 13V5.8l8.1 3.6-8.1 3.6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
