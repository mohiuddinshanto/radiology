import { cn } from "@/lib/utils";

const COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const SIZES = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const safeName = name?.trim() || "?";

  const initials = safeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color = COLORS[safeName.charCodeAt(0) % COLORS.length];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white shrink-0",
        color,
        SIZES[size],
        className
      )}
    >
      {initials}
    </div>
  );
}