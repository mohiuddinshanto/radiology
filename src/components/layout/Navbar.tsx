"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Task Board",
  "/annotate": "Annotation Studio",
  "/settings": "Settings",
};

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] ?? "404 Project";

  return (
    <header className="h-14 bg-white border-b border-[rgba(15,23,42,0.08)] flex items-center px-4 gap-3 sticky top-0 z-10 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors lg:hidden"
      >
        <Menu size={16} className="text-[#64748B]" />
      </button>

      {/* Page title */}
      <h1 className="text-[13px] font-semibold text-[#0F172A] hidden sm:block shrink-0">
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xs relative hidden sm:block">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#F8FAFC] border border-[rgba(15,23,42,0.08)] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button className="relative p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors">
          <Bell size={16} className="text-[#64748B]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        </button>
        {user && (
          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F1F5F9] transition-colors">
            <Avatar name={user.name} size="sm" />
            <span className="text-xs font-medium text-[#0F172A] hidden md:block">
              {(user.name?.trim() || user.email || "User")
                .split(" ")
                .slice(0, 2)
                .map((part, i) => (i === 0 ? part : `${part[0]}.`))
                .join(" ")}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
