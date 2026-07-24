"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Equal, Minus } from "lucide-react";
import type { ID } from "@/lib/gym-tracker/types";
import { useComparison } from "@/lib/gym-tracker/hooks/useComparison";
import { getMetricById } from "@/lib/gym-tracker/services/metric.service";

// ---------------------------------------------------------------------------
// PreviousComparison — Shows previous value & live diff for a metric
// ---------------------------------------------------------------------------

interface PreviousComparisonProps {
  metricId: string;
  currentValue: number;
  setNumber: number;
  userId: string;
  exerciseId: string;
  currentDate: string;
}

export default function PreviousComparison({
  metricId,
  currentValue,
  setNumber,
  userId,
  exerciseId,
  currentDate,
}: PreviousComparisonProps) {
  const { compareMetric, getPreviousSetValue } = useComparison(
    userId,
    exerciseId,
    currentDate
  );

  const metric = useMemo(() => getMetricById(metricId), [metricId]);
  const previousValue = getPreviousSetValue(metricId, setNumber);
  const comparison = compareMetric(metricId, currentValue, setNumber);

  if (previousValue === null) {
    return (
      <span className="text-[11px] text-gray-400 dark:text-gray-500 italic leading-none">
        No previous data
      </span>
    );
  }

  const unit = metric?.unit ?? "";

  return (
    <div className="flex items-center gap-1.5 transition-all duration-300 ease-out">
      {/* Previous value */}
      <span className="text-[11px] text-gray-400 dark:text-gray-500 leading-none">
        Prev: {previousValue}
        {unit ? ` ${unit}` : ""}
      </span>

      {/* Live diff */}
      {comparison && (
        <span
          className={`
            inline-flex items-center gap-0.5 text-[11px] font-medium leading-none transition-all duration-300
            ${
              comparison.result === "improved"
                ? "text-emerald-600 dark:text-emerald-400"
                : comparison.result === "declined"
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-400 dark:text-gray-500"
            }
          `}
        >
          {comparison.result === "improved" && (
            <>
              <TrendingUp className="h-3 w-3" />
              +{comparison.difference.toFixed(comparison.difference % 1 === 0 ? 0 : 1)}
            </>
          )}
          {comparison.result === "declined" && (
            <>
              <TrendingDown className="h-3 w-3" />
              {comparison.difference.toFixed(comparison.difference % 1 === 0 ? 0 : 1)}
            </>
          )}
          {comparison.result === "same" && (
            <>
              <Equal className="h-3 w-3" />
              =
            </>
          )}
        </span>
      )}
    </div>
  );
}
