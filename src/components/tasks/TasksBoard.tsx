"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import type { TaskStatus, Priority, BackendTask, TaskFormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/store/useTaskStore";
import { DateSelector } from "@/components/tasks/Dateselector";
import { Board } from "@/components/tasks/Board";
import { TaskModal } from "./Taskmodal";


export function TasksBoard() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BackendTask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const {
    tasks,
    selectedDate,
    loading,
    setSelectedDate,
    fetchTasksByDate,
    addTaskBackend,
    updateTaskStatusBackend,
    updateTaskBackend,
    deleteTaskBackend,
  } = useTaskStore();

  // 🔥 ডেটা ফেচ করা
  useEffect(() => {
    fetchTasksByDate(selectedDate);
  }, [selectedDate, fetchTasksByDate]);

  // 🔥 ফিল্টারিং
  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const matchSearch =
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
        const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
        return matchSearch && matchPriority;
      }),
    [tasks, search, priorityFilter]
  );

  const openAdd = useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: BackendTask) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteTaskBackend(id);
        toast.success("Task deleted successfully");
      } catch {
        toast.error("Failed to delete task");
      }
    },
    [deleteTaskBackend]
  );

  const handleSave = useCallback(
    async (data: TaskFormData) => {
      try {
        if (editingTask) {
          await updateTaskBackend(editingTask.id, data);
          toast.success("Task updated successfully!");
        } else {
          await addTaskBackend(data);
          toast.success("Task created successfully!");
        }
        setModalOpen(false);
      } catch {
        toast.error(editingTask ? "Failed to update task" : "Failed to create task");
      }
    },
    [editingTask, addTaskBackend, updateTaskBackend] // 🔥 updateTaskBackend ডিপেন্ডেন্সি যোগ করা হয়েছে
  );

  const modalKey = editingTask ? `edit-${editingTask.id}` : "create-new";

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#F8FAFC] border-b border-[rgba(15,23,42,0.06)] shrink-0">
        <DateSelector
          selectedDate={selectedDate}
          onChange={setSelectedDate}
          loading={loading}
          taskCount={filtered.length}
        />

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-44 h-8 pl-7 pr-3 rounded-xl bg-white border border-[rgba(15,23,42,0.1)] text-xs placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | "all")}
            className="h-8 px-2.5 rounded-xl bg-white border border-[rgba(15,23,42,0.1)] text-xs focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button size="sm" onClick={() => openAdd("todo")}>
            <Plus size={13} /> Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <Board
        tasks={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
        onAdd={openAdd}
        updateTaskStatusBackend={updateTaskStatusBackend}
      />

      <TaskModal
        key={modalKey}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        task={editingTask}
        defaultStatus={defaultStatus}
        defaultDueDate={selectedDate}
      />
    </div>
  );
}