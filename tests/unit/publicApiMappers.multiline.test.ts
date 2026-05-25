import { describe, expect, it } from 'vitest';
import { mapPublicNewsToDetailItem } from '@/lib/utils/publicApiMappers';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';

const SPOT_CHECK_TEXT = 'Line1\nLine2\n\nLine3';

function minimalNewsItem(content: string): PublicNewsListItem {
  return {
    _id: 'news-1',
    title: 'Test story',
    excerpt: 'Short excerpt',
    category: 'faith',
    coverImage: '/cover.jpg',
    status: 'published',
    content,
  } as PublicNewsListItem;
}

describe('mapPublicNewsToDetailItem multiline content', () => {
  it('maps API content to fullStory.introduction unchanged', () => {
    const item = mapPublicNewsToDetailItem(minimalNewsItem(SPOT_CHECK_TEXT));
    expect(item.fullStory?.introduction).toBe(SPOT_CHECK_TEXT);
  });

  it('leaves fullStory undefined when content is empty', () => {
    const item = mapPublicNewsToDetailItem(minimalNewsItem(''));
    expect(item.fullStory).toBeUndefined();
  });
});
