// ---------------------------------------------------------------------------
// Gym Tracker — Muscle Service
// CRUD operations for the muscle database.
// ---------------------------------------------------------------------------

import { Muscle, StoreKey, ID } from "../types";
import { getCollection, create, remove, generateId } from "../store";

/**
 * Get all muscles.
 */
export function getAllMuscles(): Muscle[] {
  return getCollection<Muscle>(StoreKey.Muscles);
}

/**
 * Get a single muscle by ID.
 */
export function getMuscleById(id: ID): Muscle | null {
  const muscles = getCollection<Muscle>(StoreKey.Muscles);
  return muscles.find((m) => m.id === id) ?? null;
}

/**
 * Search muscles by name (case-insensitive).
 */
export function searchMuscles(query: string): Muscle[] {
  const muscles = getCollection<Muscle>(StoreKey.Muscles);
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return muscles;
  return muscles.filter((m) => m.name.toLowerCase().includes(lowerQuery));
}

/**
 * Create a new muscle.
 */
export function createMuscle(name: string): Muscle | { error: string } {
  if (!name.trim()) return { error: "Muscle name is required" };

  const muscles = getCollection<Muscle>(StoreKey.Muscles);
  if (muscles.some((m) => m.name.toLowerCase() === name.toLowerCase().trim())) {
    return { error: "Muscle already exists" };
  }

  const muscle: Muscle = {
    id: generateId(),
    name: name.trim(),
  };

  return create(StoreKey.Muscles, muscle);
}

/**
 * Delete a muscle by ID.
 */
export function deleteMuscle(id: ID): boolean {
  return remove<Muscle>(StoreKey.Muscles, id);
}
