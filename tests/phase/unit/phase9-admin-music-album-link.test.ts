import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADMIN_ENDPOINTS } from '@/lib/constants/endpoints/admin';
import {
  ensureAlbumSelectContainsCurrent,
  musicAlbumLabel,
  resolveContentArtistId,
} from '@/lib/utils/adminMusicAlbumSelect';

/** Align with oj-backend/tests/helpers/albumMusicFixtures.ts */
const MOCK_ARTIST_SUMMARY = {
  _id: '507f1f77bcf86cd799439012',
  slug: 'artist-slug',
  name: 'Artist',
} as const;

const MOCK_ALBUM_SUMMARY = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Greatest Hits',
  slug: 'greatest-hits',
} as const;
const phase9Files = [
  'components/section/admin/music/CreateMusicModal.tsx',
  'components/section/admin/music/MusicTableContent.tsx',
  'components/section/admin/music/MusicDetailsDrawer.tsx',
  'lib/utils/adminMusicAlbumSelect.ts',
] as const;

describe('phase 9 admin music album linking', () => {
  it('registers admin albums list endpoint for artist-filtered picker', () => {
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUMS_LIST.path).toBe('/api/v1/admin/albums');
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUMS_LIST.method).toBe('GET');
  });

  it('resolveContentArtistId reads populated or string artist ids', () => {
    expect(resolveContentArtistId(undefined)).toBeNull();
    expect(resolveContentArtistId(MOCK_ARTIST_SUMMARY._id)).toBe(MOCK_ARTIST_SUMMARY._id);
    expect(resolveContentArtistId(MOCK_ARTIST_SUMMARY)).toBe(MOCK_ARTIST_SUMMARY._id);
  });

  it('musicAlbumLabel prefers populated album title over raw id', () => {
    expect(musicAlbumLabel({})).toBe('—');
    expect(musicAlbumLabel({ albumId: MOCK_ALBUM_SUMMARY._id })).toBe(MOCK_ALBUM_SUMMARY._id);
    expect(
      musicAlbumLabel({
        albumId: MOCK_ALBUM_SUMMARY._id,
        album: MOCK_ALBUM_SUMMARY,
      })
    ).toBe(MOCK_ALBUM_SUMMARY.title);
  });
  it('ensureAlbumSelectContainsCurrent keeps draft album visible in select', () => {
    const options = ensureAlbumSelectContainsCurrent(
      [{ text: 'No album', value: '' }],
      'draft-album-id',
      'Unpublished draft'
    );

    expect(options).toContainEqual({ text: 'Unpublished draft', value: 'draft-album-id' });
  });

  it.each(phase9Files)('%s wires album linking for admin music', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);

    if (file.endsWith('CreateMusicModal.tsx')) {
      expect(source).toContain('loadPublishedAlbumSelectOptions');
      expect(source).toContain('resolveContentArtistId');
      expect(source).toContain('albumId');
    }

    if (file.endsWith('MusicTableContent.tsx')) {
      expect(source).toContain('musicAlbumLabel');
      expect(source).toContain('title="Album"');
    }

    if (file.endsWith('MusicDetailsDrawer.tsx')) {
      expect(source).toContain('musicAlbumLabel');
      expect(source).toContain('DiscAlbum');
    }

    if (file.endsWith('adminMusicAlbumSelect.ts')) {
      expect(source).toContain("params.set('status', 'published')");
      expect(source).toContain("params.set('artist', artistId)");
    }
  });
});
