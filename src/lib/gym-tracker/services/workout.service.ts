// ---------------------------------------------------------------------------
// Gym Tracker — Workout Service
// CRUD operations for workouts, sets, and metric values.
// Handles the nested Workout → Categories → Exercises → Sets → MetricValues structure.
// ---------------------------------------------------------------------------

import {
  Workout,
  WorkoutCategoryEntry,
  WorkoutExerciseEntry,
  WorkoutSetEntry,
  MetricValue,
  PreviousExerciseData,
  StoreKey,
  ID,
  DateString,
} from "../types";
import { getCollection, setCollection, generateId, now } from "../store";

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Get all workouts for a user.
 */
export function getWorkoutsByUser(userId: ID): Workout[] {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  return workouts.filter((w) => w.userId === userId);
}

/**
 * Get a workout for a specific user and date.
 */
export function getWorkoutByDate(userId: ID, date: DateString): Workout | null {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  return workouts.find((w) => w.userId === userId && w.date === date) ?? null;
}

/**
 * Get the most recent N workouts for a user.
 */
export function getRecentWorkouts(userId: ID, limit: number = 7): Workout[] {
  const workouts = getWorkoutsByUser(userId);
  return workouts
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * Get all dates that have workouts for a user in a specific month.
 * Returns array of date strings (YYYY-MM-DD).
 */
export function getWorkoutDatesForMonth(
  userId: ID,
  year: number,
  month: number
): DateString[] {
  const workouts = getWorkoutsByUser(userId);
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  return workouts
    .filter((w) => w.date.startsWith(monthStr))
    .map((w) => w.date);
}

/**
 * Get the user's most recent previous data for a specific exercise.
 * Used for the comparison feature.
 */
export function getPreviousExerciseData(
  userId: ID,
  exerciseId: ID,
  excludeDate?: DateString
): PreviousExerciseData | null {
  const workouts = getWorkoutsByUser(userId)
    .filter((w) => (excludeDate ? w.date !== excludeDate : true))
    .sort((a, b) => b.date.localeCompare(a.date));

  for (const workout of workouts) {
    for (const cat of workout.categories) {
      const exercise = cat.exercises.find((e) => e.exerciseId === exerciseId);
      if (exercise && exercise.sets.length > 0) {
        return {
          exerciseId,
          date: workout.date,
          sets: exercise.sets,
        };
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/**
 * Create a new workout for a user on a specific date with selected categories.
 */
export function createWorkout(
  userId: ID,
  date: DateString,
  categoryIds: ID[]
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);

  // Check if workout already exists for this date
  const existing = workouts.find((w) => w.userId === userId && w.date === date);
  if (existing) {
    // Update categories instead
    return updateWorkoutCategories(existing.id, categoryIds);
  }

  const workout: Workout = {
    id: generateId(),
    userId,
    date,
    categories: categoryIds.map((categoryId) => ({
      categoryId,
      exercises: [],
    })),
    createdDate: now(),
    updatedDate: now(),
  };

  workouts.push(workout);
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Update the categories of an existing workout.
 * Preserves exercises for categories that remain, removes exercises for removed categories.
 */
export function updateWorkoutCategories(
  workoutId: ID,
  categoryIds: ID[]
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  const newCategories: WorkoutCategoryEntry[] = categoryIds.map((categoryId) => {
    // Preserve existing exercises for this category
    const existing = workout.categories.find((c) => c.categoryId === categoryId);
    return existing ?? { categoryId, exercises: [] };
  });

  workout.categories = newCategories;
  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Add an exercise to a workout category.
 */
export function addExerciseToWorkout(
  workoutId: ID,
  categoryId: ID,
  exerciseId: ID
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  const catEntry = workout.categories.find((c) => c.categoryId === categoryId);
  if (!catEntry) throw new Error("Category not found in workout");

  const newExercise: WorkoutExerciseEntry = {
    id: generateId(),
    exerciseId,
    order: catEntry.exercises.length,
    sets: [{ setNumber: 1, metricValues: [] }],
  };

  catEntry.exercises.push(newExercise);
  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Remove an exercise from a workout.
 */
export function removeExerciseFromWorkout(
  workoutId: ID,
  exerciseEntryId: ID
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    cat.exercises = cat.exercises.filter((e) => e.id !== exerciseEntryId);
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Duplicate an exercise within the same workout category.
 */
export function duplicateExercise(
  workoutId: ID,
  exerciseEntryId: ID
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    const exerciseIndex = cat.exercises.findIndex((e) => e.id === exerciseEntryId);
    if (exerciseIndex !== -1) {
      const original = cat.exercises[exerciseIndex];
      const duplicate: WorkoutExerciseEntry = {
        id: generateId(),
        exerciseId: original.exerciseId,
        order: cat.exercises.length,
        sets: original.sets.map((s) => ({
          setNumber: s.setNumber,
          metricValues: s.metricValues.map((mv) => ({ ...mv })),
        })),
      };
      cat.exercises.splice(exerciseIndex + 1, 0, duplicate);
      break;
    }
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Add a new set to an exercise entry.
 */
export function addSet(workoutId: ID, exerciseEntryId: ID): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    const exercise = cat.exercises.find((e) => e.id === exerciseEntryId);
    if (exercise) {
      const newSetNumber = exercise.sets.length + 1;
      exercise.sets.push({ setNumber: newSetNumber, metricValues: [] });
      break;
    }
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Remove a set from an exercise entry.
 */
export function removeSet(
  workoutId: ID,
  exerciseEntryId: ID,
  setNumber: number
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    const exercise = cat.exercises.find((e) => e.id === exerciseEntryId);
    if (exercise) {
      exercise.sets = exercise.sets
        .filter((s) => s.setNumber !== setNumber)
        .map((s, i) => ({ ...s, setNumber: i + 1 }));
      break;
    }
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Update metric values for a specific set.
 */
export function updateSetMetricValues(
  workoutId: ID,
  exerciseEntryId: ID,
  setNumber: number,
  metricValues: MetricValue[]
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    const exercise = cat.exercises.find((e) => e.id === exerciseEntryId);
    if (exercise) {
      const set = exercise.sets.find((s) => s.setNumber === setNumber);
      if (set) {
        set.metricValues = metricValues;
      }
      break;
    }
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Update notes for a workout exercise.
 */
export function updateExerciseNotes(
  workoutId: ID,
  exerciseEntryId: ID,
  notes: string
): Workout {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const index = workouts.findIndex((w) => w.id === workoutId);
  if (index === -1) throw new Error("Workout not found");

  const workout = workouts[index];
  for (const cat of workout.categories) {
    const exercise = cat.exercises.find((e) => e.id === exerciseEntryId);
    if (exercise) {
      exercise.notes = notes;
      break;
    }
  }

  workout.updatedDate = now();
  workouts[index] = workout;
  setCollection(StoreKey.Workouts, workouts);
  return workout;
}

/**
 * Delete an entire workout.
 */
export function deleteWorkout(workoutId: ID): boolean {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const filtered = workouts.filter((w) => w.id !== workoutId);
  if (filtered.length === workouts.length) return false;
  setCollection(StoreKey.Workouts, filtered);
  return true;
}

/**
 * Get progress stats for a user.
 */
export function getProgressStats(userId: ID): {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  totalExercises: number;
  currentStreak: number;
} {
  const workouts = getWorkoutsByUser(userId).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];

  // This week (Monday to Sunday)
  const dayOfWeek = todayDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(todayDate);
  monday.setDate(monday.getDate() - mondayOffset);
  const mondayStr = monday.toISOString().split("T")[0];

  // This month
  const monthStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}`;

  const thisWeekWorkouts = workouts.filter(
    (w) => w.date >= mondayStr && w.date <= todayStr
  ).length;

  const thisMonthWorkouts = workouts.filter((w) =>
    w.date.startsWith(monthStr)
  ).length;

  const totalExercises = workouts.reduce(
    (total, w) =>
      total + w.categories.reduce((catTotal, c) => catTotal + c.exercises.length, 0),
    0
  );

  // Calculate streak
  let currentStreak = 0;
  const checkDate = new Date(todayDate);
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (workouts.some((w) => w.date === dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // Today might not have a workout yet, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    totalWorkouts: workouts.length,
    thisWeekWorkouts,
    thisMonthWorkouts,
    totalExercises,
    currentStreak,
  };
}

/**
 * Get exercises that appear in a specific category within a workout.
 * Used for the confirmation dialog when removing a category.
 */
export function getExercisesInWorkoutCategory(
  workoutId: ID,
  categoryId: ID
): WorkoutExerciseEntry[] {
  const workouts = getCollection<Workout>(StoreKey.Workouts);
  const workout = workouts.find((w) => w.id === workoutId);
  if (!workout) return [];

  const cat = workout.categories.find((c) => c.categoryId === categoryId);
  return cat?.exercises ?? [];
}
