// ---------------------------------------------------------------------------
// Gym Tracker — useWorkout Hook
// Manages workout state and CRUD operations for the current workout.
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback } from "react";
import { Workout, MetricValue, ID, DateString } from "../types";
import * as workoutService from "../services/workout.service";

interface UseWorkoutReturn {
  workout: Workout | null;
  isLoading: boolean;
  loadWorkout: (userId: ID, date: DateString) => void;
  createWorkout: (userId: ID, date: DateString, categoryIds: ID[]) => Workout;
  updateCategories: (categoryIds: ID[]) => Workout | null;
  addExercise: (categoryId: ID, exerciseId: ID) => Workout | null;
  removeExercise: (exerciseEntryId: ID) => Workout | null;
  duplicateExercise: (exerciseEntryId: ID) => Workout | null;
  addSet: (exerciseEntryId: ID) => Workout | null;
  removeSet: (exerciseEntryId: ID, setNumber: number) => Workout | null;
  updateSetValues: (exerciseEntryId: ID, setNumber: number, values: MetricValue[]) => Workout | null;
  updateExerciseNotes: (exerciseEntryId: ID, notes: string) => Workout | null;
  deleteWorkout: () => boolean;
  refreshWorkout: () => void;
}

export function useWorkout(): UseWorkoutReturn {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<ID | null>(null);
  const [currentDate, setCurrentDate] = useState<DateString | null>(null);

  const loadWorkout = useCallback((userId: ID, date: DateString) => {
    setIsLoading(true);
    setCurrentUserId(userId);
    setCurrentDate(date);
    const w = workoutService.getWorkoutByDate(userId, date);
    setWorkout(w);
    setIsLoading(false);
  }, []);

  const createWorkout = useCallback(
    (userId: ID, date: DateString, categoryIds: ID[]): Workout => {
      const w = workoutService.createWorkout(userId, date, categoryIds);
      setWorkout(w);
      setCurrentUserId(userId);
      setCurrentDate(date);
      return w;
    },
    []
  );

  const updateCategories = useCallback(
    (categoryIds: ID[]): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.updateWorkoutCategories(workout.id, categoryIds);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const addExercise = useCallback(
    (categoryId: ID, exerciseId: ID): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.addExerciseToWorkout(workout.id, categoryId, exerciseId);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const removeExercise = useCallback(
    (exerciseEntryId: ID): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.removeExerciseFromWorkout(workout.id, exerciseEntryId);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const duplicateExercise = useCallback(
    (exerciseEntryId: ID): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.duplicateExercise(workout.id, exerciseEntryId);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const addSet = useCallback(
    (exerciseEntryId: ID): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.addSet(workout.id, exerciseEntryId);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const removeSet = useCallback(
    (exerciseEntryId: ID, setNumber: number): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.removeSet(workout.id, exerciseEntryId, setNumber);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const updateSetValues = useCallback(
    (exerciseEntryId: ID, setNumber: number, values: MetricValue[]): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.updateSetMetricValues(
        workout.id,
        exerciseEntryId,
        setNumber,
        values
      );
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const updateExerciseNotes = useCallback(
    (exerciseEntryId: ID, notes: string): Workout | null => {
      if (!workout) return null;
      const updated = workoutService.updateExerciseNotes(workout.id, exerciseEntryId, notes);
      setWorkout(updated);
      return updated;
    },
    [workout]
  );

  const deleteWorkoutFn = useCallback((): boolean => {
    if (!workout) return false;
    const success = workoutService.deleteWorkout(workout.id);
    if (success) setWorkout(null);
    return success;
  }, [workout]);

  const refreshWorkout = useCallback(() => {
    if (currentUserId && currentDate) {
      const w = workoutService.getWorkoutByDate(currentUserId, currentDate);
      setWorkout(w);
    }
  }, [currentUserId, currentDate]);

  return {
    workout,
    isLoading,
    loadWorkout,
    createWorkout,
    updateCategories,
    addExercise,
    removeExercise,
    duplicateExercise,
    addSet,
    removeSet,
    updateSetValues,
    updateExerciseNotes,
    deleteWorkout: deleteWorkoutFn,
    refreshWorkout,
  };
}
