import { useEffect, useState } from 'react';
import { FocusInput } from './components/FocusInput';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsSummary } from './components/StatsSummary';
import { TimerControls } from './components/TimerControls';
import { TimerDisplay } from './components/TimerDisplay';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import { requestNotificationPermission, sendSessionDoneNotification } from './lib/notifications';
import {
  createCompletionRecord,
  loadPomodoroStorage,
  MAX_RECENT_COMPLETIONS,
  savePomodoroStorage,
} from './lib/storage';
import { playSessionDoneSound } from './lib/sound';
import { formatDuration } from './lib/time';
import type { PomodoroSettings, PomodoroStorage } from './lib/types';

export default function App() {
  const [focusText, setFocusText] = useState('');
  const [storageState, setStorageState] = useState<PomodoroStorage>(() => loadPomodoroStorage());

  useEffect(() => {
    savePomodoroStorage(storageState);
  }, [storageState]);

  const updateSettings = (settings: PomodoroSettings) => {
    setStorageState((value) => ({
      ...value,
      settings,
    }));
  };

  const handleWorkComplete = (completedFocusText: string, durationMinutes: number) => {
    const record = createCompletionRecord(completedFocusText, durationMinutes);

    setStorageState((value) => ({
      ...value,
      todayCompletedCount: value.todayCompletedCount + 1,
      recentCompletions: [record, ...value.recentCompletions].slice(0, MAX_RECENT_COMPLETIONS),
    }));
  };

  const timer = usePomodoroTimer({
    settings: storageState.settings,
    focusText,
    onWorkComplete: handleWorkComplete,
    notify: (mode, completedFocusText) => {
      sendSessionDoneNotification(mode, completedFocusText);

      if (storageState.settings.soundEnabled) {
        playSessionDoneSound();
      }
    },
  });

  const handleStart = () => {
    void requestNotificationPermission();
    timer.start();
  };

  useEffect(() => {
    const modeIcon = timer.mode === 'focus' ? '🍅' : '☕';
    document.title = `${modeIcon} ${formatDuration(timer.secondsRemaining)}`;
  }, [timer.mode, timer.secondsRemaining]);

  return (
    <main className="min-h-screen bg-[#f8f7f2] px-4 py-8 text-[#17211b]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">
        <div className="w-full rounded-lg border border-[#d8dfd0] bg-white/82 p-6 shadow-sm sm:p-8">
          <TimerDisplay mode={timer.mode} secondsRemaining={timer.secondsRemaining} />
          <TimerControls
            status={timer.status}
            onStart={handleStart}
            onPause={timer.pause}
            onReset={timer.reset}
          />
          <StatsSummary todayCompletedCount={storageState.todayCompletedCount} />
          <FocusInput value={focusText} onChange={setFocusText} />
          <SettingsPanel settings={storageState.settings} onChange={updateSettings} />
        </div>
      </section>
    </main>
  );
}
