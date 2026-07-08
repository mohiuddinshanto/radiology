/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // 🔴 সমাধান ১: একটি "mounted" স্টেট যোগ করুন
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true); // ক্লায়েন্টে রেন্ডার হওয়ার পর এটি true হবে
  }, []);

  useEffect(() => {
    // শুধুমাত্র ক্লায়েন্টে রেন্ডার হওয়ার পর অথেন্টিকেশন চেক করুন
    if (mounted && !isLoggedIn) {
      router.push("/login");
    }
  }, [mounted, isLoggedIn, router]);

  // 🔴 সমাধান ২: মাউন্ট না হওয়া পর্যন্ত কিছুই রেন্ডার করবেন না বা লোডিং দেখান
  if (!mounted) return null; 
  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* বাকি কোড আগের মতোই থাকবে... */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setMobileOpen((o) => !o)} />
        <main className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="h-full"
            >
              {children}
              <Toaster />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}