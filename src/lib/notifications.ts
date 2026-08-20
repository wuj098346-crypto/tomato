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
