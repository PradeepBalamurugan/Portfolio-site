// ---------------------------------------------------------------------------
// Gym Tracker — Dashboard Page
// Protected page. Redirects to auth if not logged in.
// Renders the main Dashboard component with GymNavbar.
// ---------------------------------------------------------------------------

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/gym-tracker/hooks/useAuth";
import GymNavbar from "@/components/gym-tracker/shared/GymNavbar";
import Dashboard from "@/components/gym-tracker/dashboard/Dashboard";
import { Dumbbell } from "lucide-react";

export default function GymTrackerDashboardPage() {
  const router = useRouter();
  const { session, isLoading, logout } = useAuth();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/gym-tracker");
    }
  }, [session, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.replace("/gym-tracker");
  };

  // Loading state
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated, waiting for redirect
  if (!session) {
    return null;
  }

  return (
    <>
      <GymNavbar userName={session.name} onLogout={handleLogout} />
      <main className="pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Dashboard userId={session.userId} userName={session.name} />
        </div>
      </main>
    </>
  );
}
