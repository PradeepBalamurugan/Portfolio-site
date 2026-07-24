// ---------------------------------------------------------------------------
// Gym Tracker — Seed Data
// Populates localStorage with initial categories, muscles, metrics,
// sample exercises, and the default demo user on first launch.
// ---------------------------------------------------------------------------

import {
  CategoryGroup,
  WorkoutCategory,
  Muscle,
  Metric,
  Exercise,
  User,
  StoreKey,
} from "./types";
import { setCollection, hasKey, setValue, generateId, now } from "./store";

const SYSTEM_USER_ID = "system";

// ---------------------------------------------------------------------------
// Category Groups
// ---------------------------------------------------------------------------
const categoryGroups: CategoryGroup[] = [
  { id: "grp-strength", name: "Strength Training" },
  { id: "grp-functional", name: "Functional Training" },
  { id: "grp-cardio", name: "Cardio" },
  { id: "grp-mobility", name: "Mobility & Recovery" },
  { id: "grp-sports", name: "Sports" },
];

// ---------------------------------------------------------------------------
// Workout Categories
// ---------------------------------------------------------------------------
const categories: WorkoutCategory[] = [
  // Strength Training
  { id: "cat-push", name: "Push", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-pull", name: "Pull", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-legs", name: "Legs", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-upper", name: "Upper Body", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-lower", name: "Lower Body", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-fullbody", name: "Full Body", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-bodybuilding", name: "Bodybuilding", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-powerlifting", name: "Powerlifting", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-olympic", name: "Olympic Weightlifting", groupId: "grp-strength", requiresMuscle: true, createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Functional Training
  { id: "cat-crossfit", name: "CrossFit", groupId: "grp-functional", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-calisthenics", name: "Calisthenics", groupId: "grp-functional", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-functional", name: "Functional Fitness", groupId: "grp-functional", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-circuit", name: "Circuit Training", groupId: "grp-functional", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-hiit", name: "HIIT", groupId: "grp-functional", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Cardio
  { id: "cat-running", name: "Running", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-walking", name: "Walking", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-cycling", name: "Cycling", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-swimming", name: "Swimming", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-rowing", name: "Rowing", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-stairclimber", name: "Stair Climber", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-elliptical", name: "Elliptical", groupId: "grp-cardio", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Mobility & Recovery
  { id: "cat-stretching", name: "Stretching", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-mobility", name: "Mobility", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-yoga", name: "Yoga", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-pilates", name: "Pilates", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-rehab", name: "Rehabilitation", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-physio", name: "Physiotherapy", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-foamrolling", name: "Foam Rolling", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-recovery", name: "Recovery", groupId: "grp-mobility", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Sports
  { id: "cat-football", name: "Football", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-basketball", name: "Basketball", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-cricket", name: "Cricket", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-badminton", name: "Badminton", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-tennis", name: "Tennis", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-martialarts", name: "Martial Arts", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-boxing", name: "Boxing", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-mma", name: "MMA", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "cat-climbing", name: "Climbing", groupId: "grp-sports", requiresMuscle: false, createdBy: SYSTEM_USER_ID, createdDate: now() },
];

// ---------------------------------------------------------------------------
// Muscles
// ---------------------------------------------------------------------------
const muscles: Muscle[] = [
  { id: "mus-chest", name: "Chest" },
  { id: "mus-back", name: "Back" },
  { id: "mus-shoulders", name: "Shoulders" },
  { id: "mus-biceps", name: "Biceps" },
  { id: "mus-triceps", name: "Triceps" },
  { id: "mus-legs", name: "Legs" },
  { id: "mus-abs", name: "Abs" },
  { id: "mus-forearms", name: "Forearms" },
  { id: "mus-glutes", name: "Glutes" },
  { id: "mus-hamstrings", name: "Hamstrings" },
  { id: "mus-quads", name: "Quadriceps" },
  { id: "mus-calves", name: "Calves" },
  { id: "mus-traps", name: "Traps" },
  { id: "mus-lats", name: "Lats" },
];

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------
const metrics: Metric[] = [
  { id: "met-weight", name: "Weight", unit: "kg", type: "number", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-reps", name: "Reps", unit: "reps", type: "integer", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-time", name: "Time", unit: "seconds", type: "duration", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-distance", name: "Distance", unit: "meters", type: "number", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-calories", name: "Calories", unit: "kcal", type: "number", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-heartrate", name: "Heart Rate", unit: "bpm", type: "integer", createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "met-sets", name: "Sets", unit: "sets", type: "integer", createdBy: SYSTEM_USER_ID, createdDate: now() },
];

// ---------------------------------------------------------------------------
// Sample Exercises — demonstrates dynamic metrics
// ---------------------------------------------------------------------------
const exercises: Exercise[] = [
  // Push exercises
  { id: "ex-bench", name: "Bench Press", categoryId: "cat-push", muscleId: "mus-chest", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-incline-bench", name: "Incline Bench Press", categoryId: "cat-push", muscleId: "mus-chest", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-ohp", name: "Overhead Press", categoryId: "cat-push", muscleId: "mus-shoulders", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-dips", name: "Dips", categoryId: "cat-push", muscleId: "mus-triceps", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-cable-fly", name: "Cable Fly", categoryId: "cat-push", muscleId: "mus-chest", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-tricep-pushdown", name: "Tricep Pushdown", categoryId: "cat-push", muscleId: "mus-triceps", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-lateral-raise", name: "Lateral Raise", categoryId: "cat-push", muscleId: "mus-shoulders", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Pull exercises
  { id: "ex-deadlift", name: "Deadlift", categoryId: "cat-pull", muscleId: "mus-back", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-pullups", name: "Pull Ups", categoryId: "cat-pull", muscleId: "mus-lats", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-barbell-row", name: "Barbell Row", categoryId: "cat-pull", muscleId: "mus-back", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-bicep-curl", name: "Bicep Curl", categoryId: "cat-pull", muscleId: "mus-biceps", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-face-pull", name: "Face Pull", categoryId: "cat-pull", muscleId: "mus-shoulders", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Leg exercises
  { id: "ex-squat", name: "Squat", categoryId: "cat-legs", muscleId: "mus-quads", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-leg-press", name: "Leg Press", categoryId: "cat-legs", muscleId: "mus-quads", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-lunges", name: "Lunges", categoryId: "cat-legs", muscleId: "mus-quads", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-leg-curl", name: "Leg Curl", categoryId: "cat-legs", muscleId: "mus-hamstrings", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-calf-raise", name: "Calf Raise", categoryId: "cat-legs", muscleId: "mus-calves", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-hip-thrust", name: "Hip Thrust", categoryId: "cat-legs", muscleId: "mus-glutes", metricIds: ["met-weight", "met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Exercises with varied metrics
  { id: "ex-plank", name: "Plank", categoryId: "cat-calisthenics", muscleId: null, metricIds: ["met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-farmer-walk", name: "Farmer Walk", categoryId: "cat-functional", muscleId: null, metricIds: ["met-weight", "met-distance", "met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-crunches", name: "Crunches", categoryId: "cat-calisthenics", muscleId: null, metricIds: ["met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-pushups", name: "Push Ups", categoryId: "cat-calisthenics", muscleId: null, metricIds: ["met-reps"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-burpees", name: "Burpees", categoryId: "cat-hiit", muscleId: null, metricIds: ["met-reps", "met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-mountain-climbers", name: "Mountain Climbers", categoryId: "cat-hiit", muscleId: null, metricIds: ["met-reps", "met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Cardio exercises
  { id: "ex-treadmill-run", name: "Treadmill Run", categoryId: "cat-running", muscleId: null, metricIds: ["met-distance", "met-time", "met-calories", "met-heartrate"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-outdoor-run", name: "Outdoor Run", categoryId: "cat-running", muscleId: null, metricIds: ["met-distance", "met-time", "met-calories"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-stationary-bike", name: "Stationary Bike", categoryId: "cat-cycling", muscleId: null, metricIds: ["met-distance", "met-time", "met-calories"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-rowing-machine", name: "Rowing Machine", categoryId: "cat-rowing", muscleId: null, metricIds: ["met-distance", "met-time", "met-calories"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-swimming-laps", name: "Swimming Laps", categoryId: "cat-swimming", muscleId: null, metricIds: ["met-distance", "met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },

  // Mobility exercises
  { id: "ex-foam-roll", name: "Foam Roll", categoryId: "cat-foamrolling", muscleId: null, metricIds: ["met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-yoga-flow", name: "Yoga Flow", categoryId: "cat-yoga", muscleId: null, metricIds: ["met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
  { id: "ex-dynamic-stretch", name: "Dynamic Stretching", categoryId: "cat-stretching", muscleId: null, metricIds: ["met-time"], createdBy: SYSTEM_USER_ID, createdDate: now() },
];

// ---------------------------------------------------------------------------
// Default Demo User
// ---------------------------------------------------------------------------
const defaultUsers: User[] = [
  {
    id: "user-pradeep",
    name: "Pradeep",
    username: "pradeep",
    password: "password123",
    createdDate: now(),
  },
];

// ---------------------------------------------------------------------------
// Seed function — runs once on first app launch
// ---------------------------------------------------------------------------
export function initializeSeedData(): void {
  if (typeof window === "undefined") return;
  if (hasKey(StoreKey.Initialized)) return;

  setCollection(StoreKey.CategoryGroups, categoryGroups);
  setCollection(StoreKey.Categories, categories);
  setCollection(StoreKey.Muscles, muscles);
  setCollection(StoreKey.Metrics, metrics);
  setCollection(StoreKey.Exercises, exercises);
  setCollection(StoreKey.Users, defaultUsers);
  setCollection(StoreKey.Workouts, []);

  setValue(StoreKey.Initialized, true);
}

/**
 * Get all category groups for display.
 */
export function getCategoryGroups(): CategoryGroup[] {
  return categoryGroups;
}
