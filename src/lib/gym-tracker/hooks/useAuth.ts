// ---------------------------------------------------------------------------
// Gym Tracker — useAuth Hook
// Manages authentication state and provides auth operations.
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "../types";
import * as authService from "../services/auth.service";
import { initializeSeedData } from "../seed-data";

interface UseAuthReturn {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => boolean;
  register: (name: string, username: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize seed data and check existing session on mount
  useEffect(() => {
    initializeSeedData();
    const existing = authService.getCurrentSession();
    setSession(existing);
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    setError(null);
    const result = authService.login(username, password);
    if ("error" in result) {
      setError(result.error);
      return false;
    }
    setSession(result.session);
    return true;
  }, []);

  const register = useCallback(
    (name: string, username: string, password: string): boolean => {
      setError(null);
      const result = authService.register(name, username, password);
      if ("error" in result) {
        setError(result.error);
        return false;
      }
      setSession(result.session);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { session, isLoading, error, login, register, logout, clearError };
}
