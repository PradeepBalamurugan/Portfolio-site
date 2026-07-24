"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Dumbbell, CalendarDays } from "lucide-react";
import type { Workout, ID } from "@/lib/gym-tracker/types";
import { createWorkout } from "@/lib/gym-tracker/services/workout.service";
import CategorySelector from "@/components/gym-tracker/workout/CategorySelector";
import ExerciseBuilder from "@/components/gym-tracker/workout/ExerciseBuilder";

// ---------------------------------------------------------------------------
// WorkoutBuilder — Orchestrates the multi-step workout creation flow
// idle → categories → builder
// ---------------------------------------------------------------------------

interface WorkoutBuilderProps {
  userId: string;
  selectedDate: string;
  workout: Workout | null;
  onWorkoutChange: () => void;
}

type Step = "idle" | "categories" | "builder";

export default function WorkoutBuilder({
  userId,
  selectedDate,
  workout,
  onWorkoutChange,
}: WorkoutBuilderProps) {
  const [step, setStep] = useState<Step>("idle");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Pretty-print the selected date
  const formattedDate = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === yesterday.getTime()) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year:
        d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }, [selectedDate]);

  // Handle "next" from CategorySelector
  const handleCategoriesSelected = useCallback(
    (ids: ID[]) => {
      setSelectedCategoryIds(ids);
      // Create the workout immediately so ExerciseBuilder has a workout to work with
      createWorkout(userId, selectedDate, ids);
      onWorkoutChange(); // parent reloads the workout
      setStep("builder");
    },
    [userId, selectedDate, onWorkoutChange]
  );

  const handleBack = useCallback(() => {
    setStep("idle");
    setSelectedCategoryIds([]);
  }, []);

  // ── Render: existing workout or builder step ──────────────────────────
  if (workout || step === "builder") {
    return (
      <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
        <ExerciseBuilder
          userId={userId}
          selectedDate={selectedDate}
          workout={workout!}
          onWorkoutChange={onWorkoutChange}
        />
      </div>
    );
  }

  // ── Render: category selector step ────────────────────────────────────
  if (step === "categories") {
    return (
      <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6">
        <CategorySelector
          userId={userId}
          selectedCategoryIds={selectedCategoryIds}
          onNext={handleCategoriesSelected}
          onBack={handleBack}
        />
      </div>
    );
  }

  // ── Render: idle — show "Create Workout" CTA ──────────────────────────
  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center">
      {/* Date label */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <CalendarDays className="h-4 w-4" />
        <span>{formattedDate}</span>
      </div>

      {/* Icon */}
      <div className="mb-5 flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 dark:from-blue-500/20 dark:to-violet-500/20">
        <Dumbbell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No workout yet
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
        Start building your workout for{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {formattedDate}
        </span>
      </p>

      <button
        onClick={() => setStep("categories")}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-medium text-sm px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25"
      >
        <Plus className="h-4 w-4" />
        Create Workout
      </button>
    </div>
  );
}
