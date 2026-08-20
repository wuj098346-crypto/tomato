import { beforeEach, describe, expect, it } from 'vitest';
import {
  createCompletionRecord,
  defaultStorage,
  loadPomodoroStorage,
  savePomodoroStorage,
  STORAGE_KEY,
} from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns defaults when storage is empty', () => {
    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual(
      defaultStorage('2026-08-20'),
    );
  });

  it('defaults sound reminder to enabled', () => {
    expect(loadPomodoroStorage(new Date(2026, 7, 20)).settings.soundEnabled).toBe(true);
  });

  it('preserves disabled sound reminder from storage', () => {
    savePomodoroStorage({
      settings: { workMinutes: 25, shortBreakMinutes: 5, soundEnabled: false },
      todayKey: '2026-08-20',
      todayCompletedCount: 0,
      recentCompletions: [],
    });

    expect(loadPomodoroStorage(new Date(2026, 7, 20)).settings.soundEnabled).toBe(false);
  });

  it('returns defaults when storage contains invalid data', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');

    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual(
      defaultStorage('2026-08-20'),
    );
  });

  it('resets today count when the local date changes', () => {
    savePomodoroStorage({
      settings: { workMinutes: 30, shortBreakMinutes: 7, soundEnabled: true },
      todayKey: '2026-08-19',
      todayCompletedCount: 4,
      recentCompletions: [
        {
          id: 'a',
          completedAt: '2026-08-19T10:00:00.000Z',
          focusText: '写文档',
          durationMinutes: 30,
        },
      ],
    });

    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual({
      settings: { workMinutes: 30, shortBreakMinutes: 7, soundEnabled: true },
      todayKey: '2026-08-20',
      todayCompletedCount: 0,
      recentCompletions: [
        {
          id: 'a',
          completedAt: '2026-08-19T10:00:00.000Z',
          focusText: '写文档',
          durationMinutes: 30,
        },
      ],
    });
  });

  it('creates a trimmed completion record', () => {
    const record = createCompletionRecord(
      '  读论文  ',
      25,
      new Date('2026-08-20T09:00:00.000Z'),
    );

    expect(record).toMatchObject({
      completedAt: '2026-08-20T09:00:00.000Z',
      focusText: '读论文',
      durationMinutes: 25,
    });
    expect(record.id).toContain('2026-08-20T09:00:00.000Z');
  });
});
