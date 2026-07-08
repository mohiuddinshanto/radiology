"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast/headless";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);
    try {
      await register(username, email, password);
      toast.success("Account created!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-[rgba(15,23,42,0.08)] border border-[rgba(15,23,42,0.06)] p-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1 tracking-tight">Create account</h1>
        <p className="text-sm text-[#64748B] mb-7">Get started with your workspace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
            {!loading && "Create account"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[rgba(15,23,42,0.06)] text-center">
          <p className="text-sm text-[#64748B]">
            Already have an account?{" "}
            <a href="/login" className="text-[#7C3AED] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}