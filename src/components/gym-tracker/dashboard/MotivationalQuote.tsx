"use client";

import { useState, useCallback } from "react";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import { getRandomQuote } from "@/lib/gym-tracker/constants";
import type { Quote } from "@/lib/gym-tracker/types";

// ---------------------------------------------------------------------------
// MotivationalQuote — A self-contained card showing a random motivational quote
// with a refresh button and fade-in animation on quote change.
// ---------------------------------------------------------------------------

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote>(() => getRandomQuote());
  const [isFading, setIsFading] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsFading(true);
    // Wait for fade-out, then swap quote and fade back in
    setTimeout(() => {
      setQuote((prev) => getRandomQuote(prev.text));
      setIsFading(false);
    }, 250);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-purple-600/10 dark:from-blue-500/10 dark:via-violet-500/10 dark:to-purple-500/10 border border-blue-500/20 dark:border-blue-500/10 rounded-2xl p-6">
      {/* Decorative quote icon */}
      <QuoteIcon className="absolute top-4 left-4 h-10 w-10 text-blue-600/10 dark:text-blue-400/10" />

      {/* Quote content */}
      <div
        className={`relative z-10 ml-8 mr-8 transition-opacity duration-250 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-lg font-medium italic text-gray-800 dark:text-gray-200 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
          — {quote.author}
        </p>
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        disabled={isFading}
        aria-label="New quote"
        className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/10 transition-all duration-200 disabled:opacity-40"
      >
        <RefreshCw
          className={`h-4 w-4 ${isFading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}
