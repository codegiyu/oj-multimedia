import { describe, expect, it } from 'vitest';
import { mergeCommunityHighlights } from '@/lib/utils/mergeCommunityHighlights';

describe('mergeCommunityHighlights', () => {
  it('interleaves testimonies, devotionals, and prayer requests with emphasis on all three', () => {
    const result = mergeCommunityHighlights({
      testimonies: [
        {
          _id: 't1',
          author: 'Ada',
          content: 'Testimony one',
          createdAt: '2026-05-30T10:00:00.000Z',
        },
      ],
      devotionals: [
        {
          _id: 'd1',
          title: 'Daily word',
          excerpt: 'Excerpt',
          createdAt: '2026-05-29T10:00:00.000Z',
        },
      ],
      prayerRequests: [
        {
          _id: 'p1',
          title: 'Need healing',
          content: 'Please pray',
          createdAt: '2026-05-28T10:00:00.000Z',
        },
      ],
      limit: 3,
    });

    expect(result).toHaveLength(3);
    expect(result.map(item => item.kind)).toEqual(['testimony', 'devotional', 'prayer-request']);
  });

  it('sorts merged items by timestamp descending', () => {
    const result = mergeCommunityHighlights({
      testimonies: [
        { _id: 't-old', content: 'Old', createdAt: '2026-05-01T10:00:00.000Z' },
        { _id: 't-new', content: 'New', createdAt: '2026-05-30T10:00:00.000Z' },
      ],
      devotionals: [],
      prayerRequests: [],
      limit: 2,
    });

    expect(result[0]?._id).toBe('t-new');
    expect(result[1]?._id).toBe('t-old');
  });

  it('maps devotional coverImage when provided', () => {
    const result = mergeCommunityHighlights({
      testimonies: [],
      devotionals: [
        {
          _id: 'd1',
          title: 'Daily word',
          excerpt: 'Excerpt',
          coverImage: 'https://cdn.example/cover.jpg',
          createdAt: '2026-05-29T10:00:00.000Z',
        },
      ],
      prayerRequests: [],
      limit: 1,
    });

    expect(result[0]?.coverImage).toBe('https://cdn.example/cover.jpg');
  });
});
