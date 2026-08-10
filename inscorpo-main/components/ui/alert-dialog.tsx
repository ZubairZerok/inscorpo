"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, Zap, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "error" | "warning" | "info" | "success" | "xp";
  requiredXP?: number;
  currentXP?: number;
  actionText?: string;
  onAction?: () => void;
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  requiredXP,
  currentXP,
  actionText = "Understand",
  onAction,
}: AlertDialogProps) {
  if (!isOpen) return null;

  const isXPType = type === "xp" || message.toLowerCase().includes("xp");

  // Type styling configurations
  const config = {
    xp: {
      icon: Zap,
      iconColor: "text-amber-500 fill-amber-500/20",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      accentBorder: "border-amber-500/40",
      defaultTitle: "Insufficient XP Balance",
      buttonBg: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25",
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      accentBorder: "border-rose-500/40",
      defaultTitle: "Action Failed",
      buttonBg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-400/10 border-amber-400/20",
      accentBorder: "border-amber-400/40",
      defaultTitle: "Attention Required",
      buttonBg: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
    },
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      accentBorder: "border-emerald-500/40",
      defaultTitle: "Operation Successful",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
    },
    info: {
      icon: Info,
      iconColor: "text-corp-accent",
      iconBg: "bg-corp-accent/10 border-corp-accent/20",
      accentBorder: "border-corp-accent/40",
      defaultTitle: "System Notification",
      buttonBg: "bg-corp-accent hover:bg-corp-accent-hover text-white shadow-corp-accent/20",
    },
  };

  const activeConfig = isXPType ? config.xp : config[type] || config.info;
  const IconComponent = activeConfig.icon;
  const displayTitle = title || activeConfig.defaultTitle;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={cn(
            "max-w-md w-full rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative border overflow-hidden",
            activeConfig.accentBorder
          )}
          style={{ background: "var(--corp-surface)", borderColor: "var(--corp-border)" }}
          onClick={(e) => e.stopPropagation()}
        >


          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-corp-bg-secondary transition-colors"
            style={{ color: "var(--corp-text-tertiary)" }}
            aria-label="Close dialogue"
          >
            <X size={18} />
          </button>

          {/* Header & Icon */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-inner",
                activeConfig.iconBg
              )}
            >
              <IconComponent className={cn("w-6 h-6", activeConfig.iconColor)} />
            </div>

            <div className="space-y-1 pt-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-corp-text-tertiary">
                System Alert Dialogue
              </span>
              <h3 className="text-lg font-extrabold leading-tight" style={{ color: "var(--corp-text)" }}>
                {displayTitle}
              </h3>
            </div>
          </div>

          {/* Main message text */}
          <div className="p-4 rounded-2xl bg-corp-bg-secondary/60 border text-xs leading-relaxed space-y-3" style={{ borderColor: "var(--corp-border)" }}>
            <p className="font-medium" style={{ color: "var(--corp-text-secondary)" }}>
              {message}
            </p>

            {/* XP progress comparison bar if XP data is available */}
            {isXPType && requiredXP !== undefined && currentXP !== undefined && (
              <div className="pt-2 space-y-2 border-t" style={{ borderColor: "var(--corp-border)" }}>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-corp-text-tertiary">Your Current Balance:</span>
                  <span className="font-bold text-amber-500">{currentXP.toLocaleString()} XP</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-corp-text-tertiary">Required XP Cost:</span>
                  <span className="font-bold text-corp-text">{requiredXP.toLocaleString()} XP</span>
                </div>

                <div className="w-full h-2 rounded-full bg-corp-surface overflow-hidden p-0.5 border" style={{ borderColor: "var(--corp-border)" }}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${Math.min(100, Math.max(5, (currentXP / requiredXP) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-corp-bg-secondary hover:bg-corp-surface border transition-colors"
              style={{ color: "var(--corp-text-secondary)", borderColor: "var(--corp-border)" }}
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95",
                activeConfig.buttonBg
              )}
            >
              <span>{actionText}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
