# Tomato

一个精简的番茄钟 MVP，用于快速开始专注、记录今日完成数量，并在专注或休息结束时提醒用户。

## 功能

- 专注和短休息两种倒计时模式。
- 开始、暂停、重置计时器。
- 可选填写当前专注事项。
- 今日已完成番茄数量统计。
- 支持自定义专注时长和短休息时长。
- 支持浏览器通知提醒。
- 支持铃声提醒开关。
- 使用 LocalStorage 保存设置、今日统计和最近完成记录。

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Testing Library
- lucide-react

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认本地地址：

```text
http://127.0.0.1:5173/
```

构建生产版本：

```bash
npm run build
```

## 常用脚本

```bash
npm run dev       # 启动本地开发服务器
npm run build     # 类型检查并构建生产包
npm run test      # 启动 Vitest 监听模式
npm run test:run  # 运行一次自动化测试
npm run lint      # 运行 TypeScript 类型检查
```

## 项目结构

```text
src/
  components/          # 页面展示组件
  hooks/               # 番茄钟计时状态机
  lib/                 # 时间、存储、通知、声音等工具
  test/                # 测试环境配置
  App.tsx              # 应用状态整合和主界面
  main.tsx             # React 入口
  index.css            # Tailwind 和全局样式
docs/
  superpowers/         # MVP 设计与实现计划文档
```

## 数据与提醒

应用不依赖后端服务。计时设置、今日完成数和最近完成记录会保存到浏览器 LocalStorage，存储键为 `tomato:pomodoro-storage:v1`。

浏览器通知需要用户授权；如果浏览器不支持通知或用户拒绝授权，计时器仍会正常工作。铃声提醒使用 Web Audio API 生成短提示音，不需要额外音频文件。

## 测试

运行全部自动化测试：

```bash
npm run test:run
```

当前测试覆盖时间格式化、LocalStorage 恢复、通知 helper、声音 helper、计时 hook 和主界面渲染。
