import { cn } from "@/lib/utils";

const BADGE_VARIANTS: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-green-50 text-green-600 border-green-100",
  default: "bg-slate-100 text-slate-600 border-slate-200",
  design: "bg-blue-50 text-blue-600 border-blue-100",
  auth: "bg-violet-50 text-violet-600 border-violet-100",
  backend: "bg-orange-50 text-orange-600 border-orange-100",
  frontend: "bg-cyan-50 text-cyan-600 border-cyan-100",
  testing: "bg-slate-100 text-slate-600 border-slate-200",
  database: "bg-indigo-50 text-indigo-600 border-indigo-100",
  devops: "bg-emerald-50 text-emerald-600 border-emerald-100",
  api: "bg-pink-50 text-pink-600 border-pink-100",
  performance: "bg-teal-50 text-teal-600 border-teal-100",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const style = BADGE_VARIANTS[variant.toLowerCase()] ?? BADGE_VARIANTS.default;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}
