"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className={cn(
          "relative z-10 w-full bg-white rounded-2xl shadow-2xl overflow-hidden",
          SIZES[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-semibold text-[#0F172A]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 bg-[#F8FAFC] border-t border-[rgba(15,23,42,0.06)]">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
