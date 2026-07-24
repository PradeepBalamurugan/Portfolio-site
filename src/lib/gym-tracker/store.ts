// ---------------------------------------------------------------------------
// Gym Tracker — localStorage Store Abstraction
// Generic CRUD operations over localStorage with JSON serialization.
// Designed to be replaced with API calls when a backend is added.
// ---------------------------------------------------------------------------

import { ID } from "./types";

/**
 * Generate a unique ID (UUID v4-like).
 * Uses crypto.randomUUID when available, falls back to manual generation.
 */
export function generateId(): ID {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp.
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Generic localStorage CRUD
// ---------------------------------------------------------------------------

/**
 * Read a collection from localStorage.
 */
export function getCollection<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Write a collection to localStorage.
 */
export function setCollection<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Get a single item by ID from a collection.
 */
export function getById<T extends { id: ID }>(
  key: string,
  id: ID
): T | null {
  const collection = getCollection<T>(key);
  return collection.find((item) => item.id === id) ?? null;
}

/**
 * Create a new item in a collection.
 */
export function create<T extends { id: ID }>(key: string, item: T): T {
  const collection = getCollection<T>(key);
  collection.push(item);
  setCollection(key, collection);
  return item;
}

/**
 * Update an existing item in a collection.
 */
export function update<T extends { id: ID }>(
  key: string,
  id: ID,
  updates: Partial<T>
): T | null {
  const collection = getCollection<T>(key);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updates };
  setCollection(key, collection);
  return collection[index];
}

/**
 * Remove an item from a collection by ID.
 */
export function remove<T extends { id: ID }>(key: string, id: ID): boolean {
  const collection = getCollection<T>(key);
  const filtered = collection.filter((item) => item.id !== id);
  if (filtered.length === collection.length) return false;
  setCollection(key, filtered);
  return true;
}

/**
 * Get a single value from localStorage (non-collection).
 */
export function getValue<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Set a single value in localStorage.
 */
export function setValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a key from localStorage.
 */
export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

/**
 * Check if a key exists in localStorage.
 */
export function hasKey(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) !== null;
}
