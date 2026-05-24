import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildAlbumRequestWhatsAppMessage } from '@/lib/services/buildAlbumRequestWhatsApp';

const phase11Files = [
  'components/section/shared/ManageAlbumWhatsAppModal.tsx',
  'components/section/music/AlbumManageButton.tsx',
  'components/section/music/AlbumDetailPageClient.tsx',
  'components/section/account/artist-portal/ArtistPortalAlbumsPageClient.tsx',
  'app/account/artist-portal/albums/page.tsx',
  'lib/services/buildAlbumRequestWhatsApp.ts',
] as const;

describe('phase 11 artist album WhatsApp requests', () => {
  it('buildAlbumRequestWhatsAppMessage formats admin contact copy', () => {
    const message = buildAlbumRequestWhatsAppMessage({
      requestType: 'edit',
      artistName: 'Artist',
      albumTitle: 'Greatest Hits',
      albumPageUrl: 'https://oj.example.com/music/albums/greatest-hits',
    });

    expect(message).toContain('Hello OJ Multimedia team');
    expect(message).toContain('Edit an existing album');
    expect(message).toContain('Greatest Hits');
  });

  it.each(phase11Files)('%s wires album WhatsApp manage flow', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);

    if (file.endsWith('ManageAlbumWhatsAppModal.tsx')) {
      expect(source).toContain('Proceed on WhatsApp');
      expect(source).toContain('buildWhatsAppHref');
    }

    if (file.endsWith('AlbumManageButton.tsx')) {
      expect(source).toContain('ARTIST_GET_ME');
      expect(source).toContain('Manage album');
    }

    if (file.endsWith('ArtistPortalAlbumsPageClient.tsx')) {
      expect(source).toContain('Request new album');
    }

    if (file.endsWith('albums/page.tsx')) {
      expect(source).toContain('PUBLIC_GET_ALBUMS');
      expect(source).toContain('ARTIST_GET_ME');
    }
  });
});
