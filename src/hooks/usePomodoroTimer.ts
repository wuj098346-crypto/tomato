import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const deadlineRef = useRef<number | null>(null);

  const currentDurationSeconds = useMemo(
    () => durationForMode(mode, settings),
    [mode, settings],
  );

  const completeSession = useCallback(() => {
    deadlineRef.current = null;
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

    const syncRemainingTime = () => {
      if (deadlineRef.current === null) {
        return;
      }

      setSecondsRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
    };

    syncRemainingTime();
    const intervalId = window.setInterval(syncRemainingTime, 1000);
    document.addEventListener('visibilitychange', syncRemainingTime);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', syncRemainingTime);
    };
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
    deadlineRef.current = Date.now() + secondsRemaining * 1000;
    setStatus('running');
  }, [secondsRemaining]);

  const pause = useCallback(() => {
    if (status !== 'running' || deadlineRef.current === null) {
      return;
    }

    setSecondsRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
    deadlineRef.current = null;
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setStatus('idle');
    setSecondsRemaining(durationForMode(mode, settings));
  }, [mode, settings]);

  const changeMode = useCallback(
    (nextMode: PomodoroMode) => {
      deadlineRef.current = null;
      setMode(nextMode);
      setStatus('idle');
      setSecondsRemaining(durationForMode(nextMode, settings));
    },
    [settings],
  );

  return {
    mode,
    status,
    secondsRemaining,
    start,
    pause,
    reset,
    changeMode,
  };
}
