import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('phase admin create owner pickers (frontend)', () => {
  it('create artist/vendor modals include optional owner picker', () => {
    const artist = readFileSync(
      join(process.cwd(), 'components/section/admin/artists/CreateArtistModal.tsx'),
      'utf8'
    );
    const vendor = readFileSync(
      join(process.cwd(), 'components/section/admin/marketplace/CreateVendorModal.tsx'),
      'utf8'
    );

    expect(artist).toContain('AdminUserAccountPicker');
    expect(artist).toContain('ownerUserId');
    expect(vendor).toContain('AdminUserAccountPicker');
    expect(vendor).toContain('ownerUserId');
  });
});
