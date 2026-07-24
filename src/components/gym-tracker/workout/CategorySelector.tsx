"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  ArrowLeft,
} from "lucide-react";
import type { WorkoutCategory, CategoryGroup, ID } from "@/lib/gym-tracker/types";
import {
  getCategoriesGrouped,
  searchCategories,
  createCategory,
  getAllCategoryGroups,
} from "@/lib/gym-tracker/services/category.service";
import SearchInput from "@/components/gym-tracker/shared/SearchInput";
import StepIndicator from "@/components/gym-tracker/shared/StepIndicator";

// ---------------------------------------------------------------------------
// CategorySelector — Step 1: choose workout categories
// ---------------------------------------------------------------------------

interface CategorySelectorProps {
  selectedIds?: string[];
  selectedCategoryIds?: string[];
  userId?: string;
  onNext: (ids: string[]) => void;
  onBack?: () => void;
}

export default function CategorySelector({
  selectedIds,
  selectedCategoryIds,
  onNext,
  onBack,
}: CategorySelectorProps) {
  // Support both prop names for flexibility
  const initialIds = selectedCategoryIds ?? selectedIds ?? [];
  // ── State ────────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState("");

  // Create-category form state
  const [newName, setNewName] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [newRequiresMuscle, setNewRequiresMuscle] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const groupedCategories = useMemo(() => getCategoriesGrouped(), []);
  const allGroups = useMemo(() => getAllCategoryGroups(), []);

  const filteredGrouped = useMemo(() => {
    if (!searchQuery.trim()) return groupedCategories;

    const results = searchCategories(searchQuery);
    const resultIds = new Set(results.map((c) => c.id));

    return groupedCategories
      .map((g) => ({
        ...g,
        categories: g.categories.filter((c) => resultIds.has(c.id)),
      }))
      .filter((g) => g.categories.length > 0);
  }, [searchQuery, groupedCategories]);

  const hasNoResults = searchQuery.trim() !== "" && filteredGrouped.length === 0;
  const totalFiltered = filteredGrouped.reduce(
    (sum, g) => sum + g.categories.length,
    0
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleCategory = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  const handleCreate = useCallback(() => {
    setCreateError("");
    if (!newName.trim()) {
      setCreateError("Name is required");
      return;
    }
    if (!newGroupId) {
      setCreateError("Group is required");
      return;
    }

    const result = createCategory(newName, newGroupId, newRequiresMuscle, "system");
    if ("error" in result) {
      setCreateError(result.error);
      return;
    }

    // Auto-select the newly created category
    setSelected((prev) => new Set([...prev, result.id]));
    setNewName("");
    setNewGroupId("");
    setNewRequiresMuscle(false);
    setShowCreateForm(false);

    // Force data refresh by clearing search
    setSearchQuery("");
  }, [newName, newGroupId, newRequiresMuscle]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full">
      {/* Step Indicator */}
      <div className="px-4 pt-4 pb-8">
        <StepIndicator
          currentStep={1}
          totalSteps={2}
          labels={["Categories", "Exercises"]}
        />
      </div>

      {/* Header */}
      <div className="px-4 mb-4 flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Categories
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Choose the workout categories for today
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <SearchInput
          placeholder="Search categories..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Category Groups */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-3">
        {filteredGrouped.map(({ group, categories }) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const selectedInGroup = categories.filter((c) => selected.has(c.id)).length;

          return (
            <div
              key={group.id}
              className="rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300"
            >
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors duration-150"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200" />
                  )}
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {group.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({categories.length})
                  </span>
                </div>
                {selectedInGroup > 0 && (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                    {selectedInGroup} selected
                  </span>
                )}
              </button>

              {/* Category Chips */}
              {!isCollapsed && (
                <div className="px-4 pb-4 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = selected.has(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`
                            relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                            ${
                              isSelected
                                ? "bg-blue-600/10 border-blue-500/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10"
                                : "bg-white/5 border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500/30 hover:bg-blue-500/5"
                            }
                          `}
                        >
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          )}
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* No results */}
        {hasNoResults && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              No categories found for &ldquo;{searchQuery}&rdquo;
            </p>
            {!showCreateForm && (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Category
              </button>
            )}
          </div>
        )}

        {/* Create Category Button (always visible) */}
        {!hasNoResults && !showCreateForm && (
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(true);
              if (searchQuery.trim()) setNewName(searchQuery.trim());
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-300/60 dark:border-white/10 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Category
          </button>
        )}

        {/* Inline Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-blue-500/30 dark:border-blue-500/20 bg-blue-600/5 dark:bg-blue-500/5 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              New Category
            </h3>

            {/* Name */}
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />

            {/* Group dropdown */}
            <select
              value={newGroupId}
              onChange={(e) => setNewGroupId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all appearance-none"
            >
              <option value="">Select group...</option>
              {allGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Requires Muscle Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={newRequiresMuscle}
                onClick={() => setNewRequiresMuscle(!newRequiresMuscle)}
                className={`
                  relative h-5 w-9 rounded-full transition-colors duration-200
                  ${newRequiresMuscle ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-white/15"}
                `}
              >
                <span
                  className={`
                    absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200
                    ${newRequiresMuscle ? "translate-x-4" : "translate-x-0"}
                  `}
                />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requires muscle selection
              </span>
            </label>

            {/* Error */}
            {createError && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {createError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateError("");
                  setNewName("");
                  setNewGroupId("");
                  setNewRequiresMuscle(false);
                }}
                className="border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 px-4 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Bar ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-gray-200/20 dark:border-white/5 z-40">
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => onNext(Array.from(selected))}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {selected.size === 0
            ? "Select categories to continue"
            : `Next (${selected.size} selected)`}
        </button>
      </div>
    </div>
  );
}
