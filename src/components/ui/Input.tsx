import { type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#0F172A]">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            {icon}
          </span>
        )}
        <input
          className={cn(
            "w-full h-10 rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 text-sm",
            "text-[#0F172A] placeholder:text-[#94A3B8]",
            "focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all",
            icon && "pl-9",
            error && "border-red-400 focus:ring-red-200",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
