// ---------------------------------------------------------------------------
// Gym Tracker — useCalendar Hook
// Manages calendar state: current month, selected date, workout dates.
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DateString, ID } from "../types";
import * as workoutService from "../services/workout.service";
import { today as getToday } from "../store";

interface UseCalendarReturn {
  currentYear: number;
  currentMonth: number;
  selectedDate: DateString;
  workoutDates: DateString[];
  selectDate: (date: DateString) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToToday: () => void;
  daysInMonth: number;
  firstDayOfMonth: number;
  isToday: (date: DateString) => boolean;
  isFutureDate: (date: DateString) => boolean;
  isSelectedDate: (date: DateString) => boolean;
  hasWorkout: (date: DateString) => boolean;
  monthName: string;
}

export function useCalendar(userId: ID | undefined): UseCalendarReturn {
  const todayStr = getToday();
  const todayDate = new Date(todayStr + "T00:00:00");

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<DateString>(todayStr);
  const [workoutDates, setWorkoutDates] = useState<DateString[]>([]);

  // Load workout dates for the current month
  useEffect(() => {
    if (!userId) return;
    const dates = workoutService.getWorkoutDatesForMonth(userId, currentYear, currentMonth);
    setWorkoutDates(dates);
  }, [userId, currentYear, currentMonth]);

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );

  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentYear, currentMonth]
  );

  const monthName = useMemo(
    () =>
      new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
      }),
    [currentYear, currentMonth]
  );

  const selectDate = useCallback((date: DateString) => {
    setSelectedDate(date);
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDate(getToday());
  }, []);

  const isToday = useCallback(
    (date: DateString) => date === todayStr,
    [todayStr]
  );

  const isFutureDate = useCallback(
    (date: DateString) => date > todayStr,
    [todayStr]
  );

  const isSelectedDate = useCallback(
    (date: DateString) => date === selectedDate,
    [selectedDate]
  );

  const hasWorkout = useCallback(
    (date: DateString) => workoutDates.includes(date),
    [workoutDates]
  );

  /**
   * Refresh workout dates for the current month.
   * Call this after creating/deleting a workout.
   */
  const refreshWorkoutDates = useCallback(() => {
    if (!userId) return;
    const dates = workoutService.getWorkoutDatesForMonth(userId, currentYear, currentMonth);
    setWorkoutDates(dates);
  }, [userId, currentYear, currentMonth]);

  return {
    currentYear,
    currentMonth,
    selectedDate,
    workoutDates,
    selectDate,
    nextMonth,
    prevMonth,
    goToToday,
    daysInMonth,
    firstDayOfMonth,
    isToday,
    isFutureDate,
    isSelectedDate,
    hasWorkout,
    monthName,
  };
}
