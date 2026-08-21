import { Pause, Play, RotateCcw } from 'lucide-react';
import type { PomodoroStatus } from '../hooks/usePomodoroTimer';
import type { PomodoroMode } from '../lib/types';

type TimerControlsProps = {
  mode: PomodoroMode;
  status: PomodoroStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onModeChange: (mode: PomodoroMode) => void;
};

export function TimerControls({
  mode,
  status,
  onStart,
  onPause,
  onReset,
  onModeChange,
}: TimerControlsProps) {
  const isRunning = status === 'running';

  return (
    <div className="mt-8 space-y-4">
      <div
        className="mx-auto flex w-fit rounded-md border border-[#d8dfd0] bg-[#f5f7f2] p-1"
        aria-label="计时模式"
      >
        <button
          type="button"
          onClick={() => onModeChange('focus')}
          aria-pressed={mode === 'focus'}
          className={`rounded px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#4f7d5a] focus:ring-offset-1 ${
            mode === 'focus' ? 'bg-[#d94535] text-white shadow-sm' : 'text-[#526055] hover:bg-white'
          }`}
        >
          🍅 专注
        </button>
        <button
          type="button"
          onClick={() => onModeChange('break')}
          aria-pressed={mode === 'break'}
          className={`rounded px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#4f7d5a] focus:ring-offset-1 ${
            mode === 'break' ? 'bg-[#4f7d5a] text-white shadow-sm' : 'text-[#526055] hover:bg-white'
          }`}
        >
          ☕ 休息
        </button>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={isRunning ? onPause : onStart}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[#d94535] px-5 font-semibold text-white shadow-sm transition hover:bg-[#c83d2f] focus:outline-none focus:ring-2 focus:ring-[#d94535] focus:ring-offset-2"
        >
          {isRunning ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
          {isRunning ? '暂停' : '开始'}
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="重置"
          title="重置"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-[#cfd8c5] bg-white text-[#314136] shadow-sm transition hover:bg-[#eef2ea] focus:outline-none focus:ring-2 focus:ring-[#4f7d5a] focus:ring-offset-2"
        >
          <RotateCcw aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
