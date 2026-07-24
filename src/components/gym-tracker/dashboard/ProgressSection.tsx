"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  CalendarDays,
  TrendingUp,
  Flame,
  Loader2,
} from "lucide-react";
import { getProgressStats } from "@/lib/gym-tracker/services/workout.service";

// ---------------------------------------------------------------------------
// ProgressSection — Grid of stat cards for user progress
// ---------------------------------------------------------------------------

interface ProgressSectionProps {
  userId: string;
}

interface Stats {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  currentStreak: number;
}

const STAT_CARDS: {
  key: keyof Stats;
  label: string;
  suffix?: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
}[] = [
  {
    key: "totalWorkouts",
    label: "Total Workouts",
    icon: Trophy,
    gradient:
      "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "thisWeekWorkouts",
    label: "This Week",
    icon: CalendarDays,
    gradient:
      "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "thisMonthWorkouts",
    label: "This Month",
    icon: TrendingUp,
    gradient:
      "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "currentStreak",
    label: "Current Streak",
    suffix: "days",
    icon: Flame,
    gradient:
      "from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

export default function ProgressSection({ userId }: ProgressSectionProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data = getProgressStats(userId);
    setStats({
      totalWorkouts: data.totalWorkouts,
      thisWeekWorkouts: data.thisWeekWorkouts,
      thisMonthWorkouts: data.thisMonthWorkouts,
      currentStreak: data.currentStreak,
    });
    setIsLoading(false);
  }, [userId]);

  if (isLoading || !stats) {
    return (
      <div className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {STAT_CARDS.map(({ key, label, suffix, icon: Icon, gradient, iconColor }) => (
        <div
          key={key}
          className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-4 hover:border-gray-300/60 dark:hover:border-white/10 transition-all duration-300"
        >
          {/* Icon with gradient bg */}
          <div
            className={`inline-flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} mb-3`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
            {stats[key]}
            {suffix && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
                {suffix}
              </span>
            )}
          </p>

          {/* Label */}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
