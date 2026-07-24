"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface RegisterFormProps {
  onRegister: (name: string, username: string, password: string) => boolean;
  onSwitchToLogin: () => void;
  error: string | null;
}

// ---------------------------------------------------------------------------
// RegisterForm
// ---------------------------------------------------------------------------
export default function RegisterForm({
  onRegister,
  onSwitchToLogin,
  error,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive the currently-visible error (local client-side takes priority)
  const displayError = localError ?? error;

  // ---- validation helpers -------------------------------------------------
  const validate = (): string | null => {
    if (!name.trim()) return "Name is required.";
    if (!username.trim()) return "Username is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  // ---- handlers -----------------------------------------------------------
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const validationMsg = validate();
    if (validationMsg) {
      setLocalError(validationMsg);
      return;
    }

    setIsSubmitting(true);
    const success = onRegister(name.trim(), username.trim(), password);
    if (!success) setIsSubmitting(false);
  };

  // ---- field validity helpers for inline hints ----------------------------
  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // ---- render -------------------------------------------------------------
  return (
    <div className="flex min-h-[540px] items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-sm">
        {/* ---- Header Icon + Title ---- */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25">
            <UserPlus className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
            Start your fitness journey today
          </p>
        </div>

        {/* ---- Error Banner ---- */}
        {displayError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* ---- Form ---- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setLocalError(null);
              }}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-username"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLocalError(null);
              }}
              placeholder="Choose a username"
              className="w-full bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError(null);
                }}
                placeholder="Min. 6 characters"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 ${
                  passwordTooShort
                    ? "border-amber-400 dark:border-amber-500/40"
                    : "border-gray-200/60 dark:border-white/10"
                }`}
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
            {passwordTooShort && (
              <p className="text-xs text-amber-600 dark:text-amber-400 animate-in fade-in duration-200">
                Must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="reg-confirm"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setLocalError(null);
                }}
                placeholder="Re-enter your password"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 ${
                  passwordsMismatch
                    ? "border-red-400 dark:border-red-500/40"
                    : "border-gray-200/60 dark:border-white/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 text-white rounded-xl font-medium text-sm px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0 mt-1"
          >
            {isSubmitting ? (
              <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <UserPlus className="h-4.5 w-4.5" />
            )}
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* ---- Switch to Login ---- */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
