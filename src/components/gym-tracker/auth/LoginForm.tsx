"use client";

import { useState, type FormEvent } from "react";
import { Dumbbell, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
  onSwitchToRegister: () => void;
  error: string | null;
}

// ---------------------------------------------------------------------------
// LoginForm
// ---------------------------------------------------------------------------
export default function LoginForm({ onLogin, onSwitchToRegister, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- handlers -----------------------------------------------------------
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    // Simulate a tiny async feel then call sync login
    const success = onLogin(username.trim(), password);
    if (!success) setIsSubmitting(false);
  };

  // ---- render -------------------------------------------------------------
  return (
    <div className="flex min-h-[480px] items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-sm">
        {/* ---- Header Icon + Title ---- */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
            Sign in to track your workouts
          </p>
        </div>

        {/* ---- Error Banner ---- */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ---- Form ---- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-username"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !password.trim()}
            className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 text-white rounded-xl font-medium text-sm px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0"
          >
            {isSubmitting ? (
              <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <LogIn className="h-4.5 w-4.5" />
            )}
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* ---- Switch to Register ---- */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
