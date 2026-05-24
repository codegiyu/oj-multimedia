import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADMIN_ENDPOINTS } from '@/lib/constants/endpoints/admin';
import { sidebarLinksData } from '@/lib/constants/routing';

const phase7Files = [
  'app/admin/dashboard/albums/page.tsx',
  'components/section/admin/albums/AlbumsPageClient.tsx',
  'components/section/admin/albums/AlbumsTableContent.tsx',
  'components/section/admin/albums/AlbumsDetailsDrawer.tsx',
  'components/section/admin/albums/CreateAlbumModal.tsx',
  'components/section/admin/albums/AlbumsActionsMenu.tsx',
] as const;

describe('phase 7 admin albums dashboard', () => {
  it('registers admin album API endpoints', () => {
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUMS_LIST.path).toBe('/api/v1/admin/albums');
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUM_ITEM.method).toBe('GET');
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUM_CREATE.method).toBe('POST');
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUM_UPDATE.method).toBe('PATCH');
    expect(ADMIN_ENDPOINTS.ADMIN_ALBUM_DELETE.method).toBe('DELETE');
  });

  it('adds Albums to admin sidebar navigation', () => {
    const mainLinks = sidebarLinksData.find(g => g.groupName === 'Main')?.links ?? [];
    const albumsLink = mainLinks.find(l => l.page === 'Albums');
    expect(albumsLink?.path?.suffix).toBe('/dashboard/albums');
  });

  it.each(phase7Files)('%s exists and wires core album admin UI', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);
    if (file.endsWith('page.tsx')) {
      expect(source).toContain('serverFetchAdminAlbumsList');
      expect(source).toContain('AlbumsPageClient');
    }
    if (file.endsWith('AlbumsPageClient.tsx')) {
      expect(source).toContain('ADMIN_ALBUM_DELETE');
      expect(source).toContain('CreateAlbumModal');
    }
    if (file.endsWith('CreateAlbumModal.tsx')) {
      expect(source).toContain('ADMIN_ALBUM_CREATE');
      expect(source).toContain('ADMIN_ALBUM_UPDATE');
      expect(source).toContain('MediaUrlOrUploadField');
    }
    if (file.endsWith('AlbumsDetailsDrawer.tsx')) {
      expect(source).toContain('ADMIN_ALBUM_ITEM');
    }
  });
});
