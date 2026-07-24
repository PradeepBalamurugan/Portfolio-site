"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// ---------------------------------------------------------------------------
// CreateModal — Reusable modal for creating new entities
// ---------------------------------------------------------------------------

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  submitText?: string;
  isValid?: boolean;
}

export default function CreateModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Create",
  isValid = true,
}: CreateModalProps) {
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

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit();
  };

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white dark:bg-[#12121a] shadow-2xl animate-in zoom-in-95 fade-in duration-200 focus:outline-none"
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2
            id="create-modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="px-6 py-4">{children}</div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 px-4 py-2 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm px-6 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
