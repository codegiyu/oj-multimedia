import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mapPublicMusicToDetailItem } from '@/lib/utils/publicApiMappers';
import { publicMusicAlbumHref } from '@/lib/utils/publicMusicAlbum';
import type { PublicMusicListItem } from '@/lib/constants/endpoints';

const MOCK_ALBUM = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Greatest Hits',
  slug: 'greatest-hits',
} as const;

const phase10Files = [
  'components/section/music/MusicDetailPageClient.tsx',
  'components/cards/MusicCard.tsx',
  'lib/utils/publicMusicAlbum.ts',
] as const;

describe('phase 10 public music album surfacing', () => {
  it('publicMusicAlbumHref prefers slug over id', () => {
    expect(publicMusicAlbumHref(MOCK_ALBUM)).toBe('/music/albums/greatest-hits');
    expect(publicMusicAlbumHref({ _id: MOCK_ALBUM._id, slug: '' })).toBe(
      `/music/albums/${MOCK_ALBUM._id}`
    );
  });

  it('mapPublicMusicToDetailItem passes album summary from API item', () => {
    const detail = mapPublicMusicToDetailItem({
      _id: '507f1f77bcf86cd799439014',
      title: 'Track',
      slug: 'track',
      status: 'published',
      coverImage: '/c.jpg',
      audioUrl: 'https://cdn.example.com/a.mp3',
      category: 'gospel',
      artist: { _id: '507f1f77bcf86cd799439012', name: 'Artist', slug: 'artist' },
      album: MOCK_ALBUM,
      createdAt: '2026-01-01',
    } as PublicMusicListItem);

    expect(detail.album).toEqual(MOCK_ALBUM);
  });

  it.each(phase10Files)('%s surfaces album context in public music UI', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);

    if (file.endsWith('MusicDetailPageClient.tsx')) {
      expect(source).toContain('publicMusicAlbumHref');
      expect(source).toContain('Breadcrumb');
    }

    if (file.endsWith('MusicCard.tsx')) {
      expect(source).toContain('publicMusicAlbumHref');
      expect(source).toContain('album?: MusicAlbumSummary');
    }

    if (file.endsWith('publicMusicAlbum.ts')) {
      expect(source).toContain('resolvePublicMusicAlbum');
    }
  });
});
