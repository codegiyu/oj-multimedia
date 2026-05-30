import { describe, expect, it } from 'vitest';
import {
  mapPublicNewsToBreakingStory,
  mapPublicNewsToDetailItem,
} from '@/lib/utils/publicApiMappers';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';

const baseArticle = {
  _id: 'abc123',
  title: 'Test',
  slug: 'test',
  content: 'Body',
  status: 'published' as const,
  isFeatured: false,
  isTrending: false,
  views: 10,
  displayOrder: 0,
  images: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  coverImage: 'https://example.com/c.jpg',
  category: 'church-announcements',
  priority: 5,
  tags: ['urgent', 'event'],
};

describe('publicApiMappers news priority', () => {
  it('maps priority and tags on detail items', () => {
    const detail = mapPublicNewsToDetailItem(baseArticle as PublicNewsListItem);
    expect(detail.priority).toBe(5);
    expect(detail.tags).toEqual(['urgent', 'event']);
  });

  it('maps breaking stories with default priority fallback', () => {
    const breaking = mapPublicNewsToBreakingStory({
      ...baseArticle,
      priority: undefined,
    } as PublicNewsListItem);
    expect(breaking.priority).toBe(4);
  });
});
