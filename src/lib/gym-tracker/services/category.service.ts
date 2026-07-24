// ---------------------------------------------------------------------------
// Gym Tracker — Category Service
// CRUD operations for workout categories and category groups.
// ---------------------------------------------------------------------------

import { WorkoutCategory, CategoryGroup, StoreKey, ID } from "../types";
import { getCollection, create, remove, generateId, now, setCollection } from "../store";

/**
 * Get all category groups.
 */
export function getAllCategoryGroups(): CategoryGroup[] {
  return getCollection<CategoryGroup>(StoreKey.CategoryGroups);
}

/**
 * Get all workout categories.
 */
export function getAllCategories(): WorkoutCategory[] {
  return getCollection<WorkoutCategory>(StoreKey.Categories);
}

/**
 * Get a single category by ID.
 */
export function getCategoryById(id: ID): WorkoutCategory | null {
  const categories = getCollection<WorkoutCategory>(StoreKey.Categories);
  return categories.find((c) => c.id === id) ?? null;
}

/**
 * Get categories by group ID.
 */
export function getCategoriesByGroup(groupId: ID): WorkoutCategory[] {
  const categories = getCollection<WorkoutCategory>(StoreKey.Categories);
  return categories.filter((c) => c.groupId === groupId);
}

/**
 * Search categories by name (case-insensitive).
 */
export function searchCategories(query: string): WorkoutCategory[] {
  const categories = getCollection<WorkoutCategory>(StoreKey.Categories);
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return categories;
  return categories.filter((c) => c.name.toLowerCase().includes(lowerQuery));
}

/**
 * Create a new workout category.
 * Immediately available to all users.
 */
export function createCategory(
  name: string,
  groupId: ID,
  requiresMuscle: boolean,
  createdBy: ID
): WorkoutCategory | { error: string } {
  if (!name.trim()) return { error: "Category name is required" };

  const categories = getCollection<WorkoutCategory>(StoreKey.Categories);
  if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase().trim())) {
    return { error: "Category already exists" };
  }

  const category: WorkoutCategory = {
    id: generateId(),
    name: name.trim(),
    groupId,
    requiresMuscle,
    createdBy,
    createdDate: now(),
  };

  return create(StoreKey.Categories, category);
}

/**
 * Create a new category group.
 */
export function createCategoryGroup(name: string): CategoryGroup | { error: string } {
  if (!name.trim()) return { error: "Group name is required" };

  const groups = getCollection<CategoryGroup>(StoreKey.CategoryGroups);
  if (groups.some((g) => g.name.toLowerCase() === name.toLowerCase().trim())) {
    return { error: "Group already exists" };
  }

  const group: CategoryGroup = {
    id: generateId(),
    name: name.trim(),
  };

  return create(StoreKey.CategoryGroups, group);
}

/**
 * Delete a workout category by ID.
 */
export function deleteCategory(id: ID): boolean {
  return remove<WorkoutCategory>(StoreKey.Categories, id);
}

/**
 * Get multiple categories by their IDs.
 */
export function getCategoriesByIds(ids: ID[]): WorkoutCategory[] {
  const categories = getCollection<WorkoutCategory>(StoreKey.Categories);
  return categories.filter((c) => ids.includes(c.id));
}

/**
 * Get categories grouped by their group.
 */
export function getCategoriesGrouped(): { group: CategoryGroup; categories: WorkoutCategory[] }[] {
  const groups = getAllCategoryGroups();
  const categories = getAllCategories();

  return groups
    .map((group) => ({
      group,
      categories: categories.filter((c) => c.groupId === group.id),
    }))
    .filter((g) => g.categories.length > 0);
}
