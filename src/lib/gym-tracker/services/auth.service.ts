// ---------------------------------------------------------------------------
// Gym Tracker — Auth Service
// Handles user registration, login, logout, and session management.
// ---------------------------------------------------------------------------

import { User, Session, StoreKey } from "../types";
import { getCollection, create, getValue, setValue, removeKey, generateId, now } from "../store";

/**
 * Register a new user.
 * Returns the session on success, or an error message string.
 */
export function register(
  name: string,
  username: string,
  password: string
): { session: Session } | { error: string } {
  const users = getCollection<User>(StoreKey.Users);

  // Check if username already exists
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { error: "Username already exists" };
  }

  if (!name.trim()) return { error: "Name is required" };
  if (!username.trim()) return { error: "Username is required" };
  if (password.length < 6) return { error: "Password must be at least 6 characters" };

  const user: User = {
    id: generateId(),
    name: name.trim(),
    username: username.trim().toLowerCase(),
    password,
    createdDate: now(),
  };

  create(StoreKey.Users, user);

  const session: Session = {
    userId: user.id,
    username: user.username,
    name: user.name,
  };

  setValue(StoreKey.Session, session);
  return { session };
}

/**
 * Login with username and password.
 * Returns the session on success, or an error message string.
 */
export function login(
  username: string,
  password: string
): { session: Session } | { error: string } {
  const users = getCollection<User>(StoreKey.Users);
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    return { error: "Invalid username or password" };
  }

  const session: Session = {
    userId: user.id,
    username: user.username,
    name: user.name,
  };

  setValue(StoreKey.Session, session);
  return { session };
}

/**
 * Logout the current user.
 */
export function logout(): void {
  removeKey(StoreKey.Session);
}

/**
 * Get the current authenticated session, or null if not logged in.
 */
export function getCurrentSession(): Session | null {
  return getValue<Session>(StoreKey.Session);
}

/**
 * Check if a user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}
