import { create } from "zustand";
import { format } from "date-fns";
import type { BackendTask, TaskFormData } from "@/types";
import { apiFetch } from "@/lib/api";

interface TaskStore {
  selectedDate: string;
  tasks: BackendTask[];
  loading: boolean;
  setSelectedDate: (date: string) => void;
  fetchTasksByDate: (date: string) => Promise<void>;
  addTaskBackend: (task: TaskFormData) => Promise<void>;
  updateTaskStatusBackend: (id: number, status: string) => Promise<void>;
  updateTaskBackend: (id: number, task: Partial<TaskFormData>) => Promise<void>;
  deleteTaskBackend: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  tasks: [],
  loading: false,

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchTasksByDate(date);
  },

  fetchTasksByDate: async (date) => {
    set({ loading: true });
    try {
      const data = await apiFetch<BackendTask[]>(`/api/tasks/?date=${date}`);
      set({ tasks: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ loading: false });
    }
  },

  addTaskBackend: async (task) => {
    try {
      const newTask = await apiFetch<BackendTask>(`/api/tasks/`, {
        method: "POST",
        body: JSON.stringify(task),
      });
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  },

  updateTaskStatusBackend: async (id, status) => {
    try {
      const updatedTask = await apiFetch<BackendTask>(`/api/tasks/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
    } catch (error) {
      console.error("Failed to update task status:", error);
      throw error;
    }
  },

  updateTaskBackend: async (id, taskData) => {
    try {
      const updatedTask = await apiFetch<BackendTask>(`/api/tasks/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(taskData),
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  },

  deleteTaskBackend: async (id) => {
    try {
      await apiFetch<void>(`/api/tasks/${id}/`, { method: "DELETE" });
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  },
}));