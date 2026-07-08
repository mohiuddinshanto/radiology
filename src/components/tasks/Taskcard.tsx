"use client";

import { useState, type ComponentProps } from "react";
import { motion } from "motion/react";
import { Flag, Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import type { BackendTask, Priority } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: BackendTask;
  onEdit: (t: BackendTask) => void;
  onDelete: (id: number) => void;
  onDragStart: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue =
    task.due_date &&
    task.status !== "done" &&
    isPast(parseISO(task.due_date as string));
  const priorityColor = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  }[task.priority as Priority] || "text-gray-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="bg-white rounded-xl border border-[rgba(15,23,42,0.08)] p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h4 className="text-xs font-semibold text-[#0F172A] leading-snug">{task.title}</h4>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#F1F5F9] text-[#94A3B8] transition-all"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 w-28 bg-white rounded-xl border border-[rgba(15,23,42,0.08)] shadow-xl overflow-hidden">
              <button
                onClick={() => { onEdit(task); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-[#F8FAFC] text-[#0F172A]"
              >
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-red-50 text-red-500"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-[#64748B] mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((t: string) => (
            <Badge key={t} variant={t.toLowerCase() as ComponentProps<typeof Badge>["variant"]}>
              {t}
            </Badge>
          ))}
          {task.tags.length > 2 && <Badge>+{task.tags.length - 2}</Badge>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-1">
          <Flag size={11} className={priorityColor} />
          <span className={cn("text-[11px] font-medium capitalize", priorityColor)}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className={cn("flex items-center gap-1 text-[11px]", overdue ? "text-red-500" : "text-[#94A3B8]")}>
              <Calendar size={10} />
              {format(parseISO(task.due_date), "MMM d")}
            </span>
          )}
          {/* 🔧 FIX: task.assignee is optional (string | undefined) but Avatar's `name`
              prop is required. Falling back to "Unassigned" satisfies the type and
              gives a sane UI default when no one is assigned. */}
          <Avatar name={task.assignee || "Unassigned"} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}