"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, TriangleAlert } from "lucide-react";

// ---------------------------------------------------------------------------
// ConfirmDialog — Reusable confirmation modal for destructive actions
// ---------------------------------------------------------------------------

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  details?: string[];
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  details,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ── Escape key handler ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Focus the dialog on open for accessibility
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  const IconComponent = isDanger ? AlertTriangle : TriangleAlert;
  const iconBg = isDanger
    ? "bg-red-100 dark:bg-red-500/10"
    : "bg-amber-100 dark:bg-amber-500/10";
  const iconColor = isDanger
    ? "text-red-600 dark:text-red-400"
    : "text-amber-600 dark:text-amber-400";
  const confirmBg = isDanger
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500/40"
    : "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/40";

  return createPortal(
    // ── Overlay ─────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* ── Dialog ──────────────────────────────────────────────────────── */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white dark:bg-[#12121a] shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200 focus:outline-none"
      >
        {/* Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${iconBg}`}
          >
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h2
            id="confirm-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        <p
          id="confirm-desc"
          className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed"
        >
          {description}
        </p>

        {/* Detail items */}
        {details && details.length > 0 && (
          <ul className="mb-5 space-y-1.5 pl-1">
            {details.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 px-4 py-2 transition-colors duration-150"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${confirmBg} text-white rounded-xl font-medium text-sm px-5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
