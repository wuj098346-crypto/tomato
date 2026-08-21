import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePomodoroTimer } from './usePomodoroTimer';

const settings = {
  workMinutes: 1,
  shortBreakMinutes: 1,
  soundEnabled: true,
};

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts, pauses, and resets the focus timer', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings,
        focusText: '',
        onWorkComplete: vi.fn(),
        notify: vi.fn(),
      }),
    );

    expect(result.current.secondsRemaining).toBe(60);

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.secondsRemaining).toBe(59);

    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.secondsRemaining).toBe(59);

    act(() => result.current.reset());
    expect(result.current.secondsRemaining).toBe(60);
    expect(result.current.status).toBe('idle');
  });

  it('completes focus, records work, and waits on break mode', () => {
    const onWorkComplete = vi.fn();
    const notify = vi.fn();
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings,
        focusText: '写计划',
        onWorkComplete,
        notify,
      }),
    );

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(61_000));

    expect(result.current.mode).toBe('break');
    expect(result.current.status).toBe('idle');
    expect(result.current.secondsRemaining).toBe(60);
    expect(onWorkComplete).toHaveBeenCalledWith('写计划', 1);
    expect(notify).toHaveBeenCalledWith('focus', '写计划');
  });

  it('completes break and waits on focus mode', () => {
    const notify = vi.fn();
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings,
        focusText: '',
        initialMode: 'break',
        onWorkComplete: vi.fn(),
        notify,
      }),
    );

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(61_000));

    expect(result.current.mode).toBe('focus');
    expect(result.current.status).toBe('idle');
    expect(result.current.secondsRemaining).toBe(60);
    expect(notify).toHaveBeenCalledWith('break', '');
  });

  it('uses elapsed wall-clock time when returning to a backgrounded tab', () => {
    vi.setSystemTime(new Date('2026-08-21T00:00:00Z'));
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings,
        focusText: '',
        onWorkComplete: vi.fn(),
        notify: vi.fn(),
      }),
    );

    act(() => result.current.start());
    act(() => {
      vi.setSystemTime(new Date('2026-08-21T00:00:15Z'));
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current.secondsRemaining).toBe(45);
  });

  it('allows switching modes and resets the timer to the selected mode duration', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings: { ...settings, shortBreakMinutes: 5 },
        focusText: '',
        onWorkComplete: vi.fn(),
        notify: vi.fn(),
      }),
    );

    act(() => result.current.start());
    act(() => result.current.changeMode('break'));

    expect(result.current.mode).toBe('break');
    expect(result.current.status).toBe('idle');
    expect(result.current.secondsRemaining).toBe(300);
  });
});
