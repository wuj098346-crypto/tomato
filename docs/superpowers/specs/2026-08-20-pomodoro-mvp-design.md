# 番茄钟 MVP 设计

## 目标

使用 React、TypeScript、Vite、Tailwind CSS、浏览器 Notification API 和 LocalStorage 构建一个小而可用的番茄钟应用。

第一版要帮助用户快速开始一次专注，允许用户选择性填写当前专注事项，在计时结束时收到通知，并看到今天已经完成的番茄数量。

## MVP 范围

第一版包含：

- 专注和短休息两种倒计时模式。
- 开始、暂停、重置控制。
- 清晰展示当前模式：专注中或休息中。
- 可选的当前专注事项输入框，用户可以留空。
- 专注或休息结束时发送浏览器通知。
- 展示今日已完成番茄数。
- 使用 LocalStorage 保存计时设置、今日统计和最近完成记录。
- 提供基础设置：专注时长和短休息时长。

默认时长：

- 专注：25 分钟。
- 短休息：5 分钟。

## 暂不包含

第一版不做：

- 长休息。
- 多任务管理。
- 图表或详细统计。
- 登录账号或云同步。
- 白噪音或声音包。
- 主题系统。
- PWA 安装流程。
- 快捷键。

## 用户体验

打开后第一屏就是可用的应用，不做落地页。

主界面包含：

- 大号倒计时。
- 当前模式标签。
- 开始或暂停按钮。
- 重置按钮。
- 可选专注事项输入框。
- 今日已完成番茄数。
- 紧凑的时长设置。

专注事项输入框保持轻量。填写时，它会作为当前专注的说明；不填写时，也不影响开始计时。

当一次专注倒计时归零：

- 今日已完成番茄数加一。
- 保存一条完成记录，包含完成时间、专注事项文本和本次专注时长。
- 如果浏览器权限允许，发送通知。
- 切换到短休息模式。
- 等待用户手动开始休息。

当一次休息倒计时归零：

- 如果浏览器权限允许，发送通知。
- 切换回专注模式。
- 等待用户手动开始下一次专注。

## 架构

使用简单的 React 组件结构：

- `App`：持有应用级状态和整体布局。
- `TimerDisplay`：展示模式和剩余时间。
- `TimerControls`：展示开始、暂停和重置控制。
- `FocusInput`：编辑可选的当前专注事项。
- `StatsSummary`：展示今日已完成数量。
- `SettingsPanel`：编辑专注和短休息时长。

核心逻辑尽量放在展示组件之外：

- `usePomodoroTimer`：负责计时状态、倒计时、模式切换、开始、暂停和重置。
- `storage`：负责 LocalStorage 读写。
- `notifications`：负责通知权限请求和通知发送。

## 数据模型

LocalStorage 保存一个应用状态对象：

```ts
type PomodoroSettings = {
  workMinutes: number;
  shortBreakMinutes: number;
};

type CompletionRecord = {
  id: string;
  completedAt: string;
  focusText: string;
  durationMinutes: number;
};

type PomodoroStorage = {
  settings: PomodoroSettings;
  todayKey: string;
  todayCompletedCount: number;
  recentCompletions: CompletionRecord[];
};
```

`todayKey` 使用用户本地日期，格式为 `YYYY-MM-DD`。如果已保存的日期和当前本地日期不同，应用会重置今日计数，但保留最近完成记录。

## 异常处理

如果浏览器通知权限被拒绝或不可用，应用仍然正常工作，只是跳过通知。

如果 LocalStorage 不可用或已有数据无效，应用回退到默认值并继续运行。

设置输入需要拒绝无效值。MVP 阶段使用以下合理范围：

- 专注时长：1 到 120 分钟。
- 短休息时长：1 到 60 分钟。

## 测试

初始测试覆盖：

- 倒计时格式化。
- 专注和休息结束后的模式切换。
- 只有完成专注时才增加今日完成数。
- LocalStorage 数据无效时回退到默认值。
- 日期变更后重置今日完成数。

手动验证覆盖：

- 开始、暂停和重置行为。
- 专注事项输入框可以留空。
- 浏览器通知权限请求，以及浏览器允许时的通知发送。
- 修改设置后刷新页面仍能保留。
