import { describe, expect, it } from 'vitest';
import type { PublicMusicListItem, PublicVideoListItem } from '@/lib/constants/endpoints';
import {
  filterPublicMusicList,
  filterPublicVideoList,
  mapPublicMusicToTrendingSong,
  mapPublicVideoToRecentUpload,
} from './publicApiMappers';

/** List API payloads omit playable URL fields; browse pages must not re-filter them client-side. */
const listShapedMusic = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Test Song',
  slug: 'test-song',
  status: 'published',
  coverImage: '/cover.jpg',
  category: 'gospel',
  views: 10,
  createdAt: '2026-01-01T00:00:00.000Z',
  artist: { _id: '507f1f77bcf86cd799439012', name: 'Artist', slug: 'artist' },
} as PublicMusicListItem;

const listShapedVideo = {
  _id: '507f1f77bcf86cd799439021',
  title: 'Test Video',
  slug: 'test-video',
  status: 'published',
  thumbnail: '/thumb.jpg',
  category: 'music-video',
  views: 20,
  createdAt: '2026-01-01T00:00:00.000Z',
  artist: { _id: '507f1f77bcf86cd799439012', name: 'Artist', slug: 'artist' },
} as PublicVideoListItem;

describe('publicApiMappers browse list regression', () => {
  it('maps list-shaped music without audioUrl for browse cards', () => {
    const mapped = mapPublicMusicToTrendingSong(listShapedMusic);

    expect(mapped._id).toBe(listShapedMusic._id);
    expect(mapped.title).toBe('Test Song');
    expect(mapped.cover).toBe('/cover.jpg');
  });

  it('maps list-shaped videos without video URLs for browse cards', () => {
    const mapped = mapPublicVideoToRecentUpload(listShapedVideo);

    expect(mapped._id).toBe(listShapedVideo._id);
    expect(mapped.title).toBe('Test Video');
    expect(mapped.thumbnail).toBe('/thumb.jpg');
  });

  it('documents that client completeness filters strip list-shaped items', () => {
    expect(filterPublicMusicList([listShapedMusic])).toHaveLength(0);
    expect(filterPublicVideoList([listShapedVideo])).toHaveLength(0);
  });
});
