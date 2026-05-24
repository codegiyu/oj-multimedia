import { describe, expect, it } from 'vitest';
import {
  buildAlbumRequestWhatsAppMessage,
  type AlbumRequestWhatsAppContext,
} from './buildAlbumRequestWhatsApp';

describe('buildAlbumRequestWhatsAppMessage', () => {
  const base: AlbumRequestWhatsAppContext = {
    requestType: 'edit',
    artistName: 'Test Artist',
    albumTitle: 'Greatest Hits',
    albumId: '507f1f77bcf86cd799439011',
    albumPageUrl: 'https://oj.example.com/music/albums/greatest-hits',
  };

  it('includes request type and artist for create requests', () => {
    const message = buildAlbumRequestWhatsAppMessage({
      requestType: 'create',
      artistName: 'Test Artist',
    });

    expect(message).toContain('Create a new album');
    expect(message).toContain('*Artist profile:* Test Artist');
    expect(message).not.toContain('*Album title:*');
  });

  it('includes album context for edit and delete requests', () => {
    const edit = buildAlbumRequestWhatsAppMessage(base);
    expect(edit).toContain('Edit an existing album');
    expect(edit).toContain('*Album title:* Greatest Hits');
    expect(edit).toContain('*Album page:*');

    const del = buildAlbumRequestWhatsAppMessage({ ...base, requestType: 'delete' });
    expect(del).toContain('Delete an album');
  });
});
