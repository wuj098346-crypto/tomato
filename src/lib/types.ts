export type PomodoroMode = 'focus' | 'break';

export type PomodoroSettings = {
  workMinutes: number;
  shortBreakMinutes: number;
  soundEnabled: boolean;
};

export type CompletionRecord = {
  id: string;
  completedAt: string;
  focusText: string;
  durationMinutes: number;
};

export type PomodoroStorage = {
  settings: PomodoroSettings;
  todayKey: string;
  todayCompletedCount: number;
  recentCompletions: CompletionRecord[];
};
