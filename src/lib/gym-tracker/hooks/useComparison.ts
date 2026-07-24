// ---------------------------------------------------------------------------
// Gym Tracker — useComparison Hook
// Computes live metric comparisons against previous workout data.
// ---------------------------------------------------------------------------

"use client";

import { useMemo } from "react";
import {
  PreviousExerciseData,
  MetricComparison,
  ComparisonResult,
  MetricValue,
  ID,
  DateString,
} from "../types";
import * as workoutService from "../services/workout.service";

interface UseComparisonReturn {
  previousData: PreviousExerciseData | null;
  compareMetric: (metricId: ID, currentValue: number, setNumber: number) => MetricComparison | null;
  getPreviousSetValue: (metricId: ID, setNumber: number) => number | null;
}

/**
 * Hook to load and compare against previous workout data for an exercise.
 */
export function useComparison(
  userId: ID | undefined,
  exerciseId: ID,
  currentDate?: DateString
): UseComparisonReturn {
  const previousData = useMemo(() => {
    if (!userId) return null;
    return workoutService.getPreviousExerciseData(userId, exerciseId, currentDate);
  }, [userId, exerciseId, currentDate]);

  /**
   * Get the previous value for a specific metric and set number.
   */
  const getPreviousSetValue = (metricId: ID, setNumber: number): number | null => {
    if (!previousData) return null;
    const set = previousData.sets.find((s) => s.setNumber === setNumber);
    if (!set) return null;
    const mv = set.metricValues.find((v) => v.metricId === metricId);
    return mv?.value ?? null;
  };

  /**
   * Compare a current metric value against the previous value for the same set.
   */
  const compareMetric = (
    metricId: ID,
    currentValue: number,
    setNumber: number
  ): MetricComparison | null => {
    const previousValue = getPreviousSetValue(metricId, setNumber);
    if (previousValue === null) return null;
    if (isNaN(currentValue) || currentValue === 0) return null;

    const difference = currentValue - previousValue;
    let result: ComparisonResult;

    if (difference > 0) {
      result = "improved";
    } else if (difference < 0) {
      result = "declined";
    } else {
      result = "same";
    }

    return {
      metricId,
      previousValue,
      currentValue,
      difference,
      result,
    };
  };

  return {
    previousData,
    compareMetric,
    getPreviousSetValue,
  };
}
