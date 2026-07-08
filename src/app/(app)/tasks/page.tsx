import { TasksBoard } from "@/components/tasks/TasksBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks — 404 Project Not Found",
};

export default function TasksPage() {
  return <TasksBoard />;
}
