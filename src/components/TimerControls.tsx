import { Pause, Play, RotateCcw } from 'lucide-react';
import type { PomodoroStatus } from '../hooks/usePomodoroTimer';

type TimerControlsProps = {
  status: PomodoroStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function TimerControls({ status, onStart, onPause, onReset }: TimerControlsProps) {
  const isRunning = status === 'running';

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
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
  );
}
