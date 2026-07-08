"use client";

import { useState } from "react";
import { toast } from "react-hot-toast/headless";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#0F172A]">{label}</p>
        <p className="text-xs text-[#64748B]">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-10 h-6 rounded-full relative transition-colors ${value ? "bg-[#7C3AED]" : "bg-[#E2E8F0]"}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-transform ${value ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export function SettingsContent() {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@404project.io");
  const [notifs, setNotifs] = useState({ email: true, push: true, mentions: false });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Settings</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
            <h3 className="text-sm font-semibold text-[#0F172A]">Profile</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={name} size="lg" />
              <div>
                <button className="text-xs text-[#7C3AED] hover:underline font-medium">Change avatar</button>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Role" defaultValue="Software Engineer" />
              <Input label="Department" defaultValue="Engineering" />
            </div>
            <Button size="sm" onClick={() => toast.success("Profile updated!")}>Save changes</Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
            <h3 className="text-sm font-semibold text-[#0F172A]">Notifications</h3>
          </div>
          <div className="p-5 space-y-5">
            <Toggle label="Email notifications" desc="Receive project updates via email" value={notifs.email} onChange={() => setNotifs((n) => ({ ...n, email: !n.email }))} />
            <Toggle label="Push notifications" desc="Browser push notifications" value={notifs.push} onChange={() => setNotifs((n) => ({ ...n, push: !n.push }))} />
            <Toggle label="Mentions only" desc="Only notify when @mentioned" value={notifs.mentions} onChange={() => setNotifs((n) => ({ ...n, mentions: !n.mentions }))} />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-[rgba(15,23,42,0.06)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
            <h3 className="text-sm font-semibold text-[#0F172A]">Security</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Password</p>
                <p className="text-xs text-[#64748B]">Last changed 30 days ago</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Password reset email sent!")}>
                Change password
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Two-factor auth</p>
                <p className="text-xs text-[#64748B]">Add an extra layer of security</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("2FA setup coming soon!")}>
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-red-100">
            <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Delete account</p>
              <p className="text-xs text-[#64748B]">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => toast.error("Contact support to delete your account")}>
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
