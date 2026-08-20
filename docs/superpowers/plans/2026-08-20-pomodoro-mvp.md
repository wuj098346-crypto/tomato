# 番茄钟 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 React + TypeScript + Vite + Tailwind CSS 的番茄钟 MVP，支持专注/短休息倒计时、可选专注事项、浏览器通知、今日完成统计和 LocalStorage 持久化。

**Architecture:** 使用小而清晰的 React 结构：纯工具函数负责时间、日期、存储和通知；`usePomodoroTimer` 负责计时状态机；组件只负责展示和用户输入。先实现可测试的核心逻辑，再接入界面和样式。

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest, Testing Library, LocalStorage, browser Notification API, lucide-react.

---

## 文件结构

- `package.json`：脚本和依赖。
- `index.html`：Vite HTML 入口。
- `vite.config.ts`：Vite、React、Tailwind、Vitest 配置。
- `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`：TypeScript 配置。
- `src/main.tsx`：React 挂载入口。
- `src/index.css`：Tailwind 入口和全局样式。
- `src/App.tsx`：应用状态整合和主界面布局。
- `src/components/TimerDisplay.tsx`：展示模式和剩余时间。
- `src/components/TimerControls.tsx`：开始、暂停、重置按钮。
- `src/components/FocusInput.tsx`：可选专注事项输入框。
- `src/components/StatsSummary.tsx`：今日完成数展示。
- `src/components/SettingsPanel.tsx`：专注/短休息时长设置。
- `src/hooks/usePomodoroTimer.ts`：计时状态机。
- `src/lib/types.ts`：共享类型。
- `src/lib/time.ts`：时间格式、日期 key、分钟限制。
- `src/lib/storage.ts`：LocalStorage 读写和数据恢复。
- `src/lib/notifications.ts`：通知权限请求和通知发送。
- `src/test/setup.ts`：测试环境设置。
- `src/**/*.test.ts`、`src/**/*.test.tsx`：单元和组件测试。

---

### Task 1: 创建基础工程和测试环境

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: 初始化 git 仓库**

Run:

```bash
git init
```

Expected: 输出 `Initialized empty Git repository`，并在当前目录生成 `.git`。

- [ ] **Step 2: 创建 `package.json`**

Create `package.json`:

```json
{
  "name": "tomato",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "tsc -b --noEmit"
  }
}
```

- [ ] **Step 3: 安装运行和开发依赖**

Run:

```bash
npm install react react-dom lucide-react
npm install -D vite typescript @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/react @types/react-dom tailwindcss @tailwindcss/vite
```

Expected: 命令退出码为 0，生成 `node_modules` 和 `package-lock.json`。

- [ ] **Step 4: 创建 Vite、TypeScript 和测试配置**

Create `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: 创建最小页面入口**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>番茄钟</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/index.css`:

```css
@import "tailwindcss";

:root {
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #17211b;
  background: #f8f7f2;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
input {
  font: inherit;
}
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] px-4 py-8 text-[#17211b]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center">
        <p className="text-sm font-medium text-[#5f6f52]">番茄钟</p>
        <h1 className="mt-3 text-4xl font-semibold">25:00</h1>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: 运行基础校验**

Run:

```bash
npm run lint
npm run test:run
npm run build
```

Expected: `lint` 和 `build` 退出码为 0；`test:run` 允许输出 `No test files found` 或退出码为 0，因为测试文件将在后续任务创建。

- [ ] **Step 7: 提交基础工程**

Run:

```bash
git add .
git commit -m "chore: scaffold pomodoro app"
```

Expected: 创建一次包含基础工程文件的提交。

---

### Task 2: 实现时间工具函数

**Files:**
- Create: `src/lib/time.test.ts`
- Create: `src/lib/time.ts`

- [ ] **Step 1: 写失败测试**

Create `src/lib/time.test.ts`:

```ts
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
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```bash
npm run test:run -- src/lib/time.test.ts
```

Expected: FAIL，错误包含 `Failed to resolve import "./time"`。

- [ ] **Step 3: 写最小实现**

Create `src/lib/time.ts`:

