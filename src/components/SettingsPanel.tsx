import { useEffect, useState } from 'react';
import { clampMinutes } from '../lib/time';
import type { PomodoroSettings } from '../lib/types';

type SettingsPanelProps = {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
};

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [draftSettings, setDraftSettings] = useState({
    workMinutes: String(settings.workMinutes),
    shortBreakMinutes: String(settings.shortBreakMinutes),
  });

  useEffect(() => {
    setDraftSettings({
      workMinutes: String(settings.workMinutes),
      shortBreakMinutes: String(settings.shortBreakMinutes),
    });
  }, [settings]);

  const handleNumberChange = (
    rawValue: string,
    key: keyof PomodoroSettings,
    min: number,
    max: number,
  ) => {
    setDraftSettings((value) => ({
      ...value,
      [key]: rawValue,
    }));

    if (rawValue === '') {
      return;
    }

    onChange({
      ...settings,
      [key]: clampMinutes(Number(rawValue), min, max),
    });
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 rounded-md border border-[#d8dfd0] bg-[#fbfaf6] p-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium text-[#526252]">专注时长</span>
        <input
          type="number"
          min={1}
          max={120}
          value={draftSettings.workMinutes}
          onChange={(event) => handleNumberChange(event.target.value, 'workMinutes', 1, 120)}
          className="mt-2 h-11 w-full rounded-md border border-[#cfd8c5] bg-white px-3 text-base outline-none focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[#526252]">短休息时长</span>
        <input
          type="number"
          min={1}
          max={60}
          value={draftSettings.shortBreakMinutes}
          onChange={(event) => handleNumberChange(event.target.value, 'shortBreakMinutes', 1, 60)}
          className="mt-2 h-11 w-full rounded-md border border-[#cfd8c5] bg-white px-3 text-base outline-none focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
        />
      </label>
      <label className="flex items-center justify-between gap-4 rounded-md border border-[#d8dfd0] bg-white px-3 py-3 sm:col-span-2">
        <span className="text-sm font-medium text-[#526252]">铃声提醒</span>
        <input
          type="checkbox"
          checked={settings.soundEnabled}
          onChange={(event) =>
            onChange({
              ...settings,
              soundEnabled: event.target.checked,
            })
          }
          className="h-5 w-5 rounded border-[#cfd8c5] text-[#4f7d5a] accent-[#4f7d5a] focus:ring-[#4f7d5a]/20"
        />
      </label>
    </div>
  );
}
