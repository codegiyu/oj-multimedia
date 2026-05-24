import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDebouncedCallback } from '@/lib/utils/debouncedCallback';

describe('createDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes callback after delay', () => {
    const fn = vi.fn();
    const debounced = createDebouncedCallback(fn, 300);

    debounced.call('a');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = createDebouncedCallback(fn, 300);

    debounced.call('a');
    vi.advanceTimersByTime(200);
    debounced.call('b');
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('flush invokes pending callback immediately', () => {
    const fn = vi.fn();
    const debounced = createDebouncedCallback(fn, 300);

    debounced.call('x');
    debounced.flush();
    expect(fn).toHaveBeenCalledWith('x');
  });

  it('cancel clears pending invocation', () => {
    const fn = vi.fn();
    const debounced = createDebouncedCallback(fn, 300);

    debounced.call('x');
    debounced.cancel();
    vi.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();
  });
});
