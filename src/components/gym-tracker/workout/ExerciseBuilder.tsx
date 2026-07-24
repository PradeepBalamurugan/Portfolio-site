"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  X,
  Edit3,
  Trash2,
  Dumbbell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type {
  Workout,
  WorkoutCategoryEntry,
  Exercise,
  ID,
} from "@/lib/gym-tracker/types";
import {
  getCategoryById,
  getCategoriesByIds,
} from "@/lib/gym-tracker/services/category.service";
import { getExerciseById } from "@/lib/gym-tracker/services/exercise.service";
import {
  updateWorkoutCategories,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  deleteWorkout,
} from "@/lib/gym-tracker/services/workout.service";
import ConfirmDialog from "@/components/gym-tracker/shared/ConfirmDialog";
import StepIndicator from "@/components/gym-tracker/shared/StepIndicator";
import ExerciseCard from "./ExerciseCard";
import ExerciseSearch from "./ExerciseSearch";
import CreateExerciseModal from "./CreateExerciseModal";

// ---------------------------------------------------------------------------
// ExerciseBuilder — Step 2: build the workout with exercises
// ---------------------------------------------------------------------------

interface ExerciseBuilderProps {
  workout: Workout;
  userId: string;
  selectedDate?: string;
  onUpdateWorkout?: (workout: Workout) => void;
  onEditCategories?: () => void;
  onDeleteWorkout?: () => void;
  onWorkoutChange?: () => void;
}

