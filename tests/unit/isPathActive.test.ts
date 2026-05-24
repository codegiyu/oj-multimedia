import { describe, expect, it } from 'vitest';
import { isPathActive } from '@/lib/utils/isPathActive';

describe('isPathActive', () => {
  it('matches exact paths', () => {
    expect(isPathActive('/admin/dashboard/home', '/admin/dashboard/home')).toBe(true);
    expect(isPathActive('/admin/dashboard/home/', '/admin/dashboard/home')).toBe(true);
  });

  it('matches nested paths under href', () => {
    expect(isPathActive('/admin/dashboard/music/123', '/admin/dashboard/music')).toBe(true);
  });

  it('does not match sibling segments that share a prefix', () => {
    expect(isPathActive('/admin/dashboard/home-adverts', '/admin/dashboard/home')).toBe(false);
  });

  it('matches home-adverts only for its own href', () => {
    expect(isPathActive('/admin/dashboard/home-adverts', '/admin/dashboard/home-adverts')).toBe(
      true
    );
  });

  it('honors exact mode', () => {
    expect(isPathActive('/admin/dashboard/home/extra', '/admin/dashboard/home', true)).toBe(false);
  });
});
