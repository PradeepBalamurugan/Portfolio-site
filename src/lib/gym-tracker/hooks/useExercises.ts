// ---------------------------------------------------------------------------
// Gym Tracker — useExercises Hook
// Manages exercise search, creation, and category-aware filtering.
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useMemo } from "react";
import { Exercise, ID } from "../types";
import * as exerciseService from "../services/exercise.service";

interface UseExercisesReturn {
  exercises: Exercise[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Exercise[];
  createExercise: (
    name: string,
    categoryId: ID,
    muscleId: ID | null,
    metricIds: ID[],
    createdBy: ID
  ) => Exercise | { error: string };
  deleteExercise: (id: ID) => boolean;
  getExerciseById: (id: ID) => Exercise | null;
  getExercisesByCategory: (categoryId: ID) => Exercise[];
  refreshExercises: () => void;
}

export function useExercises(priorityCategoryIds?: ID[]): UseExercisesReturn {
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    exerciseService.getAllExercises()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const refreshExercises = useCallback(() => {
    setExercises(exerciseService.getAllExercises());
  }, []);

  const searchResults = useMemo(() => {
    return exerciseService.searchExercises(searchQuery, priorityCategoryIds);
  }, [searchQuery, priorityCategoryIds]);

  const createExercise = useCallback(
    (
      name: string,
      categoryId: ID,
      muscleId: ID | null,
      metricIds: ID[],
      createdBy: ID
    ): Exercise | { error: string } => {
      const result = exerciseService.createExercise(
        name,
        categoryId,
        muscleId,
        metricIds,
        createdBy
      );
      if (!("error" in result)) {
        refreshExercises();
      }
      return result;
    },
    [refreshExercises]
  );

  const deleteExercise = useCallback(
    (id: ID): boolean => {
      const success = exerciseService.deleteExercise(id);
      if (success) refreshExercises();
      return success;
    },
    [refreshExercises]
  );

  const getExerciseById = useCallback(
    (id: ID): Exercise | null => {
      return exercises.find((e) => e.id === id) ?? null;
    },
    [exercises]
  );

  const getExercisesByCategory = useCallback(
    (categoryId: ID): Exercise[] => {
      return exercises.filter((e) => e.categoryId === categoryId);
    },
    [exercises]
  );

  return {
    exercises,
    searchQuery,
    setSearchQuery,
    searchResults,
    createExercise,
    deleteExercise,
    getExerciseById,
    getExercisesByCategory,
    refreshExercises,
  };
}
