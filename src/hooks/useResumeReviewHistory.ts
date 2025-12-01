'use client';

import { useCallback, useEffect, useState } from "react";
import type { ResumeReviewHistoryEntry } from "@/types/AiReview";

const STORAGE_KEY = "resumeReviewHistory:v1";
const HISTORY_LIMIT = 10;

type HistoryStateUpdater =
  | ResumeReviewHistoryEntry[]
  | ((prev: ResumeReviewHistoryEntry[]) => ResumeReviewHistoryEntry[]);

const safeParse = (value: string | null) => {
  if (!value) return [] as ResumeReviewHistoryEntry[];
  try {
    const parsed = JSON.parse(value) as ResumeReviewHistoryEntry[];
    if (!Array.isArray(parsed)) return [] as ResumeReviewHistoryEntry[];
    return parsed
      .filter(item => typeof item?.id === "string")
      .map(item => ({
        ...item,
        tone: item.tone ?? "keigo",
        language: item.language ?? "ja",
        writingStyle: item.writingStyle ?? "formal",
        honorific: item.honorific ?? "standard",
        audience: item.audience ?? "external",
      }))
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [] as ResumeReviewHistoryEntry[];
  }
};

export function useResumeReviewHistory() {
  const [history, setHistory] = useState<ResumeReviewHistoryEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHistory(safeParse(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  const persist = useCallback((updater: HistoryStateUpdater, options?: { persist?: boolean }) => {
    setHistory(prev => {
      const updated = typeof updater === "function"
        ? (updater as (state: ResumeReviewHistoryEntry[]) => ResumeReviewHistoryEntry[])(prev)
        : updater;

      const normalized = Array.isArray(updated) ? updated : [];
      const next = normalized
        .map(entry => ({
          ...entry,
          tone: entry.tone ?? "keigo",
          language: entry.language ?? "ja",
          writingStyle: entry.writingStyle ?? "formal",
          honorific: entry.honorific ?? "standard",
          audience: entry.audience ?? "external",
        }))
        .slice(0, HISTORY_LIMIT);

      if (options?.persist !== false && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }

      return next;
    });
  }, []);

  const addEntry = useCallback((entry: ResumeReviewHistoryEntry) => {
    persist(prev => {
      const deduplicated = prev.filter(item => item.id !== entry.id);
      return [entry, ...deduplicated];
    });
  }, [persist]);

  const removeEntry = useCallback((id: string) => {
    persist(prev => prev.filter(item => item.id !== id));
  }, [persist]);

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  const replaceHistory = useCallback((entries: ResumeReviewHistoryEntry[], options?: { persist?: boolean }) => {
    persist(entries, options);
  }, [persist]);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
    replaceHistory,
  };
}

export default useResumeReviewHistory;
