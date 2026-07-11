"use client";

import { DatePicker } from "@/components/ui/DatePicker";

interface DateSelectorProps {
  selectedDate: string;
  onChange: (date: string) => void;
  loading: boolean;
  taskCount: number;
}

/**
 * ডেট পিকার লজিক — সিলেক্টেড ডেটের উপর ভিত্তি করে টাস্ক ফিল্টার করার এবং
 * লোডিং/টাস্ক-কাউন্ট স্ট্যাটাস দেখানোর জন্য দায়ী।
 */
export function DateSelector({ selectedDate, onChange, loading, taskCount }: DateSelectorProps) {
  return (
    <>
      <div className="w-44 shrink-0">
        <DatePicker value={selectedDate} onChange={onChange} placeholder="Filter by date" />
      </div>

      <p className="text-xs text-[#64748B]">
        {loading
          ? "Loading..."
          : selectedDate
          ? `${taskCount} tasks for this day`
          : `${taskCount} tasks in total`}
      </p>
    </>
  );
}