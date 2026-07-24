"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { MetricValue, ID, Metric } from "@/lib/gym-tracker/types";
import { getMetricsByIds } from "@/lib/gym-tracker/services/metric.service";
import PreviousComparison from "./PreviousComparison";

// ---------------------------------------------------------------------------
// DynamicMetricInputs — Renders metric input fields for a single set
// Uses LOCAL state for inputs so typing never loses focus, then debounces
// the save to the parent on blur or after 800ms of inactivity.
// ---------------------------------------------------------------------------

interface DynamicMetricInputsProps {
  metricIds: string[];
  setNumber: number;
  values: MetricValue[];
  onChange: (values: MetricValue[]) => void;
  userId?: string;
  exerciseId?: string;
  currentDate?: string;
}

export default function DynamicMetricInputs({
  metricIds,
  setNumber,
  values,
  onChange,
  userId,
  exerciseId,
  currentDate,
}: DynamicMetricInputsProps) {
  const metrics = useMemo(() => getMetricsByIds(metricIds), [metricIds]);

  // ── Local input state (prevents parent re-renders from stealing focus) ──
  const [localValues, setLocalValues] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>();
    values.forEach((v) => {
      map.set(v.metricId, v.value === 0 ? "" : String(v.value));
    });
    return map;
  });

  // Ref to hold latest localValues for the debounce timer callback
  const localValuesRef = useRef(localValues);
  localValuesRef.current = localValues;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Sync local state when parent values change externally (e.g., add set)
  // but NOT during active typing (tracked via a dirty flag)
  const isDirtyRef = useRef(false);
  useEffect(() => {
    if (isDirtyRef.current) return;
    const map = new Map<string, string>();
    values.forEach((v) => {
      map.set(v.metricId, v.value === 0 ? "" : String(v.value));
    });
    setLocalValues(map);
  }, [values]);

  // Flush local state to parent
  const flushToParent = useCallback(() => {
    const currentLocal = localValuesRef.current;
    const newValues: MetricValue[] = [];
    currentLocal.forEach((raw, metricId) => {
      const num = raw === "" ? 0 : parseFloat(raw);
      newValues.push({ metricId, value: isNaN(num) ? 0 : num });
    });
    // Also include any metric IDs from parent values not yet in local map
    values.forEach((v) => {
      if (!currentLocal.has(v.metricId)) {
        newValues.push(v);
      }
    });
    isDirtyRef.current = false;
    onChangeRef.current(newValues);
  }, [values]);

  const handleValueChange = useCallback(
    (metricId: string, rawValue: string) => {
      isDirtyRef.current = true;
      setLocalValues((prev) => {
        const next = new Map(prev);
        next.set(metricId, rawValue);
        return next;
      });

      // Debounce: save after 800ms of inactivity
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        flushToParent();
      }, 800);
    },
    [flushToParent]
  );

  const handleBlur = useCallback(() => {
    // Flush immediately on blur
    if (debounceRef.current) clearTimeout(debounceRef.current);
    flushToParent();
  }, [flushToParent]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (metrics.length === 0) {
    return (
      <div className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
        No metrics configured
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {metrics.map((metric) => {
        const displayValue = localValues.get(metric.id) ?? "";
        const numericValue =
          displayValue === "" ? 0 : parseFloat(displayValue);
        const isInteger = metric.type === "integer";

        return (
          <div key={metric.id} className="flex-1 min-w-[80px] max-w-[140px]">
            {/* Label */}
            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
              {metric.name}
              <span className="text-gray-400 dark:text-gray-500 font-normal ml-0.5">
                ({metric.unit})
              </span>
            </label>

            {/* Input — controlled by LOCAL state */}
            <input
              type="number"
              value={displayValue}
              onChange={(e) => handleValueChange(metric.id, e.target.value)}
              onBlur={handleBlur}
              step={isInteger ? 1 : 0.1}
              min={0}
              placeholder="0"
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            {/* Previous comparison */}
            {userId && exerciseId && currentDate && (
              <div className="mt-1">
                <PreviousComparison
                  metricId={metric.id}
                  currentValue={numericValue}
                  setNumber={setNumber}
                  userId={userId}
                  exerciseId={exerciseId}
                  currentDate={currentDate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
