"use client";

import Link from "next/link";
import { Dumbbell, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

// ---------------------------------------------------------------------------
// GymNavbar — Gym Tracker's own navigation bar
// ---------------------------------------------------------------------------

interface GymNavbarProps {
  userName: string;
  onLogout: () => void;
}

export default function GymNavbar({ userName, onLogout }: GymNavbarProps) {
  const { theme, toggleTheme } = useTheme();

  // Extract the first name from the full name for the greeting
  const firstName = userName.split(" ")[0] ?? userName;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/5">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ── Left — Brand ───────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-opacity duration-200 hover:opacity-80"
        >
          <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500 shadow-lg shadow-blue-500/20">
            <Dumbbell className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Gym Tracker
            <span className="inline-block ml-0.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 align-super" />
          </span>
        </Link>

        {/* ── Right — User controls ──────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* User greeting — hidden on very small screens */}
          <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
            Hi,{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {firstName}
            </span>
          </span>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 px-3 py-2 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
