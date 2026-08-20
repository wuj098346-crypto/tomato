import { afterEach, describe, expect, it, vi } from 'vitest';
import { playSessionDoneSound } from './sound';

describe('sound', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports unsupported browsers without throwing', () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);

    expect(playSessionDoneSound()).toBe(false);
  });

  it('plays a short generated sound when audio context is available', () => {
    const start = vi.fn();
    const stop = vi.fn();
    const close = vi.fn();
    const connect = vi.fn();
    const setValueAtTime = vi.fn();
    const exponentialRampToValueAtTime = vi.fn();
    const addEventListener = vi.fn();
    const AudioContextMock = vi.fn(function () {
      return {
        currentTime: 1,
        destination: {},
        close,
        createOscillator: () => ({
          type: 'sine',
          frequency: { setValueAtTime },
          connect,
          start,
          stop,
          addEventListener,
        }),
        createGain: () => ({
          gain: { setValueAtTime, exponentialRampToValueAtTime },
          connect,
        }),
      };
    });

    vi.stubGlobal('AudioContext', AudioContextMock);

    expect(playSessionDoneSound()).toBe(true);
    expect(AudioContextMock).toHaveBeenCalledTimes(1);
    expect(start).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalledWith(1.35);
    expect(addEventListener).toHaveBeenCalledWith('ended', expect.any(Function));
  });
});
