"use client";

import { useState, useMemo, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import type { Exercise, ID, WorkoutCategory, Metric } from "@/lib/gym-tracker/types";
import {
  getAllCategories,
  getCategoryById,
} from "@/lib/gym-tracker/services/category.service";
import { getAllMuscles } from "@/lib/gym-tracker/services/muscle.service";
import {
  getAllMetrics,
  createMetric,
} from "@/lib/gym-tracker/services/metric.service";
import { createExercise } from "@/lib/gym-tracker/services/exercise.service";
import CreateModal from "@/components/gym-tracker/shared/CreateModal";

// ---------------------------------------------------------------------------
// CreateExerciseModal — Form to create a new exercise
// ---------------------------------------------------------------------------

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (exercise: Exercise) => void;
  userId: string;
  defaultCategoryId?: string;
}

export default function CreateExerciseModal({
  isOpen,
  onClose,
  onCreated,
  userId,
  defaultCategoryId,
}: CreateExerciseModalProps) {
  // ── Form state ──────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const [muscleId, setMuscleId] = useState("");
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState("");

  // ── Create metric inline state ──────────────────────────────────────────
  const [showCreateMetric, setShowCreateMetric] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricUnit, setNewMetricUnit] = useState("");
  const [newMetricType, setNewMetricType] = useState<"number" | "integer" | "duration">("number");
  const [metricError, setMetricError] = useState("");

  // ── Data ─────────────────────────────────────────────────────────────────
  const categories = useMemo(() => getAllCategories(), []);
  const muscles = useMemo(() => getAllMuscles(), []);
  const [metrics, setMetrics] = useState<Metric[]>(() => getAllMetrics());

  // Does the selected category require muscle selection?
  const selectedCategory = useMemo(
    () => (categoryId ? getCategoryById(categoryId) : null),
    [categoryId]
  );
  const requiresMuscle = selectedCategory?.requiresMuscle ?? false;

  // ── Validation ──────────────────────────────────────────────────────────
  const isValid =
    name.trim().length > 0 &&
    categoryId !== "" &&
    selectedMetricIds.size > 0 &&
    (!requiresMuscle || muscleId !== "");

  // ── Handlers ────────────────────────────────────────────────────────────
  const toggleMetric = useCallback((id: string) => {
    setSelectedMetricIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCreateMetric = useCallback(() => {
    setMetricError("");
    if (!newMetricName.trim()) {
      setMetricError("Name is required");
      return;
    }
    if (!newMetricUnit.trim()) {
      setMetricError("Unit is required");
      return;
    }

    const result = createMetric(newMetricName, newMetricUnit, newMetricType, userId);
    if ("error" in result) {
      setMetricError(result.error);
      return;
    }

    // Auto-select the new metric
    setSelectedMetricIds((prev) => new Set([...prev, result.id]));
    setMetrics(getAllMetrics());
    setNewMetricName("");
    setNewMetricUnit("");
    setNewMetricType("number");
    setShowCreateMetric(false);
  }, [newMetricName, newMetricUnit, newMetricType, userId]);

  const handleSubmit = useCallback(() => {
    setError("");
    const result = createExercise(
      name,
      categoryId,
      requiresMuscle ? muscleId : null,
      Array.from(selectedMetricIds),
      userId
    );

    if ("error" in result) {
      setError(result.error);
      return;
    }

    onCreated(result);
    handleReset();
  }, [name, categoryId, muscleId, requiresMuscle, selectedMetricIds, userId, onCreated]);

  const handleReset = useCallback(() => {
    setName("");
    setCategoryId(defaultCategoryId ?? "");
    setMuscleId("");
    setSelectedMetricIds(new Set());
    setError("");
    setShowCreateMetric(false);
    setMetricError("");
    onClose();
  }, [defaultCategoryId, onClose]);

  // ── Select styling ──────────────────────────────────────────────────────
  const selectClassName =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all appearance-none";
  const inputClassName =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";
  const labelClassName = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={handleReset}
      title="Create Exercise"
      onSubmit={handleSubmit}
      submitText="Create Exercise"
      isValid={isValid}
    >
      <div className="space-y-4">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50/80 dark:bg-red-500/10 border border-red-200/60 dark:border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Exercise Name */}
        <div>
          <label className={labelClassName}>Exercise Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Bench Press"
            className={inputClassName}
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelClassName}>Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setMuscleId("");
            }}
            className={selectClassName}
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Muscle (conditional) */}
        {requiresMuscle && (
          <div>
            <label className={labelClassName}>Target Muscle</label>
            <select
              value={muscleId}
              onChange={(e) => setMuscleId(e.target.value)}
              className={selectClassName}
            >
              <option value="">Select muscle...</option>
              {muscles.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Metrics (multi-select checkboxes) */}
        <div>
          <label className={labelClassName}>
            Metrics{" "}
            <span className="text-gray-400 dark:text-gray-500 font-normal">
              (select at least 1)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric) => {
              const isSelected = selectedMetricIds.has(metric.id);
              return (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-blue-600/10 border-blue-500/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      : "bg-white/5 border-gray-200/60 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-500/30"
                  }`}
                >
                  {/* Checkbox indicator */}
                  <div
                    className={`h-4 w-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "border border-gray-300 dark:border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">
                    {metric.name}{" "}
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-normal">
                      ({metric.unit})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Create Metric inline */}
          {!showCreateMetric ? (
            <button
              type="button"
              onClick={() => setShowCreateMetric(true)}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              + Create New Metric
            </button>
          ) : (
            <div className="mt-2 p-3 rounded-xl border border-blue-500/20 bg-blue-600/5 dark:bg-blue-500/5 space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                New Metric
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newMetricName}
                  onChange={(e) => setNewMetricName(e.target.value)}
                  placeholder="Name (e.g., RPE)"
                  className={`${inputClassName} text-xs`}
                />
                <input
                  type="text"
                  value={newMetricUnit}
                  onChange={(e) => setNewMetricUnit(e.target.value)}
                  placeholder="Unit (e.g., 1-10)"
                  className={`${inputClassName} text-xs`}
                />
              </div>
              <select
                value={newMetricType}
                onChange={(e) =>
                  setNewMetricType(
                    e.target.value as "number" | "integer" | "duration"
                  )
                }
                className={`${selectClassName} text-xs`}
              >
                <option value="number">Number</option>
                <option value="integer">Integer</option>
                <option value="duration">Duration</option>
              </select>
              {metricError && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {metricError}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateMetric}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs px-3 py-1.5 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateMetric(false);
                    setMetricError("");
                  }}
                  className="border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CreateModal>
  );
}
