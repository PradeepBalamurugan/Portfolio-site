"use client";

import { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import type { DateString } from "@/lib/gym-tracker/types";

// ---------------------------------------------------------------------------
// Calendar — Monthly calendar grid with workout-dot indicators
// ---------------------------------------------------------------------------

interface CalendarProps {
  userId: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  workoutDates: string[];
  currentYear: number;
  currentMonth: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onGoToToday: () => void;
  monthName: string;
  daysInMonth: number;
  firstDayOfMonth: number; // 0=Sun … 6=Sat
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar({
  selectedDate,
  onSelectDate,
  workoutDates,
  currentYear,
  currentMonth,
  onNextMonth,
  onPrevMonth,
  onGoToToday,
  monthName,
  daysInMonth,
  firstDayOfMonth,
}: CalendarProps) {
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Helper: pad day/month to ISO date string
  const toDateString = useCallback(
    (day: number): DateString => {
      const m = String(currentMonth + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      return `${currentYear}-${m}-${d}`;
    },
    [currentYear, currentMonth]
  );

  const isToday = useCallback(
    (date: DateString) => date === todayStr,
    [todayStr]
  );
  const isFutureDate = useCallback(
    (date: DateString) => date > todayStr,
    [todayStr]
  );
  const isSelectedDate = useCallback(
    (date: DateString) => date === selectedDate,
    [selectedDate]
  );
  const hasWorkout = useCallback(
    (date: DateString) => workoutDates.includes(date),
    [workoutDates]
  );

  // Offset for Monday-start grid: convert Sun=0 → 6, Mon=1 → 0 …
  const startOffset = useMemo(
    () => (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1),
    [firstDayOfMonth]
  );

  // Build flat array of day cells (null = empty leading cell)
  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [startOffset, daysInMonth]);

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-5">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthName} {currentYear}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onGoToToday}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Today
          </button>
          <button
            onClick={onNextMonth}
            aria-label="Next month"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Day labels ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Day grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = toDateString(day);
          const today = isToday(dateStr);
          const future = isFutureDate(dateStr);
          const selected = isSelectedDate(dateStr);
          const workout = hasWorkout(dateStr);

          return (
            <button
              key={dateStr}
              disabled={future}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative flex flex-col items-center justify-center aspect-square rounded-xl text-sm font-medium transition-all duration-200
                ${future ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600" : "cursor-pointer"}
                ${selected ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : ""}
                ${!selected && today ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950 text-blue-600 dark:text-blue-400 font-bold" : ""}
                ${!selected && !today && !future ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5" : ""}
              `}
            >
              <span>{day}</span>
              {workout && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                    selected ? "bg-white" : "bg-emerald-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
