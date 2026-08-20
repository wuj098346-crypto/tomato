import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PomodoroMode, PomodoroSettings } from '../lib/types';

export type PomodoroStatus = 'idle' | 'running' | 'paused';

type UsePomodoroTimerOptions = {
  settings: PomodoroSettings;
  focusText: string;
  initialMode?: PomodoroMode;
  onWorkComplete: (focusText: string, durationMinutes: number) => void;
  notify: (mode: PomodoroMode, focusText: string) => void;
};

function durationForMode(mode: PomodoroMode, settings: PomodoroSettings) {
  return (mode === 'focus' ? settings.workMinutes : settings.shortBreakMinutes) * 60;
}

export function usePomodoroTimer({
  settings,
  focusText,
  initialMode = 'focus',
  onWorkComplete,
  notify,
}: UsePomodoroTimerOptions) {
  const [mode, setMode] = useState<PomodoroMode>(initialMode);
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    durationForMode(initialMode, settings),
  );

  const currentDurationSeconds = useMemo(
    () => durationForMode(mode, settings),
    [mode, settings],
  );

  const completeSession = useCallback(() => {
    const completedMode = mode;
    const nextMode: PomodoroMode = completedMode === 'focus' ? 'break' : 'focus';

    if (completedMode === 'focus') {
      onWorkComplete(focusText, settings.workMinutes);
    }

    notify(completedMode, focusText);
    setMode(nextMode);
    setStatus('idle');
    setSecondsRemaining(durationForMode(nextMode, settings));
  }, [focusText, mode, notify, onWorkComplete, settings]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && secondsRemaining <= 0) {
      completeSession();
    }
  }, [completeSession, secondsRemaining, status]);

  useEffect(() => {
    if (status === 'idle') {
      setSecondsRemaining(currentDurationSeconds);
    }
  }, [currentDurationSeconds, status]);

  const start = useCallback(() => {
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus((value) => (value === 'running' ? 'paused' : value));
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setSecondsRemaining(durationForMode(mode, settings));
  }, [mode, settings]);

  return {
    mode,
    status,
    secondsRemaining,
    start,
    pause,
    reset,
  };
}
