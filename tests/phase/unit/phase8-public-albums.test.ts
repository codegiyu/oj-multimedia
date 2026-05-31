import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ENDPOINTS } from '@/lib/constants/endpoints/public';
import { getSearchResultDetailHref } from '@/lib/utils/searchResultRoutes';

describe('phase 8 public albums', () => {
  it('registers public album API endpoints', () => {
    expect(PUBLIC_ENDPOINTS.PUBLIC_GET_ALBUMS.path).toBe('/api/v1/public/albums');
    expect(PUBLIC_ENDPOINTS.PUBLIC_GET_ALBUM_ITEM.method).toBe('GET');
  });

  it('routes search album hits to album detail pages', () => {
    expect(getSearchResultDetailHref('album', '507f1f77bcf86cd799439011')).toBe(
      '/music/albums/507f1f77bcf86cd799439011'
    );
  });

  it('music hub page loads featured albums from public API', () => {
    const pageSource = readFileSync(join(process.cwd(), 'app/music/page.tsx'), 'utf8');
    const sectionSource = readFileSync(
      join(process.cwd(), 'app/music/_sections/FeaturedAlbumsSection.tsx'),
      'utf8'
    );

    expect(pageSource).toContain('FeaturedAlbumsSection');
    expect(sectionSource).toContain('PUBLIC_GET_ALBUMS');
    expect(sectionSource).toContain('FeaturedAlbums');
  });

  it('album list and detail routes exist', () => {
    expect(readFileSync(join(process.cwd(), 'app/music/albums/page.tsx'), 'utf8')).toContain(
      'AlbumsListPageClient'
    );
    expect(readFileSync(join(process.cwd(), 'app/music/albums/[id]/page.tsx'), 'utf8')).toContain(
      'PUBLIC_GET_ALBUM_ITEM'
    );
  });

  it('search UI includes album filter tab', () => {
    const filters = readFileSync(
      join(process.cwd(), 'components/section/public/search/SearchFilters.tsx'),
      'utf8'
    );
    expect(filters).toContain("value: 'album'");
    expect(filters).toContain('DiscAlbum');
  });
});
