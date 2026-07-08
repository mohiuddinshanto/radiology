"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  CheckSquare,
  Crosshair,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast/headless";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/annotate", label: "Annotate", icon: Crosshair },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 228 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="h-full bg-white border-r border-[rgba(15,23,42,0.08)] flex flex-col shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-[rgba(15,23,42,0.06)] gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center shrink-0 shadow-sm">
          <AlertCircle size={14} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-[13px] font-bold text-[#0F172A] truncate">
            404 Project
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all",
                isActive
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-[rgba(15,23,42,0.06)]">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#0F172A] truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#94A3B8] hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
