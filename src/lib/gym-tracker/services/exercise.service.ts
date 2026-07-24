// ---------------------------------------------------------------------------
// Gym Tracker — Exercise Service
// CRUD operations for the global exercise database.
// ---------------------------------------------------------------------------

import { Exercise, StoreKey, ID } from "../types";
import { getCollection, create, remove, generateId, now } from "../store";

/**
 * Get all exercises.
 */
export function getAllExercises(): Exercise[] {
  return getCollection<Exercise>(StoreKey.Exercises);
}

/**
 * Get a single exercise by ID.
 */
export function getExerciseById(id: ID): Exercise | null {
  const exercises = getCollection<Exercise>(StoreKey.Exercises);
  return exercises.find((e) => e.id === id) ?? null;
}

/**
 * Get exercises by category ID.
 */
export function getExercisesByCategory(categoryId: ID): Exercise[] {
  const exercises = getCollection<Exercise>(StoreKey.Exercises);
  return exercises.filter((e) => e.categoryId === categoryId);
}

/**
 * Get exercises by multiple category IDs, with selected categories prioritized first.
 */
export function getExercisesByCategoryIds(
  categoryIds: ID[],
  allExercises?: Exercise[]
): { prioritized: Exercise[]; others: Exercise[] } {
  const exercises = allExercises ?? getCollection<Exercise>(StoreKey.Exercises);
  const prioritized = exercises.filter((e) => categoryIds.includes(e.categoryId));
  const others = exercises.filter((e) => !categoryIds.includes(e.categoryId));
  return { prioritized, others };
}

/**
 * Search exercises by name (case-insensitive).
 * Optionally prioritize exercises from specific categories.
 */
export function searchExercises(
  query: string,
  priorityCategoryIds?: ID[]
): Exercise[] {
  const exercises = getCollection<Exercise>(StoreKey.Exercises);
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    if (priorityCategoryIds && priorityCategoryIds.length > 0) {
      const priority = exercises.filter((e) => priorityCategoryIds.includes(e.categoryId));
      const rest = exercises.filter((e) => !priorityCategoryIds.includes(e.categoryId));
      return [...priority, ...rest];
    }
    return exercises;
  }

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(lowerQuery)
  );

  if (priorityCategoryIds && priorityCategoryIds.length > 0) {
    const priority = filtered.filter((e) => priorityCategoryIds.includes(e.categoryId));
    const rest = filtered.filter((e) => !priorityCategoryIds.includes(e.categoryId));
    return [...priority, ...rest];
  }

  return filtered;
}

/**
 * Create a new exercise.
 * Immediately available to all users.
 */
export function createExercise(
  name: string,
  categoryId: ID,
  muscleId: ID | null,
  metricIds: ID[],
  createdBy: ID
): Exercise | { error: string } {
  if (!name.trim()) return { error: "Exercise name is required" };
  if (!categoryId) return { error: "Category is required" };
  if (metricIds.length === 0) return { error: "At least one metric is required" };

  const exercises = getCollection<Exercise>(StoreKey.Exercises);
  if (exercises.some((e) => e.name.toLowerCase() === name.toLowerCase().trim())) {
    return { error: "Exercise already exists" };
  }

  const exercise: Exercise = {
    id: generateId(),
    name: name.trim(),
    categoryId,
    muscleId,
    metricIds,
    createdBy,
    createdDate: now(),
  };

  return create(StoreKey.Exercises, exercise);
}

/**
 * Delete an exercise by ID.
 */
export function deleteExercise(id: ID): boolean {
  return remove<Exercise>(StoreKey.Exercises, id);
}

/**
 * Get exercises by muscle ID.
 */
export function getExercisesByMuscle(muscleId: ID): Exercise[] {
  const exercises = getCollection<Exercise>(StoreKey.Exercises);
  return exercises.filter((e) => e.muscleId === muscleId);
}

/**
 * Get all exercises that belong to a category (for removal confirmation).
 */
export function getExerciseCountByCategory(categoryId: ID): number {
  return getExercisesByCategory(categoryId).length;
}
