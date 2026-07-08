
import { SettingsContent } from "@/components/settings/SettingsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — 404 Project Not Found",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