export default function ExerciseBuilder({
  workout: initialWorkout,
  userId,
  selectedDate,
  onUpdateWorkout,
  onEditCategories,
  onDeleteWorkout,
  onWorkoutChange,
}: ExerciseBuilderProps) {
  const [workout, setWorkout] = useState<Workout>(initialWorkout);

  // ── UI state ────────────────────────────────────────────────────────────
  const [searchingCategoryId, setSearchingCategoryId] = useState<string | null>(null);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [createExerciseCategoryId, setCreateExerciseCategoryId] = useState<string>("");
  const [showDeleteWorkout, setShowDeleteWorkout] = useState(false);
  const [removeCategoryId, setRemoveCategoryId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Sync workout when prop changes
  useMemo(() => {
    setWorkout(initialWorkout);
  }, [initialWorkout]);

  // ── Derived data ────────────────────────────────────────────────────────
  const categoryIds = useMemo(
    () => workout.categories.map((c) => c.categoryId),
    [workout.categories]
  );

  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const id of categoryIds) {
      const cat = getCategoryById(id);
      if (cat) map.set(id, cat.name);
    }
    return map;
  }, [categoryIds]);

  // Exercises that will be removed if a category is removed
  const exercisesInRemoveCategory = useMemo(() => {
    if (!removeCategoryId) return [];
    const catEntry = workout.categories.find(
      (c) => c.categoryId === removeCategoryId
    );
    if (!catEntry) return [];
    return catEntry.exercises
      .map((e) => getExerciseById(e.exerciseId))
      .filter(Boolean) as Exercise[];
  }, [removeCategoryId, workout.categories]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const propagateUpdate = useCallback(
    (updated: Workout) => {
      setWorkout(updated);
      onUpdateWorkout?.(updated);
      onWorkoutChange?.();
    },
    [onUpdateWorkout, onWorkoutChange]
  );

  const handleRemoveCategory = useCallback(
    (categoryId: string) => {
      const catEntry = workout.categories.find(
        (c) => c.categoryId === categoryId
      );
      // If category has exercises, show confirmation
      if (catEntry && catEntry.exercises.length > 0) {
        setRemoveCategoryId(categoryId);
        return;
      }
      // No exercises — remove immediately
      const newCategoryIds = categoryIds.filter((id) => id !== categoryId);
      const updated = updateWorkoutCategories(workout.id, newCategoryIds);
      propagateUpdate(updated);
    },
    [workout, categoryIds, propagateUpdate]
  );

  const confirmRemoveCategory = useCallback(() => {
    if (!removeCategoryId) return;
    const newCategoryIds = categoryIds.filter((id) => id !== removeCategoryId);
    const updated = updateWorkoutCategories(workout.id, newCategoryIds);
    propagateUpdate(updated);
    setRemoveCategoryId(null);
  }, [removeCategoryId, workout.id, categoryIds, propagateUpdate]);

  const handleAddExercise = useCallback(
    (categoryId: string, exerciseId: string) => {
      const updated = addExerciseToWorkout(workout.id, categoryId, exerciseId);
      propagateUpdate(updated);
      setSearchingCategoryId(null);
    },
    [workout.id, propagateUpdate]
  );

  const handleRemoveExercise = useCallback(
    (exerciseEntryId: string) => {
      const updated = removeExerciseFromWorkout(workout.id, exerciseEntryId);
      propagateUpdate(updated);
    },
    [workout.id, propagateUpdate]
  );

  const handleExerciseUpdate = useCallback(
    (updated: Workout) => {
      propagateUpdate(updated);
    },
    [propagateUpdate]
  );

  const handleDeleteWorkout = useCallback(() => {
    deleteWorkout(workout.id);
    onDeleteWorkout?.();
    onWorkoutChange?.();
  }, [workout.id, onDeleteWorkout, onWorkoutChange]);

  const handleExerciseCreated = useCallback(
    (exercise: Exercise) => {
      setShowCreateExercise(false);
      if (createExerciseCategoryId) {
        handleAddExercise(createExerciseCategoryId, exercise.id);
      }
    },
    [createExerciseCategoryId, handleAddExercise]
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const totalExercises = workout.categories.reduce(
    (sum, c) => sum + c.exercises.length,
    0
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={2}
          totalSteps={2}
          labels={["Categories", "Exercises"]}
        />

        {/* Category pills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Workout Categories
            </h3>
            {onEditCategories && (
              <button
                type="button"
                onClick={onEditCategories}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-700 dark:text-blue-300"
              >
                {categoryNames.get(id) ?? id}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(id)}
                  className="h-4 w-4 flex items-center justify-center rounded-full hover:bg-blue-600/20 dark:hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 transition-colors"
                  title="Remove category"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Category sections with exercises */}
        <div className="space-y-6">
          {workout.categories.map((catEntry) => {
            const catName = categoryNames.get(catEntry.categoryId) ?? "Unknown";
            const isCollapsed = collapsedCategories.has(catEntry.categoryId);

            return (
              <div key={catEntry.categoryId}>
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(catEntry.categoryId)}
                  className="flex items-center gap-2 mb-3 group"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200" />
                  )}
                  <div className="h-px w-6 bg-blue-500/40" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {catName}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    ({catEntry.exercises.length}{" "}
                    {catEntry.exercises.length === 1
                      ? "exercise"
                      : "exercises"}
                    )
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-3 ml-2 sm:ml-4">
                    {/* Exercise cards */}
                    {catEntry.exercises.length > 0 ? (
                      catEntry.exercises.map((exerciseEntry) => (
                        <ExerciseCard
                          key={exerciseEntry.id}
                          workoutId={workout.id}
                          exerciseEntry={exerciseEntry}
                          userId={userId}
                          currentDate={selectedDate ?? workout.date}
                          onUpdate={handleExerciseUpdate}
                          onDelete={() => handleRemoveExercise(exerciseEntry.id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
                        <Dumbbell className="h-5 w-5 mx-auto mb-2 opacity-40" />
                        No exercises yet
                      </div>
                    )}

                    {/* Add Exercise button */}
                    <button
                      type="button"
                      onClick={() => setSearchingCategoryId(catEntry.categoryId)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300/50 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add Exercise
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workout summary */}
        {totalExercises > 0 && (
          <div className="pt-2 border-t border-gray-200/30 dark:border-white/[0.03]">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {totalExercises} {totalExercises === 1 ? "exercise" : "exercises"}{" "}
              across {workout.categories.length}{" "}
              {workout.categories.length === 1 ? "category" : "categories"}
            </p>
          </div>
        )}

        {/* Delete Workout */}
        <div className="pt-4 border-t border-gray-200/30 dark:border-white/[0.03]">
          <button
            type="button"
            onClick={() => setShowDeleteWorkout(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Workout
          </button>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Exercise Search */}
      {searchingCategoryId && (
        <ExerciseSearch
          categoryId={searchingCategoryId}
          priorityCategoryIds={categoryIds}
          onSelect={(exerciseId) =>
            handleAddExercise(searchingCategoryId, exerciseId)
          }
          onClose={() => setSearchingCategoryId(null)}
          onCreateNew={() => {
            setCreateExerciseCategoryId(searchingCategoryId);
            setShowCreateExercise(true);
            setSearchingCategoryId(null);
          }}
        />
      )}

      {/* Create Exercise */}
      <CreateExerciseModal
        isOpen={showCreateExercise}
        onClose={() => setShowCreateExercise(false)}
        onCreated={handleExerciseCreated}
        userId={userId}
        defaultCategoryId={createExerciseCategoryId || undefined}
      />

      {/* Remove Category Confirmation */}
      <ConfirmDialog
        isOpen={removeCategoryId !== null}
        onClose={() => setRemoveCategoryId(null)}
        onConfirm={confirmRemoveCategory}
        title="Remove Category"
        description="Removing this category will also remove the following exercises from this workout:"
        details={exercisesInRemoveCategory.map((e) => e.name)}
        confirmText="Remove"
        variant="warning"
      />

      {/* Delete Workout Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteWorkout}
        onClose={() => setShowDeleteWorkout(false)}
        onConfirm={handleDeleteWorkout}
        title="Delete Workout"
        description="Are you sure you want to delete this entire workout? This action cannot be undone."
        confirmText="Delete Workout"
        variant="danger"
      />
    </>
  );
}
