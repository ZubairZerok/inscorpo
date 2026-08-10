import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeColor?: "blue" | "gold" | "neutral";
  actions?: ReactNode;
  icon?: ReactNode;
}

/**
 * #87 — Unified PageHeader component for all dashboard pages.
 * Provides consistent title hierarchy, spacing, and optional badge + actions.
 */
export function PageHeader({
  title,
  description,
  badge,
  badgeColor = "blue",
  actions,
  icon,
}: PageHeaderProps) {
  const badgeStyles = {
    blue: { background: "var(--corp-accent-light)", color: "var(--corp-accent)", border: "1px solid rgba(37,99,235,0.15)" },
    gold: { background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" },
    neutral: { background: "var(--corp-bg-secondary)", color: "var(--corp-text-tertiary)", border: "1px solid var(--corp-border)" },
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="min-w-0">
        {badge && (
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2"
            style={badgeStyles[badgeColor]}
          >
            {badge}
          </span>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--corp-accent-light)" }}>
              {icon}
            </div>
          )}
          {/* #62: Single <h1> per dashboard page */}
          <h1 className="text-[22px] font-bold tracking-tight truncate" style={{ color: "var(--corp-text)" }}>
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: "var(--corp-text-secondary)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
