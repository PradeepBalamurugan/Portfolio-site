// ---------------------------------------------------------------------------
// Gym Tracker — Type Definitions
// All data model interfaces for the gym tracker module.
// Designed to be data-driven with no hardcoded relationships.
// ---------------------------------------------------------------------------

/** Unique identifier type alias for readability */
export type ID = string;

/** ISO date string (YYYY-MM-DD) */
export type DateString = string;

/** ISO timestamp string */
export type Timestamp = string;

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export interface User {
  id: ID;
  name: string;
  username: string;
  password: string;
  createdDate: Timestamp;
}

export interface Session {
  userId: ID;
  username: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Category Group — organizes workout categories into high-level groups
// ---------------------------------------------------------------------------
export interface CategoryGroup {
  id: ID;
  name: string;
}

// ---------------------------------------------------------------------------
// Workout Category — e.g., Push, Pull, CrossFit, Running, Yoga, etc.
// ---------------------------------------------------------------------------
export interface WorkoutCategory {
  id: ID;
  name: string;
  groupId: ID;
  /** Whether exercises in this category require muscle selection */
  requiresMuscle: boolean;
  createdBy: ID;
  createdDate: Timestamp;
}

// ---------------------------------------------------------------------------
// Muscle — optional muscle tagging for strength exercises
// ---------------------------------------------------------------------------
export interface Muscle {
  id: ID;
  name: string;
}

// ---------------------------------------------------------------------------
// Metric — defines a measurable dimension for exercises
// ---------------------------------------------------------------------------
export type MetricType = "number" | "integer" | "duration";

export interface Metric {
  id: ID;
  name: string;
  unit: string;
  type: MetricType;
  createdBy: ID;
  createdDate: Timestamp;
}

// ---------------------------------------------------------------------------
// Exercise — globally shared exercise database
// ---------------------------------------------------------------------------
export interface Exercise {
  id: ID;
  name: string;
  categoryId: ID;
  /** Null for categories that don't require muscle selection */
  muscleId: ID | null;
  /** Ordered list of metric IDs that define this exercise's inputs */
  metricIds: ID[];
  createdBy: ID;
  createdDate: Timestamp;
}

// ---------------------------------------------------------------------------
// Workout — the top-level workout entity for a user on a specific date
// ---------------------------------------------------------------------------
export interface Workout {
  id: ID;
  userId: ID;
  date: DateString;
  categories: WorkoutCategoryEntry[];
  notes?: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
}

/** A category within a workout, containing its exercises */
export interface WorkoutCategoryEntry {
  categoryId: ID;
  exercises: WorkoutExerciseEntry[];
}

/** An exercise instance within a workout category */
export interface WorkoutExerciseEntry {
  id: ID;
  exerciseId: ID;
  order: number;
  notes?: string;
  sets: WorkoutSetEntry[];
}

/** A single set within a workout exercise */
export interface WorkoutSetEntry {
  setNumber: number;
  metricValues: MetricValue[];
}

/** A single metric value within a set */
export interface MetricValue {
  metricId: ID;
  value: number;
}

// ---------------------------------------------------------------------------
// Previous Comparison — computed data for UI display
// ---------------------------------------------------------------------------
export interface PreviousExerciseData {
  exerciseId: ID;
  date: DateString;
  sets: WorkoutSetEntry[];
}

export type ComparisonResult = "improved" | "same" | "declined";

export interface MetricComparison {
  metricId: ID;
  previousValue: number;
  currentValue: number;
  difference: number;
  result: ComparisonResult;
}

// ---------------------------------------------------------------------------
// Motivational Quote
// ---------------------------------------------------------------------------
export interface Quote {
  text: string;
  author: string;
}

// ---------------------------------------------------------------------------
// Store keys enum — prevents key typos across services
// ---------------------------------------------------------------------------
export enum StoreKey {
  Users = "gym-tracker-users",
  Session = "gym-tracker-session",
  CategoryGroups = "gym-tracker-category-groups",
  Categories = "gym-tracker-categories",
  Muscles = "gym-tracker-muscles",
  Metrics = "gym-tracker-metrics",
  Exercises = "gym-tracker-exercises",
  Workouts = "gym-tracker-workouts",
  Initialized = "gym-tracker-initialized",
}
