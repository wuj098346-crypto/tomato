import { describe, expect, it } from 'vitest';
import { clampMinutes, formatDuration, getTodayKey } from './time';

describe('formatDuration', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(1500)).toBe('25:00');
  });
});

describe('getTodayKey', () => {
  it('uses the local yyyy-mm-dd date', () => {
    expect(getTodayKey(new Date(2026, 7, 20, 9, 30))).toBe('2026-08-20');
  });
});

describe('clampMinutes', () => {
  it('keeps values inside the provided range', () => {
    expect(clampMinutes(25, 1, 120)).toBe(25);
    expect(clampMinutes(-3, 1, 120)).toBe(1);
    expect(clampMinutes(999, 1, 120)).toBe(120);
    expect(clampMinutes(Number.NaN, 1, 120)).toBe(1);
  });
});
