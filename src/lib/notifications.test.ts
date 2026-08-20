import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestNotificationPermission, sendSessionDoneNotification } from './notifications';

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
