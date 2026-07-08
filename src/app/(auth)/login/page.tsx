"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Eye, EyeOff, AlertCircle, CheckCircle2,
  CheckSquare, Crosshair, Activity,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast/headless";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // পরিবর্তন ১: হার্ডকোডেড ডাটা সরিয়ে খালি স্ট্রিং করা হয়েছে
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ── Left: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
            <AlertCircle size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">
            404 Project Not Found
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-[rgba(15,23,42,0.08)] border border-[rgba(15,23,42,0.06)] p-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-1 tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#64748B] mb-7">Sign in to your workspace</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#0F172A]">Password</label>
                  <button type="button" className="text-xs text-[#7C3AED] hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 pr-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <label 
                onClick={() => setRemember((r) => !r)} 
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    remember ? "bg-[#7C3AED] border-[#7C3AED]" : "border-[rgba(15,23,42,0.2)]"
                  }`}
                >
                  {remember && <CheckCircle2 size={10} className="text-white" />}
                </div>
                <span className="text-sm text-[#64748B]">Remember me for 30 days</span>
              </label>

              <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
                {!loading && "Sign in to workspace"}
              </Button>
            </form>

            {/* পরিবর্তন ২: রেজিস্টার পেজে রিডাইরেক্ট করার লিংক */}
            <div className="mt-6 pt-6 border-t border-[rgba(15,23,42,0.06)] text-center">
              <p className="text-sm text-[#64748B]">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-[#7C3AED] font-medium hover:underline">
                  Create one
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right: Illustration ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#5B21B6] to-[#2563EB] items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/8" />
        </div>

        <div className="relative z-10 text-white max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v2.4 — Now with AI annotation
          </div>
          <h2 className="text-3xl font-bold mb-4 leading-tight tracking-tight">
            Manage projects with confidence
          </h2>
          <p className="text-white/75 text-base mb-8 leading-relaxed">
            Track tasks, annotate medical images, and collaborate — all in one unified workspace.
          </p>
          <div className="space-y-3">
            {[
              { icon: CheckSquare, text: "Kanban task management" },
              { icon: Crosshair, text: "Medical image annotation" },
              { icon: Activity, text: "Real-time collaboration" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <Icon size={15} />
                </div>
                <span className="text-white/85 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}