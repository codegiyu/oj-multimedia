import { describe, expect, it } from 'vitest';
import {
  formatDurationSeconds,
  formatMediaDuration,
  parseMediaDurationSeconds,
} from '@/lib/utils/formatMediaDuration';

describe('formatMediaDuration', () => {
  it('formats seconds under one hour as M:SS', () => {
    expect(formatMediaDuration(245)).toBe('4:05');
    expect(formatMediaDuration(90)).toBe('1:30');
    expect(formatMediaDuration(5)).toBe('0:05');
  });

  it('formats seconds of at least one hour as H:MM:SS', () => {
    expect(formatMediaDuration(3600)).toBe('1:00:00');
    expect(formatMediaDuration(3930)).toBe('1:05:30');
    expect(formatMediaDuration(5400)).toBe('1:30:00');
  });

  it('parses and normalizes legacy string durations', () => {
    expect(formatMediaDuration('245')).toBe('4:05');
    expect(formatMediaDuration('4:05')).toBe('4:05');
    expect(formatMediaDuration('1:15:00')).toBe('1:15:00');
    expect(formatMediaDuration('  90  ')).toBe('1:30');
  });

  it('returns 0:00 for missing or invalid values', () => {
    expect(formatMediaDuration(undefined)).toBe('0:00');
    expect(formatMediaDuration('')).toBe('0:00');
    expect(formatMediaDuration('not-a-duration')).toBe('0:00');
  });
});

describe('parseMediaDurationSeconds', () => {
  it('parses numbers, raw second strings, and clock strings', () => {
    expect(parseMediaDurationSeconds(245)).toBe(245);
    expect(parseMediaDurationSeconds('245')).toBe(245);
    expect(parseMediaDurationSeconds('4:05')).toBe(245);
    expect(parseMediaDurationSeconds('1:15:00')).toBe(4500);
  });
});

describe('formatDurationSeconds', () => {
  it('matches media display formatting rules', () => {
    expect(formatDurationSeconds(245)).toBe('4:05');
    expect(formatDurationSeconds(3930)).toBe('1:05:30');
  });
});
