import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildAdminContentCategorySearchHref } from '@/lib/admin/entityRoutes';
import { musicAlbumRecordId } from '@/lib/utils/adminMusicAlbumSelect';

const phase4dWiredFiles = [
  'components/section/admin/music/MusicTableContent.tsx',
  'components/section/admin/music/MusicDetailsDrawer.tsx',
  'components/section/admin/albums/AlbumsTableContent.tsx',
  'components/section/admin/videos/VideosTableContent.tsx',
  'components/section/admin/users/UsersTableContent.tsx',
  'components/section/admin/users/UsersDetailsDrawer.tsx',
  'components/section/admin/marketplace/MarketplaceProductsTableContent.tsx',
  'components/section/admin/marketplace/MarketplaceDetailsDrawer.tsx',
  'components/section/admin/ask-a-pastor/AskAPastorDetailsDrawer.tsx',
  'components/section/admin/documents/DocumentsDetailsDrawer.tsx',
] as const;

describe('admin entity field links (phase 4d)', () => {
  it('buildAdminContentCategorySearchHref encodes search query', () => {
    expect(buildAdminContentCategorySearchHref('worship')).toBe(
      '/admin/dashboard/content-categories?search=worship'
    );
    expect(buildAdminContentCategorySearchHref('')).toBe('/admin/dashboard/content-categories');
  });

  it('musicAlbumRecordId prefers populated album _id', () => {
    expect(musicAlbumRecordId({ albumId: 'raw-id' })).toBe('raw-id');
    expect(
      musicAlbumRecordId({
        albumId: 'raw-id',
        album: { _id: 'pop-id', title: 'Hits', slug: 'hits' },
      })
    ).toBe('pop-id');
  });

  it.each(phase4dWiredFiles)('%s uses AdminEntity field link components', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source).toMatch(/Admin(?:Artist|MusicAlbum|Vendor|Product|Pastor|Document|UserLinked)/);
  });
});
