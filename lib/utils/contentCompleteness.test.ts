import { describe, expect, it } from 'vitest';
import { isCompleteMusic, isCompleteResource, isCompleteVideo } from './contentCompleteness';

describe('contentCompleteness (client)', () => {
  it('requires audio for regular music', () => {
    expect(isCompleteMusic({ category: 'gospel', audioUrl: 'https://a.mp3' })).toBe(true);
    expect(isCompleteMusic({ category: 'gospel' })).toBe(false);
  });

  it('requires playable video sources', () => {
    expect(isCompleteVideo({ videoFileUrl: 'https://v.mp4' })).toBe(true);
    expect(isCompleteVideo({ embedUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ' })).toBe(true);
  });

  it('allows affiliate resources without fileUrl', () => {
    expect(isCompleteResource({ type: 'affiliate' })).toBe(true);
    expect(isCompleteResource({ type: 'ebook' })).toBe(false);
  });
});
