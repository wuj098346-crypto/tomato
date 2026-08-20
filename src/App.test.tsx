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
