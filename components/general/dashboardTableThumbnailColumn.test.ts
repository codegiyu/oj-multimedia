import { describe, expect, it } from 'vitest';
import { dashboardThumbnailColumn } from '@/components/general/dashboardTableThumbnailColumn';

type TestRow = { coverImage?: string; title: string };

describe('dashboardThumbnailColumn', () => {
  it('builds a column with thumbnail id and cover header', () => {
    const column = dashboardThumbnailColumn<TestRow>(
      row => row.coverImage,
      row => row.title
    );
    expect(column.id).toBe('thumbnail');
    expect(column.meta?.width).toBe('3.5rem');
  });
});
