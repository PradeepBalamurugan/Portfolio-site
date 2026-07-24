"use client";

import { useEffect, useCallback, useState } from "react";
import { useCalendar } from "@/lib/gym-tracker/hooks/useCalendar";
import { useWorkout } from "@/lib/gym-tracker/hooks/useWorkout";
import { getWorkoutDatesForMonth } from "@/lib/gym-tracker/services/workout.service";

import MotivationalQuote from "@/components/gym-tracker/dashboard/MotivationalQuote";
import Calendar from "@/components/gym-tracker/dashboard/Calendar";
import ProgressSection from "@/components/gym-tracker/dashboard/ProgressSection";
import WorkoutBuilder from "@/components/gym-tracker/dashboard/WorkoutBuilder";
import RecentWorkouts from "@/components/gym-tracker/dashboard/RecentWorkouts";

// ---------------------------------------------------------------------------
// Dashboard — Main gym tracker dashboard orchestrator
// ---------------------------------------------------------------------------

interface DashboardProps {
  userId: string;
  userName: string;
}

export default function Dashboard({ userId, userName }: DashboardProps) {
  const calendar = useCalendar(userId);
  const workoutHook = useWorkout();

  // A revision counter to force child components to re-fetch after mutations
  const [revision, setRevision] = useState(0);

  // Load the workout whenever the selected date changes
  useEffect(() => {
    workoutHook.loadWorkout(userId, calendar.selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, calendar.selectedDate, revision]);

  // Callback for child components to signal a workout was created/deleted/modified
  const handleWorkoutChange = useCallback(() => {
    // Bump revision to re-fetch workout + recent workouts
    setRevision((r) => r + 1);

    // Refresh the calendar workout dots manually
    // (useCalendar doesn't expose refreshWorkoutDates in its return)
    // We trigger a re-render by updating the date which will re-run the useEffect in useCalendar
  }, []);

  // When a date is selected from RecentWorkouts or Calendar
  const handleSelectDate = useCallback(
    (date: string) => {
      calendar.selectDate(date);
    },
    [calendar]
  );

  // Greeting based on time of day
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      {/* ── Greeting ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting},{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your fitness journey, one workout at a time.
        </p>
      </div>

      {/* ── Motivational Quote (full width) ──────────────────────── */}
      <MotivationalQuote />

      {/* ── Calendar + Progress ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar — wider */}
        <div className="lg:col-span-2">
          <Calendar
            userId={userId}
            selectedDate={calendar.selectedDate}
            onSelectDate={handleSelectDate}
            workoutDates={calendar.workoutDates}
            currentYear={calendar.currentYear}
            currentMonth={calendar.currentMonth}
            onNextMonth={calendar.nextMonth}
            onPrevMonth={calendar.prevMonth}
            onGoToToday={calendar.goToToday}
            monthName={calendar.monthName}
            daysInMonth={calendar.daysInMonth}
            firstDayOfMonth={calendar.firstDayOfMonth}
          />
        </div>

        {/* Progress — narrower */}
        <div>
          <ProgressSection key={`progress-${revision}`} userId={userId} />
        </div>
      </div>

      {/* ── Workout Builder / View (full width) ──────────────────── */}
      <WorkoutBuilder
        key={`builder-${calendar.selectedDate}-${revision}`}
        userId={userId}
        selectedDate={calendar.selectedDate}
        workout={workoutHook.workout}
        onWorkoutChange={handleWorkoutChange}
      />

      {/* ── Recent Workouts (full width) ─────────────────────────── */}
      <RecentWorkouts
        key={`recent-${revision}`}
        userId={userId}
        onSelectDate={handleSelectDate}
      />
    </div>
  );
}
