import { clampMinutes, getTodayKey } from './time';
import type { CompletionRecord, PomodoroStorage } from './types';

export const STORAGE_KEY = 'tomato:pomodoro-storage:v1';
export const MAX_RECENT_COMPLETIONS = 20;

export function defaultStorage(todayKey = getTodayKey()): PomodoroStorage {
  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
    },
    todayKey,
    todayCompletedCount: 0,
    recentCompletions: [],
  };
}

export function loadPomodoroStorage(date = new Date()): PomodoroStorage {
  const todayKey = getTodayKey(date);

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return defaultStorage(todayKey);
    }

    const parsed = JSON.parse(rawValue) as Partial<PomodoroStorage>;
    const normalized: PomodoroStorage = {
      settings: {
        workMinutes: clampMinutes(Number(parsed.settings?.workMinutes), 1, 120),
        shortBreakMinutes: clampMinutes(Number(parsed.settings?.shortBreakMinutes), 1, 60),
      },
      todayKey: typeof parsed.todayKey === 'string' ? parsed.todayKey : todayKey,
      todayCompletedCount: Number.isFinite(parsed.todayCompletedCount)
        ? Math.max(0, Math.floor(Number(parsed.todayCompletedCount)))
        : 0,
      recentCompletions: Array.isArray(parsed.recentCompletions)
        ? parsed.recentCompletions.filter(isCompletionRecord).slice(0, MAX_RECENT_COMPLETIONS)
        : [],
    };

    if (normalized.todayKey !== todayKey) {
      return {
        ...normalized,
        todayKey,
        todayCompletedCount: 0,
      };
    }

    return normalized;
  } catch {
    return defaultStorage(todayKey);
  }
}

export function savePomodoroStorage(value: PomodoroStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function createCompletionRecord(
  focusText: string,
  durationMinutes: number,
  completedAt = new Date(),
): CompletionRecord {
  const isoTime = completedAt.toISOString();

  return {
    id: `${isoTime}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: isoTime,
    focusText: focusText.trim(),
    durationMinutes,
  };
}

function isCompletionRecord(value: unknown): value is CompletionRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as CompletionRecord;

  return (
    typeof record.id === 'string' &&
    typeof record.completedAt === 'string' &&
    typeof record.focusText === 'string' &&
    Number.isFinite(record.durationMinutes)
  );
}