```ts
export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function clampMinutes(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(value)));
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```bash
npm run test:run -- src/lib/time.test.ts
```

Expected: PASS，3 个测试通过。

- [ ] **Step 5: 提交时间工具**

Run:

```bash
git add src/lib/time.ts src/lib/time.test.ts
git commit -m "test: add time utilities"
```

Expected: 创建一次提交。

---

### Task 3: 实现 LocalStorage 数据层

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/storage.test.ts`
- Create: `src/lib/storage.ts`

- [ ] **Step 1: 创建共享类型**

Create `src/lib/types.ts`:

```ts
export type PomodoroMode = 'focus' | 'break';

export type PomodoroSettings = {
  workMinutes: number;
  shortBreakMinutes: number;
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
```

- [ ] **Step 2: 写失败测试**

Create `src/lib/storage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createCompletionRecord,
  defaultStorage,
  loadPomodoroStorage,
  savePomodoroStorage,
  STORAGE_KEY,
} from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns defaults when storage is empty', () => {
    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual(
      defaultStorage('2026-08-20'),
    );
  });

  it('returns defaults when storage contains invalid data', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');

    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual(
      defaultStorage('2026-08-20'),
    );
  });

  it('resets today count when the local date changes', () => {
    savePomodoroStorage({
      settings: { workMinutes: 30, shortBreakMinutes: 7 },
      todayKey: '2026-08-19',
      todayCompletedCount: 4,
      recentCompletions: [
        {
          id: 'a',
          completedAt: '2026-08-19T10:00:00.000Z',
          focusText: '写文档',
          durationMinutes: 30,
        },
      ],
    });

    expect(loadPomodoroStorage(new Date(2026, 7, 20))).toEqual({
      settings: { workMinutes: 30, shortBreakMinutes: 7 },
      todayKey: '2026-08-20',
      todayCompletedCount: 0,
      recentCompletions: [
        {
          id: 'a',
          completedAt: '2026-08-19T10:00:00.000Z',
          focusText: '写文档',
          durationMinutes: 30,
        },
      ],
    });
  });

  it('creates a trimmed completion record', () => {
    const record = createCompletionRecord('  读论文  ', 25, new Date('2026-08-20T09:00:00.000Z'));

    expect(record).toMatchObject({
      completedAt: '2026-08-20T09:00:00.000Z',
      focusText: '读论文',
      durationMinutes: 25,
    });
    expect(record.id).toContain('2026-08-20T09:00:00.000Z');
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

Run:

```bash
npm run test:run -- src/lib/storage.test.ts
```

Expected: FAIL，错误包含 `Failed to resolve import "./storage"`。

- [ ] **Step 4: 写最小实现**

Create `src/lib/storage.ts`:

```ts
import type { CompletionRecord, PomodoroStorage } from './types';
import { clampMinutes, getTodayKey } from './time';

export const STORAGE_KEY = 'tomato:pomodoro-storage:v1';
export const MAX_RECENT_COMPLETIONS = 20;

export function defaultStorage(todayKey = getTodayKey()): PomodoroStorage {
  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
    },
    todayKey,
    todayCompletedCount: 0,
    recentCompletions: [],
  };
}

export function loadPomodoroStorage(date = new Date()): PomodoroStorage {
  const todayKey = getTodayKey(date);

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return defaultStorage(todayKey);
    }

    const parsed = JSON.parse(rawValue) as Partial<PomodoroStorage>;
    const normalized: PomodoroStorage = {
      settings: {
        workMinutes: clampMinutes(Number(parsed.settings?.workMinutes), 1, 120),
        shortBreakMinutes: clampMinutes(Number(parsed.settings?.shortBreakMinutes), 1, 60),
      },
      todayKey: typeof parsed.todayKey === 'string' ? parsed.todayKey : todayKey,
      todayCompletedCount: Number.isFinite(parsed.todayCompletedCount)
        ? Math.max(0, Math.floor(Number(parsed.todayCompletedCount)))
        : 0,
      recentCompletions: Array.isArray(parsed.recentCompletions)
        ? parsed.recentCompletions.filter(isCompletionRecord).slice(0, MAX_RECENT_COMPLETIONS)
        : [],
    };

    if (normalized.todayKey !== todayKey) {
      return {
        ...normalized,
        todayKey,
        todayCompletedCount: 0,
      };
    }

    return normalized;
  } catch {
    return defaultStorage(todayKey);
  }
}

