import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const adminModals = [
  {
    file: 'components/section/admin/artists-pastors/CreateArtistModal.tsx',
    fields: ['image', 'coverImage'],
  },
  {
    file: 'components/section/admin/artists-pastors/CreatePastorModal.tsx',
    fields: ['image'],
  },
  {
    file: 'components/section/admin/resources/CreateResourceModal.tsx',
    fields: ['coverImage'],
  },
  {
    file: 'components/section/admin/testimonies/CreateTestimonyModal.tsx',
    fields: ['avatar'],
  },
  {
    file: 'components/section/admin/marketplace/CreateVendorModal.tsx',
    fields: ['logo'],
  },
  {
    file: 'components/section/admin/marketplace/CreateProductModal.tsx',
    fields: ['images'],
  },
] as const;

describe('phase 5 admin modal image fields', () => {
  it.each(adminModals)('$file imports MediaUrlOrUploadField and useFileUpload', ({ file }) => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');

    expect(source).toContain('MediaUrlOrUploadField');
    expect(source).toContain('useFileUpload');
  });

  it.each(adminModals)('$file includes expected image form state keys', ({ file, fields }) => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');

    for (const field of fields) {
      expect(source).toContain(field);
    }
  });
});
