type AudioContextConstructor = new () => AudioContext;

export function playSessionDoneSound() {
  const AudioContextClass =
    globalThis.AudioContext ??
    (globalThis as typeof globalThis & { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;

  if (!AudioContextClass) {
    return false;
  }

  try {
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, startTime);
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.35);
    oscillator.addEventListener('ended', () => {
      void audioContext.close();
    });

    return true;
  } catch {
    return false;
  }
}