export function savePomodoroStorage(value: PomodoroStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function createCompletionRecord(
  focusText: string,
  durationMinutes: number,
  completedAt = new Date(),
): CompletionRecord {
  const isoTime = completedAt.toISOString();

  return {
    id: `${isoTime}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: isoTime,
    focusText: focusText.trim(),
    durationMinutes,
  };
}

function isCompletionRecord(value: unknown): value is CompletionRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as CompletionRecord;

  return (
    typeof record.id === 'string' &&
    typeof record.completedAt === 'string' &&
    typeof record.focusText === 'string' &&
    Number.isFinite(record.durationMinutes)
  );
}
```

- [ ] **Step 5: 运行测试确认通过**

Run:

```bash
npm run test:run -- src/lib/storage.test.ts
```

Expected: PASS，4 个测试通过。

- [ ] **Step 6: 提交存储层**

Run:

```bash
git add src/lib/types.ts src/lib/storage.ts src/lib/storage.test.ts
git commit -m "test: add pomodoro storage"
```

Expected: 创建一次提交。

---

### Task 4: 实现浏览器通知 helper

**Files:**
- Create: `src/lib/notifications.test.ts`
- Create: `src/lib/notifications.ts`

- [ ] **Step 1: 写失败测试**

Create `src/lib/notifications.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  requestNotificationPermission,
  sendSessionDoneNotification,
} from './notifications';

describe('notifications', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports unsupported browsers without throwing', async () => {
    vi.stubGlobal('Notification', undefined);

    await expect(requestNotificationPermission()).resolves.toBe('unsupported');
    expect(sendSessionDoneNotification('focus')).toBe(false);
  });

  it('sends focus completion notification when permission is granted', () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'granted' }));

    expect(sendSessionDoneNotification('focus', '写计划')).toBe(true);
    expect(NotificationMock).toHaveBeenCalledWith('专注完成', {
      body: '写计划完成了，休息一下吧。',
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```bash
npm run test:run -- src/lib/notifications.test.ts
```

Expected: FAIL，错误包含 `Failed to resolve import "./notifications"`。

- [ ] **Step 3: 写最小实现**

Create `src/lib/notifications.ts`:

```ts
import type { PomodoroMode } from './types';

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!('Notification' in globalThis) || !globalThis.Notification) {
    return 'unsupported';
  }

  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }

  return Notification.permission;
}

