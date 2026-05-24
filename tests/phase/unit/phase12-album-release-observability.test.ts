import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PUBLIC_CONTENT_ROUTES } from '../../e2e/fixtures/smokeRoutes';
import { getSearchResultDetailHref } from '@/lib/utils/searchResultRoutes';

const phase12Files = [
  'tests/e2e/album-routes.spec.ts',
  'components/section/music/AlbumDetailPageClient.tsx',
  'lib/constants/endpoints/types.ts',
] as const;

describe('phase 12 album release and observability', () => {
  it('smoke routes include public albums list', () => {
    expect(PUBLIC_CONTENT_ROUTES.some(route => route.path === '/music/albums')).toBe(true);
  });

  it('search album hits resolve to album detail routes', () => {
    expect(getSearchResultDetailHref('album', '507f1f77bcf86cd799439011')).toBe(
      '/music/albums/507f1f77bcf86cd799439011'
    );
  });

  it.each(phase12Files)('%s wires phase 12 release coverage', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);

    if (file.endsWith('album-routes.spec.ts')) {
      expect(source).toContain('/music/albums');
      expect(source).toContain('type=album');
      expect(source).toContain('e2e-smoke-missing-id');
    }

    if (file.endsWith('AlbumDetailPageClient.tsx')) {
      expect(source).toContain("sendContentAnalyticsEvent('album'");
    }

    if (file.endsWith('types.ts')) {
      expect(source).toContain("'album'");
    }
  });
});
