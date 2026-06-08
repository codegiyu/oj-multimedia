import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const BROWSE_CLIENTS = [
  'components/section/music/AllMusicPageClient.tsx',
  'components/section/video/AllVideosPageClient.tsx',
  'components/section/news/AllNewsPageClient.tsx',
  'components/section/music/AllAlbumsPageClient.tsx',
  'components/section/community/artists/AllArtistsPageClient.tsx',
  'components/section/community/devotionals/AllDevotionalsPageClient.tsx',
  'components/section/community/testimonies/AllTestimoniesPageClient.tsx',
  'components/section/community/prayer-requests/AllPrayerRequestsPageClient.tsx',
  'components/section/community/ask-a-pastor/AllQuestionsPageClient.tsx',
  'components/section/community/resources/AllResourcesPageClient.tsx',
  'components/section/community/polls/AllPollsPageClient.tsx',
];

describe('Browse list architecture contract', () => {
  it('ships shared BrowseListPageClient used by all browse page clients', () => {
    const shared = readFileSync(
      join(process.cwd(), 'components/general/BrowseListPageClient.tsx'),
      'utf8'
    );

    expect(shared).toContain('ContentAllBrowseToolbar');
    expect(shared).toContain('DataLoadError');

    for (const relativePath of BROWSE_CLIENTS) {
      const source = readFileSync(join(process.cwd(), relativePath), 'utf8');
      expect(source).toContain('BrowseListPageClient');
      expect(source).not.toContain('DataLoadError');
    }
  });
});
