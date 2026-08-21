import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { playSessionDoneSound } from './lib/sound';

vi.mock('./lib/sound', () => ({
  playSessionDoneSound: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the MVP timer surface', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '25:00' })).toBeInTheDocument();
    expect(screen.getByText('专注中')).toBeInTheDocument();
    expect(screen.getByLabelText('当前专注事项')).toBeInTheDocument();
    expect(screen.getByText('今日完成 0 个番茄')).toBeInTheDocument();
    expect(document.title).toBe('🍅 25:00');
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

  it('plays a sound by default when the timer completes', async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.change(screen.getByLabelText('专注时长'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: '开始' }));

    act(() => vi.advanceTimersByTime(61_000));

    expect(playSessionDoneSound).toHaveBeenCalledTimes(1);
  });

  it('persists disabled sound reminder and skips sound on completion', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<App />);

    const soundToggle = screen.getByLabelText('铃声提醒');
    expect(soundToggle).toBeChecked();

    fireEvent.click(soundToggle);
    expect(soundToggle).not.toBeChecked();

    unmount();
    render(<App />);

    expect(screen.getByLabelText('铃声提醒')).not.toBeChecked();

    fireEvent.change(screen.getByLabelText('专注时长'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: '开始' }));

    act(() => vi.advanceTimersByTime(61_000));

    expect(playSessionDoneSound).not.toHaveBeenCalled();
    expect(screen.getByText('今日完成 1 个番茄')).toBeInTheDocument();
    expect(screen.getByText('休息中')).toBeInTheDocument();
  });
});
