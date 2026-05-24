import { describe, expect, it } from 'vitest';
import { CONTENT_IMAGE_DEFAULTS } from '@/lib/constants/contentImageDefaults';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';

type TestRow = { image?: string; name: string };

describe('phase 3 dashboard image display', () => {
  it('uses the dashboard placeholder default', () => {
    expect(CONTENT_IMAGE_DEFAULTS.dashboard).toBe('/placeholder.svg');
  });

  it('exposes a reusable admin table thumbnail column', () => {
    const column = dashboardThumbnailColumn<TestRow>(
      row => row.image,
      row => row.name,
      { header: 'Logo', rounded: 'full' }
    );
    expect(column.id).toBe('thumbnail');
  });
});
