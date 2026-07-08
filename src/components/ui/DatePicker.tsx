"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? parseISO(value) : new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { allDays, startPadding } = useMemo(() => {
    const start = startOfMonth(viewDate);
    return {
      allDays: eachDayOfInterval({ start, end: endOfMonth(viewDate) }),
      startPadding: getDay(start),
    };
  }, [viewDate]);

  const selected = value ? parseISO(value) : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 px-3 rounded-xl border border-[rgba(15,23,42,0.1)] bg-white text-sm w-full hover:border-[#7C3AED] transition-all"
      >
        <Calendar size={13} className="text-[#94A3B8] shrink-0" />
        <span className={selected ? "text-[#0F172A]" : "text-[#94A3B8]"}>
          {selected ? format(selected, "MMM d, yyyy") : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-68 bg-white rounded-2xl shadow-2xl border border-[rgba(15,23,42,0.08)] p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewDate((d) => subMonths(d, 1))}
              className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-[#0F172A]">
              {format(viewDate, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setViewDate((d) => addMonths(d, 1))}
              className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-[#94A3B8] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {allDays.map((day) => {
              const isSel = selected ? isSameDay(day, selected) : false;
              const isTod = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(format(day, "yyyy-MM-dd"));
                    setOpen(false);
                  }}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs mx-auto flex items-center justify-center transition-all",
                    isSel && "bg-[#7C3AED] text-white font-semibold",
                    !isSel && isTod && "border border-[#7C3AED] text-[#7C3AED] font-semibold",
                    !isSel && !isTod && "text-[#0F172A] hover:bg-[#F1F5F9]"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
