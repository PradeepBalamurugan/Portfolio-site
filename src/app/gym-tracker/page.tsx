// ---------------------------------------------------------------------------
// Gym Tracker — Auth Gate Page
// Displays login/register forms. Redirects to dashboard if authenticated.
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/gym-tracker/hooks/useAuth";
import LoginForm from "@/components/gym-tracker/auth/LoginForm";
import RegisterForm from "@/components/gym-tracker/auth/RegisterForm";
import { Dumbbell } from "lucide-react";

export default function GymTrackerAuthPage() {
  const router = useRouter();
  const { session, isLoading, error, login, register, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/gym-tracker/dashboard");
    }
  }, [session, isLoading, router]);

  const handleSwitchToRegister = () => {
    clearError();
    setMode("register");
  };

  const handleSwitchToLogin = () => {
    clearError();
    setMode("login");
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 gym-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 animate-ping opacity-20" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Already authenticated, waiting for redirect
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Auth form container */}
      <div className="relative w-full max-w-md">
        {mode === "login" ? (
          <LoginForm
            onLogin={login}
            onSwitchToRegister={handleSwitchToRegister}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={register}
            onSwitchToLogin={handleSwitchToLogin}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
