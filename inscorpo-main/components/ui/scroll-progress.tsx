"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * #28 — Scroll-progress reading indicator.
 * Shows a thin branded progress bar at the top of the viewport.
 * Useful for long lesson/content pages.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) { setProgress(0); return; }
      setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px] transition-[width] duration-100 ease-linear"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #2563EB, #0891B2)",
        boxShadow: "0 0 8px rgba(37,99,235,0.5)",
      }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
    />
  );
}
