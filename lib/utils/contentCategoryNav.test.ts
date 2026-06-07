import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';

const mockCallPublicServerApi = vi.fn();

vi.mock('@/lib/services/serverApi', () => ({
  callPublicServerApi: (...args: unknown[]) => mockCallPublicServerApi(...args),
}));

describe('fetchPublicCategoryNav', () => {
  beforeEach(() => {
    mockCallPublicServerApi.mockReset();
  });

  it('appends fallback categories missing from API response', async () => {
    mockCallPublicServerApi.mockResolvedValue({
      type: 'success',
      data: {
        categories: [
          { slug: 'music', name: 'Music Videos', isActive: true },
          { slug: 'short', name: 'Short Clips', isActive: true },
        ],
      },
      message: 'ok',
      requestName: 'PUBLIC_GET_CONTENT_CATEGORIES',
    });

    const fallback = [
      { id: ALL_CATEGORY_ID, label: 'All' },
      { id: 'music', label: 'Music Videos' },
      { id: 'movies', label: 'Movies' },
      { id: 'drama', label: 'Drama' },
    ];

    const { fetchPublicCategoryNav } = await import('@/lib/utils/contentCategoryNav');
    const nav = await fetchPublicCategoryNav('video', 'All Videos', fallback);

    expect(nav.map(item => item.id)).toEqual([
      ALL_CATEGORY_ID,
      'music',
      'short',
      'movies',
      'drama',
    ]);
  });
});
