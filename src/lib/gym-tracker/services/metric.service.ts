// ---------------------------------------------------------------------------
// Gym Tracker — Metric Service
// CRUD operations for the shared metrics database.
// ---------------------------------------------------------------------------

import { Metric, StoreKey, ID } from "../types";
import { getCollection, create, remove, generateId, now } from "../store";

/**
 * Get all metrics.
 */
export function getAllMetrics(): Metric[] {
  return getCollection<Metric>(StoreKey.Metrics);
}

/**
 * Get a single metric by ID.
 */
export function getMetricById(id: ID): Metric | null {
  const metrics = getCollection<Metric>(StoreKey.Metrics);
  return metrics.find((m) => m.id === id) ?? null;
}

/**
 * Get multiple metrics by their IDs.
 */
export function getMetricsByIds(ids: ID[]): Metric[] {
  const metrics = getCollection<Metric>(StoreKey.Metrics);
  return ids.map((id) => metrics.find((m) => m.id === id)).filter(Boolean) as Metric[];
}

/**
 * Search metrics by name (case-insensitive).
 */
export function searchMetrics(query: string): Metric[] {
  const metrics = getCollection<Metric>(StoreKey.Metrics);
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return metrics;
  return metrics.filter((m) => m.name.toLowerCase().includes(lowerQuery));
}

/**
 * Create a new metric.
 * Immediately available to all users.
 */
export function createMetric(
  name: string,
  unit: string,
  type: Metric["type"],
  createdBy: ID
): Metric | { error: string } {
  if (!name.trim()) return { error: "Metric name is required" };
  if (!unit.trim()) return { error: "Unit is required" };

  const metrics = getCollection<Metric>(StoreKey.Metrics);
  if (metrics.some((m) => m.name.toLowerCase() === name.toLowerCase().trim())) {
    return { error: "Metric already exists" };
  }

  const metric: Metric = {
    id: generateId(),
    name: name.trim(),
    unit: unit.trim(),
    type,
    createdBy,
    createdDate: now(),
  };

  return create(StoreKey.Metrics, metric);
}

/**
 * Delete a metric by ID.
 */
export function deleteMetric(id: ID): boolean {
  return remove<Metric>(StoreKey.Metrics, id);
}