export function sendSessionDoneNotification(mode: PomodoroMode, focusText = '') {
  if (!('Notification' in globalThis) || !globalThis.Notification) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const title = mode === 'focus' ? '专注完成' : '休息结束';
  const cleanFocusText = focusText.trim();
  const body =
    mode === 'focus'
      ? `${cleanFocusText || '本次专注'}完成了，休息一下吧。`
      : '可以开始下一次专注了。';

  new Notification(title, { body });
  return true;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```bash
npm run test:run -- src/lib/notifications.test.ts
```

Expected: PASS，2 个测试通过。

- [ ] **Step 5: 提交通知 helper**

Run:

```bash
git add src/lib/notifications.ts src/lib/notifications.test.ts
git commit -m "test: add notification helper"
```

Expected: 创建一次提交。

---

### Task 5: 实现番茄钟计时 hook

**Files:**
- Create: `src/hooks/usePomodoroTimer.test.tsx`
- Create: `src/hooks/usePomodoroTimer.ts`

- [ ] **Step 1: 写失败测试**

Create `src/hooks/usePomodoroTimer.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePomodoroTimer } from './usePomodoroTimer';

const settings = {
  workMinutes: 1,
  shortBreakMinutes: 1,
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
});
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```bash
npm run test:run -- src/hooks/usePomodoroTimer.test.tsx
```

Expected: FAIL，错误包含 `Failed to resolve import "./usePomodoroTimer"`。

- [ ] **Step 3: 写最小实现**

Create `src/hooks/usePomodoroTimer.ts`:

```ts
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

    if (secondsRemaining <= 0) {
      completeSession();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
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
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```bash
npm run test:run -- src/hooks/usePomodoroTimer.test.tsx
```

Expected: PASS，3 个测试通过。

- [ ] **Step 5: 提交计时 hook**

Run:

```bash
git add src/hooks/usePomodoroTimer.ts src/hooks/usePomodoroTimer.test.tsx
git commit -m "test: add pomodoro timer hook"
```

Expected: 创建一次提交。

---

### Task 6: 实现界面组件和应用整合

**Files:**
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/TimerDisplay.tsx`
- Create: `src/components/TimerControls.tsx`
- Create: `src/components/FocusInput.tsx`
- Create: `src/components/StatsSummary.tsx`
- Create: `src/components/SettingsPanel.tsx`

- [ ] **Step 1: 写失败组件测试**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the MVP timer surface', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '25:00' })).toBeInTheDocument();
    expect(screen.getByText('专注中')).toBeInTheDocument();
    expect(screen.getByLabelText('当前专注事项')).toBeInTheDocument();
    expect(screen.getByText('今日完成 0 个番茄')).toBeInTheDocument();
  });

  it('allows optional focus text and duration settings', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('当前专注事项'), '整理需求');
    await user.clear(screen.getByLabelText('专注时长'));
    await user.type(screen.getByLabelText('专注时长'), '30');

    expect(screen.getByLabelText('当前专注事项')).toHaveValue('整理需求');
    expect(screen.getByRole('heading', { name: '30:00' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: FAIL，因为当前 `App` 还没有输入框、统计和设置组件。

- [ ] **Step 3: 实现展示组件**

Create `src/components/TimerDisplay.tsx`:

```tsx
import type { PomodoroMode } from '../lib/types';
import { formatDuration } from '../lib/time';

type TimerDisplayProps = {
  mode: PomodoroMode;
  secondsRemaining: number;
};

export function TimerDisplay({ mode, secondsRemaining }: TimerDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-[#4f7d5a]">{mode === 'focus' ? '专注中' : '休息中'}</p>
      <h1 className="mt-4 text-7xl font-semibold tracking-normal text-[#17211b] sm:text-8xl">
        {formatDuration(secondsRemaining)}
      </h1>
    </div>
  );
}
```

Create `src/components/TimerControls.tsx`:

```tsx
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
```

Create `src/components/FocusInput.tsx`:

```tsx
type FocusInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FocusInput({ value, onChange }: FocusInputProps) {
  return (
    <label className="mt-8 block">
      <span className="text-sm font-medium text-[#526252]">当前专注事项</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby="focus-input-hint"
        className="mt-2 h-12 w-full rounded-md border border-[#cfd8c5] bg-white px-4 text-base text-[#17211b] outline-none transition focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
      />
      <span id="focus-input-hint" className="mt-2 block text-xs text-[#7b8776]">
        可留空
      </span>
    </label>
  );
}
```

Create `src/components/StatsSummary.tsx`:

```tsx
type StatsSummaryProps = {
  todayCompletedCount: number;
};

export function StatsSummary({ todayCompletedCount }: StatsSummaryProps) {
  return (
    <p className="mt-6 text-center text-sm font-medium text-[#526252]">
      今日完成 {todayCompletedCount} 个番茄
    </p>
  );
}
```

Create `src/components/SettingsPanel.tsx`:

```tsx
import type { PomodoroSettings } from '../lib/types';
import { clampMinutes } from '../lib/time';

type SettingsPanelProps = {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
};

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 rounded-md border border-[#d8dfd0] bg-[#fbfaf6] p-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium text-[#526252]">专注时长</span>
        <input
          type="number"
          min={1}
          max={120}
          value={settings.workMinutes}
          onChange={(event) =>
            onChange({
              ...settings,
              workMinutes: clampMinutes(Number(event.target.value), 1, 120),
            })
          }
          className="mt-2 h-11 w-full rounded-md border border-[#cfd8c5] bg-white px-3 text-base outline-none focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[#526252]">短休息时长</span>
        <input
          type="number"
          min={1}
          max={60}
          value={settings.shortBreakMinutes}
          onChange={(event) =>
            onChange({
              ...settings,
              shortBreakMinutes: clampMinutes(Number(event.target.value), 1, 60),
            })
          }
          className="mt-2 h-11 w-full rounded-md border border-[#cfd8c5] bg-white px-3 text-base outline-none focus:border-[#4f7d5a] focus:ring-2 focus:ring-[#4f7d5a]/20"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 4: 整合 `App`**

Modify `src/App.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { FocusInput } from './components/FocusInput';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsSummary } from './components/StatsSummary';
import { TimerControls } from './components/TimerControls';
import { TimerDisplay } from './components/TimerDisplay';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import { requestNotificationPermission, sendSessionDoneNotification } from './lib/notifications';
import {
  MAX_RECENT_COMPLETIONS,
  createCompletionRecord,
  loadPomodoroStorage,
  savePomodoroStorage,
} from './lib/storage';
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
    notify: sendSessionDoneNotification,
  });

  const handleStart = () => {
    void requestNotificationPermission();
    timer.start();
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2] px-4 py-8 text-[#17211b]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col justify-center">
        <div className="rounded-lg border border-[#d8dfd0] bg-white/82 p-6 shadow-sm sm:p-8">
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
```

- [ ] **Step 5: 运行组件测试**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: PASS，2 个测试通过。

- [ ] **Step 6: 运行全量校验**

Run:

```bash
npm run lint
npm run test:run
npm run build
```

Expected: 三个命令退出码均为 0。

- [ ] **Step 7: 提交界面整合**

Run:

```bash
git add src
git commit -m "feat: build pomodoro mvp interface"
```

Expected: 创建一次提交。

---

### Task 7: 浏览器手动验证和收尾

**Files:**
- Modify: `docs/superpowers/specs/2026-08-20-pomodoro-mvp-design.md`

- [ ] **Step 1: 启动本地开发服务器**

Run:

```bash
npm run dev
```

Expected: 输出包含本地地址，例如 `http://127.0.0.1:5173/`。

- [ ] **Step 2: 手动验证 MVP 流程**

Open the local URL and verify:

```text
1. 页面第一屏就是番茄钟界面。
2. 默认显示 25:00 和“专注中”。
3. 专注事项输入框可以留空。
4. 输入“整理需求”后，输入框保持该文本。
5. 点击“开始”后倒计时减少。
6. 点击“暂停”后倒计时停止。
7. 点击重置图标后倒计时回到当前模式默认时长。
8. 修改专注时长为 1 后，倒计时显示 01:00。
9. 修改短休息时长为 1 后，设置值保留。
10. 刷新页面后，设置值仍然保留。
```

- [ ] **Step 3: 验证 1 分钟完成流**

With work duration set to 1 minute:

```text
1. 填写专注事项“整理需求”。
2. 点击“开始”。
3. 等待倒计时结束。
4. 今日完成数从 0 增加到 1。
5. 模式切换为“休息中”。
6. 计时器停在短休息时长，等待用户手动开始。
7. 浏览器允许通知时，看到“专注完成”通知。
```

- [ ] **Step 4: 验证休息完成流**

With short break duration set to 1 minute:

```text
1. 在“休息中”模式点击“开始”。
2. 等待倒计时结束。
3. 模式切换回“专注中”。
4. 今日完成数不增加。
5. 计时器停在专注时长，等待用户手动开始。
6. 浏览器允许通知时，看到“休息结束”通知。
```

- [ ] **Step 5: 更新 spec 状态**

Modify `docs/superpowers/specs/2026-08-20-pomodoro-mvp-design.md` by appending:

```md

## 实现状态

- MVP 已实现。
- 自动化测试已覆盖时间格式、日期 key、设置范围、LocalStorage 恢复、通知 helper、计时状态机和主界面渲染。
- 手动验证已覆盖开始、暂停、重置、可选专注事项、设置持久化、专注完成流和休息完成流。
```

- [ ] **Step 6: 最终校验**

Run:

```bash
npm run lint
npm run test:run
npm run build
```

Expected: 三个命令退出码均为 0。

- [ ] **Step 7: 提交收尾**

Run:

```bash
git add docs/superpowers/specs/2026-08-20-pomodoro-mvp-design.md
git commit -m "docs: record pomodoro mvp verification"
```

Expected: 创建一次提交。

---

## 自检

- Spec 覆盖：计划覆盖了专注/短休息倒计时、开始/暂停/重置、模式显示、可选专注事项、通知、今日完成数、LocalStorage、基础时长设置、异常回退和测试。
- 范围控制：计划没有加入长休息、多任务管理、图表、登录同步、白噪音、主题系统、PWA 或快捷键。
- 类型一致性：`PomodoroSettings`、`CompletionRecord`、`PomodoroStorage`、`PomodoroMode` 在 `types.ts` 定义，并被存储层、通知层、hook 和组件复用。
- 验证路径：每个核心模块都有失败测试、实现、通过测试和提交步骤；最终任务包含浏览器手动验证和全量构建。
