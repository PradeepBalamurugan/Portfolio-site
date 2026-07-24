"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { History, ChevronRight, Dumbbell, Loader2 } from "lucide-react";
import { getRecentWorkouts } from "@/lib/gym-tracker/services/workout.service";
import { getCategoryById } from "@/lib/gym-tracker/services/category.service";
import type { Workout } from "@/lib/gym-tracker/types";

// ---------------------------------------------------------------------------
// RecentWorkouts — Compact list of the user's most recent workouts
// ---------------------------------------------------------------------------

interface RecentWorkoutsProps {
  userId: string;
  onSelectDate: (date: string) => void;
}

// Badge palette for category pills
const PILL_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
];

function formatWorkoutDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");

  const diffMs = today.getTime() - target.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return target.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function RecentWorkouts({
  userId,
  onSelectDate,
}: RecentWorkoutsProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const recent = getRecentWorkouts(userId, 7);
    setWorkouts(recent);
    setIsLoading(false);
  }, [userId]);

  // Resolve category names for each workout
  const enrichedWorkouts = useMemo(
    () =>
      workouts.map((w) => ({
        ...w,
        categoryNames: w.categories
          .map((c) => getCategoryById(c.categoryId)?.name ?? "Unknown")
          .slice(0, 4), // cap for UI
        exerciseCount: w.categories.reduce(
          (sum, c) => sum + c.exercises.length,
          0
        ),
      })),
    [workouts]
  );

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-5">
        <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Workouts
        </h2>
      </div>

      {/* ── Loading state ────────────────────────────────────────── */}
      {isLoading && (
        <div className="py-10 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────── */}
      {!isLoading && enrichedWorkouts.length === 0 && (
        <div className="py-10 text-center">
          <Dumbbell className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No workouts yet. Start your first one!
          </p>
        </div>
      )}

      {/* ── Workout list ─────────────────────────────────────────── */}
      {!isLoading && enrichedWorkouts.length > 0 && (
        <div className="space-y-2">
          {enrichedWorkouts.map((w) => (
            <button
              key={w.id}
              onClick={() => onSelectDate(w.date)}
              className="w-full group flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01] hover:border-gray-300/60 dark:hover:border-white/10 hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-all duration-200 text-left"
            >
              {/* Date */}
              <div className="shrink-0 w-24">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatWorkoutDate(w.date)}
                </span>
              </div>

              {/* Category pills + exercise count */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  {w.categoryNames.map((name, i) => (
                    <span
                      key={`${w.id}-${name}-${i}`}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        PILL_COLORS[i % PILL_COLORS.length]
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                  {w.categories.length > 4 && (
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 self-center">
                      +{w.categories.length - 4}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {w.exerciseCount}{" "}
                  {w.exerciseCount === 1 ? "exercise" : "exercises"}
                </p>
              </div>

              {/* Chevron */}
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
