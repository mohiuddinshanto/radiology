"use client";

import { useState, useCallback, type DragEvent } from "react";
import { toast } from "react-hot-toast";
import type { BackendTask, TaskStatus } from "@/types";
import { KANBAN_COLUMNS } from "@/lib/data";
import { Column } from "./Column";

interface BoardProps {
  tasks: BackendTask[];
  onEdit: (task: BackendTask) => void;
  onDelete: (id: number) => void;
  onAdd: (status: TaskStatus) => void;
  updateTaskStatusBackend: (id: number, status: TaskStatus) => Promise<void>;
}

/**
 * মূল কানবান বোর্ড — কলামগুলো রেন্ডার করে এবং ড্র্যাগ-অ্যান্ড-ড্রপের মাধ্যমে
 * টাস্কের স্ট্যাটাস পরিবর্তনের লজিক পরিচালনা করে।
 */
export function Board({ tasks, onEdit, onDelete, onAdd, updateTaskStatusBackend }: BoardProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
      e.preventDefault();
      if (draggedId === null) return;
      const col = KANBAN_COLUMNS.find((c) => c.id === status);

      try {
        await updateTaskStatusBackend(draggedId, status);
        toast.success(`Moved to ${col?.label}`);
      } catch {
        toast.error("Failed to move task");
      } finally {
        setDraggedId(null);
      }
    },
    [draggedId, updateTaskStatusBackend]
  );

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-4 h-full p-5 min-w-max">
        {KANBAN_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <Column
              key={col.id}
              col={col}
              tasks={colTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              onDragStart={(id) => setDraggedId(id)}
              onDrop={(e) => handleDrop(e, col.id)}
            />
          );
        })}
      </div>
    </div>
  );
}