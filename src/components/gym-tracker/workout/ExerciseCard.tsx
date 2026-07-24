"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Plus,
  Minus,
  MoreVertical,
  StickyNote,
  GripVertical,
} from "lucide-react";
import type {
  Workout,
  WorkoutExerciseEntry,
  MetricValue,
  ID,
} from "@/lib/gym-tracker/types";
import { getExerciseById } from "@/lib/gym-tracker/services/exercise.service";
import { getMetricsByIds } from "@/lib/gym-tracker/services/metric.service";
import {
  addSet,
  removeSet,
  updateSetMetricValues,
  duplicateExercise,
  updateExerciseNotes,
} from "@/lib/gym-tracker/services/workout.service";
import ConfirmDialog from "@/components/gym-tracker/shared/ConfirmDialog";
import DynamicMetricInputs from "./DynamicMetricInputs";

// ---------------------------------------------------------------------------
// ExerciseCard — A single exercise within the workout builder
// ---------------------------------------------------------------------------

interface ExerciseCardProps {
  workoutId: string;
  exerciseEntry: WorkoutExerciseEntry;
  userId: string;
  currentDate: string;
  onUpdate: (workout: Workout) => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  workoutId,
  exerciseEntry,
  userId,
  currentDate,
  onUpdate,
  onDelete,
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotes, setShowNotes] = useState(!!exerciseEntry.notes);
  const [notes, setNotes] = useState(exerciseEntry.notes ?? "");
  const actionsRef = useRef<HTMLDivElement>(null);

  // ── Exercise data ────────────────────────────────────────────────────────
  const exercise = useMemo(
    () => getExerciseById(exerciseEntry.exerciseId),
    [exerciseEntry.exerciseId]
  );
  const metrics = useMemo(
    () => (exercise ? getMetricsByIds(exercise.metricIds) : []),
    [exercise]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddSet = useCallback(() => {
    const updated = addSet(workoutId, exerciseEntry.id);
    onUpdate(updated);
  }, [workoutId, exerciseEntry.id, onUpdate]);

  const handleRemoveSet = useCallback(
    (setNumber: number) => {
      const updated = removeSet(workoutId, exerciseEntry.id, setNumber);
      onUpdate(updated);
    },
    [workoutId, exerciseEntry.id, onUpdate]
  );

  const handleMetricChange = useCallback(
    (setNumber: number, values: MetricValue[]) => {
      const updated = updateSetMetricValues(
        workoutId,
        exerciseEntry.id,
        setNumber,
        values
      );
      onUpdate(updated);
    },
    [workoutId, exerciseEntry.id, onUpdate]
  );

  const handleDuplicate = useCallback(() => {
    const updated = duplicateExercise(workoutId, exerciseEntry.id);
    onUpdate(updated);
    setShowActions(false);
  }, [workoutId, exerciseEntry.id, onUpdate]);

  // Debounced notes save — local state + flush on blur or after 800ms
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushNotes = useCallback(
    (value: string) => {
      const updated = updateExerciseNotes(workoutId, exerciseEntry.id, value);
      onUpdate(updated);
    },
    [workoutId, exerciseEntry.id, onUpdate]
  );

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = setTimeout(() => flushNotes(value), 800);
    },
    [flushNotes]
  );

  const handleNotesBlur = useCallback(() => {
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    flushNotes(notes);
  }, [flushNotes, notes]);

  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    };
  }, []);

  // Close actions dropdown on outside click
  const handleActionsBlur = useCallback(() => {
    setTimeout(() => setShowActions(false), 150);
  }, []);

  if (!exercise) {
    return (
      <div className="rounded-xl border border-red-200/60 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
        Exercise not found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-gray-300/60 dark:hover:border-white/10">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-200" />
            )}
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {exercise.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {exerciseEntry.sets.length} {exerciseEntry.sets.length === 1 ? "set" : "sets"}
            </span>
          </button>

          {/* Actions dropdown */}
          <div className="relative" ref={actionsRef} onBlur={handleActionsBlur}>
            <button
              type="button"
              onClick={() => setShowActions(!showActions)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-150"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-[#1a1a25] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotes(!showNotes);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  {showNotes ? "Hide Notes" : "Add Notes"}
                </button>
                <hr className="my-1 border-gray-200/60 dark:border-white/5" />
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Body (expandable) ───────────────────────────────────────────── */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 pb-4 space-y-3">
            {/* Set header */}
            {exerciseEntry.sets.length > 0 && (
              <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <span className="w-8 text-center">Set</span>
                <div className="flex-1 flex flex-wrap gap-3">
                  {metrics.map((m) => (
                    <span
                      key={m.id}
                      className="flex-1 min-w-[80px] max-w-[140px]"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
                <span className="w-8" />
              </div>
            )}

            {/* Sets */}
            {exerciseEntry.sets.map((set) => (
              <div
                key={set.setNumber}
                className="flex items-start gap-3 group"
              >
                {/* Set number */}
                <div className="w-8 h-9 flex items-center justify-center rounded-lg bg-gray-100/60 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {set.setNumber}
                </div>

                {/* Metric inputs */}
                <div className="flex-1">
                  <DynamicMetricInputs
                    metricIds={exercise.metricIds}
                    setNumber={set.setNumber}
                    values={set.metricValues}
                    onChange={(values) =>
                      handleMetricChange(set.setNumber, values)
                    }
                    userId={userId}
                    exerciseId={exercise.id}
                    currentDate={currentDate}
                  />
                </div>

                {/* Remove set */}
                <button
                  type="button"
                  onClick={() => handleRemoveSet(set.setNumber)}
                  className="w-8 h-9 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                  title="Remove set"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Add Set button */}
            <button
              type="button"
              onClick={handleAddSet}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-300/50 dark:border-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Set
            </button>

            {/* Notes */}
            {showNotes && (
              <div className="pt-1">
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder="Add notes for this exercise..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-all duration-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDelete}
        title="Delete Exercise"
        description={`Remove "${exercise.name}" and all its sets from this workout?`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
