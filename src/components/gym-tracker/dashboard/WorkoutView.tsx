"use client";

import { useMemo } from "react";
import { Pencil, Dumbbell, ListChecks, FileText } from "lucide-react";
import type { Workout } from "@/lib/gym-tracker/types";
import { getCategoryById } from "@/lib/gym-tracker/services/category.service";
import { getExerciseById } from "@/lib/gym-tracker/services/exercise.service";
import { getMetricById } from "@/lib/gym-tracker/services/metric.service";

// ---------------------------------------------------------------------------
// WorkoutView — Read-only summary view for a workout
// ---------------------------------------------------------------------------

interface WorkoutViewProps {
  workout: Workout;
  onEdit: () => void;
}

// Subtle category badge colors for visual distinction
const BADGE_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
];

export default function WorkoutView({ workout, onEdit }: WorkoutViewProps) {
  // Resolve category names once
  const resolvedCategories = useMemo(
    () =>
      workout.categories.map((entry, idx) => {
        const cat = getCategoryById(entry.categoryId);
        return {
          ...entry,
          name: cat?.name ?? "Unknown",
          colorClass: BADGE_COLORS[idx % BADGE_COLORS.length],
        };
      }),
    [workout]
  );

  const formattedDate = useMemo(() => {
    const d = new Date(workout.date + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [workout.date]);

  const totalExercises = useMemo(
    () =>
      workout.categories.reduce(
        (sum, c) => sum + c.exercises.length,
        0
      ),
    [workout]
  );

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Workout Summary
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formattedDate}
          </p>
        </div>

        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 px-4 py-2 transition-all duration-200"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      {/* ── Category badges ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {resolvedCategories.map((cat) => (
          <span
            key={cat.categoryId}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cat.colorClass}`}
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* ── Exercises grouped by category ────────────────────────── */}
      {totalExercises === 0 ? (
        <div className="py-10 text-center">
          <Dumbbell className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No exercises recorded
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {resolvedCategories
            .filter((cat) => cat.exercises.length > 0)
            .map((cat) => (
              <div key={cat.categoryId}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      cat.colorClass.split(" ")[0]
                    }`}
                  />
                  {cat.name}
                </h3>

                <div className="space-y-2">
                  {cat.exercises.map((entry) => {
                    const exercise = getExerciseById(entry.exerciseId);
                    return (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01] p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {exercise?.name ?? "Unknown Exercise"}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {entry.sets.length}{" "}
                            {entry.sets.length === 1 ? "set" : "sets"}
                          </span>
                        </div>

                        {entry.notes && (
                          <div className="flex items-start gap-1.5 mb-2 text-xs text-gray-500 dark:text-gray-400">
                            <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                            <span>{entry.notes}</span>
                          </div>
                        )}

                        {/* Sets table */}
                        {entry.sets.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.sets.map((set) => (
                              <div
                                key={set.setNumber}
                                className="flex items-center gap-3 text-xs"
                              >
                                <span className="w-6 text-center font-medium text-gray-400 dark:text-gray-500">
                                  #{set.setNumber}
                                </span>
                                <div className="flex flex-wrap gap-3">
                                  {set.metricValues.map((mv) => {
                                    const metric = getMetricById(
                                      mv.metricId
                                    );
                                    return (
                                      <span
                                        key={mv.metricId}
                                        className="text-gray-700 dark:text-gray-300"
                                      >
                                        <span className="font-medium">
                                          {mv.value}
                                        </span>{" "}
                                        <span className="text-gray-400 dark:text-gray-500">
                                          {metric?.unit ?? ""}
                                        </span>
                                      </span>
                                    );
                                  })}
                                  {set.metricValues.length === 0 && (
                                    <span className="text-gray-400 dark:text-gray-500 italic">
                                      No data
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
