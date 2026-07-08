"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  FolderOpen, CheckSquare, Crosshair, Users,
  Plus, Upload, ArrowRight,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";


const STATS = [
  { label: "Active Projects", value: "12", change: "+3", icon: FolderOpen, accent: "#7C3AED", bg: "#EDE9FE" },
  { label: "Open Tasks", value: "47", change: "+8", icon: CheckSquare, accent: "#2563EB", bg: "#DBEAFE" },
  { label: "Annotations", value: "234", change: "+21", icon: Crosshair, accent: "#10B981", bg: "#DCFCE7" },
  { label: "Team Members", value: "8", change: "—", icon: Users, accent: "#F59E0B", bg: "#FEF9C3" },
];

const ACTIVITY = [
  { user: "Sarah K.", action: "completed", target: "Database schema design", time: "2h ago" },
  { user: "Alex R.", action: "annotated", target: "brain_mri_001.jpg", time: "3h ago" },
  { user: "Mike T.", action: "created task", target: "Set up CI/CD pipeline", time: "5h ago" },
  { user: "Jordan L.", action: "moved to In Progress", target: "Annotation API", time: "6h ago" },
  { user: "Chris M.", action: "uploaded", target: "chest_xray_034.jpg", time: "1d ago" },
];

export function DashboardContent() {
  const router = useRouter();

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Good morning, Alex 👋
          </h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s.bg }}
                >
                  <s.icon size={18} style={{ color: s.accent }} />
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{s.value}</div>
              <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Activity feed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
              <h3 className="text-sm font-semibold text-[#0F172A]">Recent Activity</h3>
            </div>
            <div className="divide-y divide-[rgba(15,23,42,0.04)]">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <Avatar name={a.user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#0F172A]">
                      <span className="font-semibold">{a.user}</span>{" "}
                      <span className="text-[#64748B]">{a.action}</span>{" "}
                      <span className="font-medium text-[#7C3AED]">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
              <h3 className="text-sm font-semibold text-[#0F172A]">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-2">
              {[
                { label: "Create New Task", icon: Plus, href: "/tasks", accent: "#7C3AED", bg: "#EDE9FE" },
                { label: "Upload Image", icon: Upload, href: "/annotate", accent: "#2563EB", bg: "#DBEAFE" },
                { label: "Start Annotation", icon: Crosshair, href: "/annotate", accent: "#10B981", bg: "#DCFCE7" },
              ].map(({ label, icon: Icon, href, accent, bg }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                    <Icon size={15} style={{ color: accent }} />
                  </div>
                  <span className="text-xs font-medium text-[#0F172A] flex-1 text-left">{label}</span>
                  <ArrowRight size={13} className="text-[#CBD5E1] group-hover:text-[#94A3B8] transition-colors" />
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="p-4 border-t border-[rgba(15,23,42,0.06)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-medium text-[#64748B]">Weekly completion</span>
                <span className="text-[11px] font-semibold text-[#0F172A]">68%</span>
              </div>
              <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
