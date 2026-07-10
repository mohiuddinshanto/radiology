"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TaskStatus, Priority, BackendTask, TaskFormData } from "@/types";
import { ALL_TAGS } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DatePicker } from "@/components/ui/DatePicker";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
  task?: BackendTask | null;
  defaultStatus?: TaskStatus;
  /**
   * নতুন task তৈরির সময় dueDate ফিল্ড pre-fill করার জন্য (সাধারণত
   * TasksBoard-এর selectedDate)। edit mode-এ এটা ব্যবহার হয় না —
   * তখন task.due_date-ই ব্যবহৃত হয়। এই prop-টাই একমাত্র জায়গা যেখানে
   * modal "date context" পায়, তাই DateSelector <-> TaskModal coupling
   * তৈরি হয় না।
   */
  defaultDueDate?: string;
}

export function TaskModal({
  open,
  onClose,
  onSave,
  task,
  defaultStatus,
  defaultDueDate,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [assignee, setAssignee] = useState("");

  // Modal open হওয়ার মুহূর্তেই ফর্ম রিসেট করা হয় (edit হলে টাস্কের ডেটা দিয়ে,
  // নতুন তৈরি হলে defaultStatus/defaultDueDate দিয়ে)। এটা effect-এর বদলে
  // render-time-এ করা হচ্ছে, যাতে extra render pass বা cascading effect
  // তৈরি না হয়।
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (task) {
        setTitle(task.title ?? "");
        setDesc(task.description ?? "");
        setStatus(task.status ?? defaultStatus ?? "todo");
        setPriority(task.priority ?? "medium");
        setDueDate(task.due_date ?? "");
        setTags(task.tags ?? []);
        setAssignee(task.assignee ?? "");
      } else {
        setTitle("");
        setDesc("");
        setStatus(defaultStatus ?? "todo");
        setPriority("medium");
        setDueDate(defaultDueDate ?? "");
        setTags([]);
        setAssignee("");
      }
    }
  }

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    onSave({
      title: title.trim(),
      description: desc,
      status,
      priority,
      due_date: dueDate,
      tags,
      assignee,
    });
  };

  const selectClass =
    "h-10 rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all w-full";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Edit Task" : "Create Task"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{task ? "Save Changes" : "Create Task"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0F172A]">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add more context…"
            rows={3}
            className="w-full rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0F172A]">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectClass}>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0F172A]">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0F172A]">Due Date</label>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>
          <Input
            label="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="e.g. Sarah K."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#0F172A]">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                  tags.includes(t)
                    ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                    : "bg-white text-[#64748B] border-[rgba(15,23,42,0.1)] hover:border-[#7C3AED] hover:text-[#7C3AED]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}