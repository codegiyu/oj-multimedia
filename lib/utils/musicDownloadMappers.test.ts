import { describe, expect, it } from 'vitest';
import { toMusicDownloadInputFromCard, toMusicDownloadInputFromItem } from './musicDownloadMappers';

describe('musicDownloadMappers', () => {
  it('maps card fields with card source', () => {
    const input = toMusicDownloadInputFromCard({
      _id: 'm1',
      title: 'Track',
      artist: { _id: 'a1', name: 'Artist' },
      slug: 'track-slug',
    });

    expect(input).toMatchObject({
      _id: 'm1',
      slug: 'track-slug',
      title: 'Track',
      artistName: 'Artist',
      source: 'card',
    });
  });

  it('maps music items with detail source', () => {
    const input = toMusicDownloadInputFromItem(
      {
        _id: 'm2',
        title: 'Song',
        slug: 'song',
        artist: { _id: 'a2', name: 'Singer' },
        cover: '',
        category: 'gospel',
        downloadUrl: 'https://cdn.example.com/a.mp3',
      },
      'detail'
    );

    expect(input.source).toBe('detail');
    expect(input.downloadUrl).toBe('https://cdn.example.com/a.mp3');
  });
});
