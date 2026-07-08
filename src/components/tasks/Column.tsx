"use client";

import type { DragEvent } from "react";
import { AnimatePresence } from "motion/react";
import { Plus, CheckSquare } from "lucide-react";
import type { BackendTask, TaskStatus } from "@/types";
import { TaskCard } from "./Taskcard";



interface KanbanColumnDef {
  id: TaskStatus;
  label: string;
  dot: string;
}

interface ColumnProps {
  col: KanbanColumnDef;
  tasks: BackendTask[];
  onEdit: (task: BackendTask) => void;
  onDelete: (id: number) => void;
  onAdd: (status: TaskStatus) => void;
  onDragStart: (id: number) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

export function Column({ col, tasks, onEdit, onDelete, onAdd, onDragStart, onDrop }: ColumnProps) {
  return (
    <div
      className="flex flex-col w-72 h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
        <span className="text-xs font-semibold text-[#0F172A]">{col.label}</span>
        <span className="ml-auto text-[10px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Column body */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-[#F1F5F9] p-2.5 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 min-h-[120px]">
            <div className="w-10 h-10 rounded-2xl bg-[#E2E8F0] flex items-center justify-center mb-2.5">
              <CheckSquare size={18} className="text-[#CBD5E1]" />
            </div>
            <p className="text-[11px] font-medium text-[#94A3B8]">No tasks here</p>
            <p className="text-[10px] text-[#CBD5E1] mt-0.5">Drag here or create new</p>
          </div>
        )}

        <button
          onClick={() => onAdd(col.id)}
          className="flex items-center gap-2 p-2.5 rounded-xl text-[11px] text-[#94A3B8] hover:bg-white hover:text-[#64748B] transition-all border border-dashed border-[#CBD5E1] hover:border-[#7C3AED] mt-auto"
        >
          <Plus size={12} /> Add task
        </button>
      </div>
    </div>
  );
}