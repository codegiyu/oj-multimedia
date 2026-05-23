import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shareContent } from './shareContent';

describe('shareContent', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: { origin: 'https://oj.example.com' },
    } as Window & typeof globalThis);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share } as unknown as Navigator);

    await shareContent({
      title: 'Track',
      text: 'Listen now',
      url: '/music/my-track',
    });

    expect(share).toHaveBeenCalledWith({
      title: 'Track',
      text: 'Listen now',
      url: 'https://oj.example.com/music/my-track',
    });
  });

  it('falls back to clipboard when Web Share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    } as unknown as Navigator);

    await shareContent({
      title: 'Track',
      url: 'https://cdn.example.com/page',
    });

    expect(writeText).toHaveBeenCalledWith('https://cdn.example.com/page');
  });
});
