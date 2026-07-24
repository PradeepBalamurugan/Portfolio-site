"use client";

import { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X, Plus, Dumbbell, Tag } from "lucide-react";
import type { Exercise, ID } from "@/lib/gym-tracker/types";
import {
  searchExercises,
  getExercisesByCategory,
} from "@/lib/gym-tracker/services/exercise.service";
import { getCategoryById } from "@/lib/gym-tracker/services/category.service";
import { getMuscleById } from "@/lib/gym-tracker/services/muscle.service";
import SearchInput from "@/components/gym-tracker/shared/SearchInput";

// ---------------------------------------------------------------------------
// ExerciseSearch — Search and select exercises to add to a workout
// ---------------------------------------------------------------------------

interface ExerciseSearchProps {
  categoryId: string;
  priorityCategoryIds: string[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
}

export default function ExerciseSearch({
  categoryId,
  priorityCategoryIds,
  onSelect,
  onClose,
  onCreateNew,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");

  // Current category name
  const categoryName = useMemo(() => {
    const cat = getCategoryById(categoryId);
    return cat?.name ?? "Unknown";
  }, [categoryId]);

  // Search results — prioritize exercises from selected categories
  const results = useMemo(() => {
    return searchExercises(query, priorityCategoryIds);
  }, [query, priorityCategoryIds]);

  // Group results: first from current category, then from other priority categories, then the rest
  const groupedResults = useMemo(() => {
    const fromCurrentCategory: Exercise[] = [];
    const fromOtherPriority: Exercise[] = [];
    const fromOther: Exercise[] = [];

    for (const exercise of results) {
      if (exercise.categoryId === categoryId) {
        fromCurrentCategory.push(exercise);
      } else if (priorityCategoryIds.includes(exercise.categoryId)) {
        fromOtherPriority.push(exercise);
      } else {
        fromOther.push(exercise);
      }
    }

    return { fromCurrentCategory, fromOtherPriority, fromOther };
  }, [results, categoryId, priorityCategoryIds]);

  const hasResults =
    groupedResults.fromCurrentCategory.length > 0 ||
    groupedResults.fromOtherPriority.length > 0 ||
    groupedResults.fromOther.length > 0;

  const renderExercise = (exercise: Exercise) => {
    const cat = getCategoryById(exercise.categoryId);
    const muscle = exercise.muscleId ? getMuscleById(exercise.muscleId) : null;

    return (
      <button
        key={exercise.id}
        type="button"
        onClick={() => onSelect(exercise.id)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors duration-150 text-left group"
      >
        {/* Exercise icon */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 dark:from-blue-500/15 dark:to-violet-500/15 flex items-center justify-center flex-shrink-0 group-hover:from-blue-600/20 group-hover:to-violet-600/20 transition-all duration-200">
          <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Exercise info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {exercise.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {cat && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {cat.name}
              </span>
            )}
            {muscle && (
              <>
                <span className="text-[11px] text-gray-300 dark:text-gray-600">
                  •
                </span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {muscle.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Add indicator */}
        <Plus className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
      </button>
    );
  };

  // Render via portal so we escape any parent stacking context (backdrop-blur)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center gym-modal-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg max-h-[85vh] sm:max-h-[70vh] bg-white dark:bg-[#12121a] rounded-t-2xl sm:rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-2xl flex flex-col gym-modal-content overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Add Exercise
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              to {categoryName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-200/30 dark:border-white/[0.03]">
          <SearchInput
            placeholder="Search exercises..."
            value={query}
            onChange={setQuery}
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto gym-scrollable">
          {hasResults ? (
            <>
              {/* Current category exercises */}
              {groupedResults.fromCurrentCategory.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-blue-600/5 dark:bg-blue-500/5">
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {categoryName}
                    </span>
                  </div>
                  {groupedResults.fromCurrentCategory.map(renderExercise)}
                </div>
              )}

              {/* Other priority category exercises */}
              {groupedResults.fromOtherPriority.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50/80 dark:bg-white/[0.02]">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      From selected categories
                    </span>
                  </div>
                  {groupedResults.fromOtherPriority.map(renderExercise)}
                </div>
              )}

              {/* Other exercises */}
              {groupedResults.fromOther.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50/80 dark:bg-white/[0.02]">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      All exercises
                    </span>
                  </div>
                  {groupedResults.fromOther.map(renderExercise)}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-gray-100/80 dark:bg-white/5 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                No exercises found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {query ? `for "${query}"` : "Create a new exercise to get started"}
              </p>
              <button
                type="button"
                onClick={onCreateNew}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Exercise
              </button>
            </div>
          )}
        </div>

        {/* Footer — Create new */}
        {hasResults && (
          <div className="px-4 py-3 border-t border-gray-200/60 dark:border-white/5">
            <button
              type="button"
              onClick={onCreateNew}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300/60 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Create New Exercise
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
