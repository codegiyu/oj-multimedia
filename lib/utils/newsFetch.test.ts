import { describe, expect, it, vi, beforeEach } from 'vitest';
const mockCallPublicServerApi = vi.fn();

vi.mock('@/lib/services/serverApi', () => ({
  callPublicServerApi: (...args: unknown[]) => mockCallPublicServerApi(...args),
}));

describe('fetchPublicNewsArticles', () => {
  beforeEach(() => {
    mockCallPublicServerApi.mockReset();
  });

  it('keeps API list items when excerpt is empty and content is omitted from list DTO', async () => {
    const listItem = {
      _id: '6a14a26b1b46220ad3a63362',
      title: 'Meet our artists of the week',
      slug: 'meet-our-artists-of-the-week',
      excerpt: '',
      category: 'christian-celebrity-news',
      coverImage: 'https://example.com/cover.webp',
      author: 'Gideon Ogbike',
      views: 0,
      createdAt: '2026-05-25T19:26:35.502Z',
    };

    mockCallPublicServerApi.mockResolvedValue({
      type: 'success',
      data: {
        articles: [listItem],
        pagination: { page: 1, limit: 15, total: 1, totalPages: 1 },
      },
      message: 'News list loaded.',
      requestName: 'PUBLIC_GET_NEWS',
    });

    const { fetchPublicNewsArticles } = await import('@/app/news/_sections/shared');
    const result = await fetchPublicNewsArticles({
      category: 'all',
      type: 'latest',
      limit: 15,
    });

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0]?._id).toBe(listItem._id);
    expect(result.error).toBeNull();
  });
});
