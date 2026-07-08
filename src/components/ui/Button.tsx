import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-sm",
    secondary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm",
    ghost: "bg-transparent text-[#0F172A] hover:bg-[#F1F5F9]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm",
    outline:
      "bg-white text-[#0F172A] border border-[rgba(15,23,42,0.12)] hover:bg-[#F8FAFC] shadow-sm",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-xl",
    md: "h-9 px-4 text-sm rounded-xl",
    lg: "h-11 px-6 text-sm rounded-2xl",
    icon: "h-8 w-8 rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150",
        "cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
