import { formatDuration } from '../lib/time';
import type { PomodoroMode } from '../lib/types';

type TimerDisplayProps = {
  mode: PomodoroMode;
  secondsRemaining: number;
};

export function TimerDisplay({ mode, secondsRemaining }: TimerDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-[#4f7d5a]">
        {mode === 'focus' ? '专注中' : '休息中'}
      </p>
      <h1 className="mt-4 text-7xl font-semibold tracking-normal text-[#17211b] sm:text-8xl">
        {formatDuration(secondsRemaining)}
      </h1>
    </div>
  );
}
