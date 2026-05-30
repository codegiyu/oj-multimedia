import { describe, expect, it } from 'vitest';
import { formatTagsForInput, parseCommaSeparatedTags } from '@/lib/utils/adminCommaTags';

describe('adminCommaTags', () => {
  it('parses comma-separated tags', () => {
    expect(parseCommaSeparatedTags(' worship , praise, ')).toEqual(['worship', 'praise']);
    expect(parseCommaSeparatedTags('')).toEqual([]);
  });

  it('formats tags for input', () => {
    expect(formatTagsForInput(['a', 'b'])).toBe('a, b');
    expect(formatTagsForInput(undefined)).toBe('');
  });
});
