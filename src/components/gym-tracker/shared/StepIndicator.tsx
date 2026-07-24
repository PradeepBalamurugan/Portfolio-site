"use client";

import { Check } from "lucide-react";

// ---------------------------------------------------------------------------
// StepIndicator — Visual step progress bar
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isFuture = stepNum > currentStep;

          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              {/* ── Step circle + label ────────────────────────────────── */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : isActive
                          ? "bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-600/20 dark:ring-blue-500/20"
                          : "border-2 border-gray-300 dark:border-white/15 text-gray-400 dark:text-gray-500 bg-transparent"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNum
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    absolute -bottom-6 whitespace-nowrap text-xs font-medium transition-colors duration-200
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isCompleted
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                >
                  {labels[i] ?? `Step ${stepNum}`}
                </span>
              </div>

              {/* ── Connecting line ────────────────────────────────────── */}
              {stepNum < totalSteps && (
                <div className="flex-1 mx-2">
                  <div
                    className={`
                      h-0.5 w-full rounded-full transition-colors duration-300
                      ${
                        isCompleted
                          ? "bg-blue-600 dark:bg-blue-500"
                          : isFuture
                            ? "bg-gray-200 dark:bg-white/10"
                            : "bg-gray-200 dark:bg-white/10"
                      }
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
