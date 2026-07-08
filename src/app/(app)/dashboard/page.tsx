import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — 404 Project Not Found",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
