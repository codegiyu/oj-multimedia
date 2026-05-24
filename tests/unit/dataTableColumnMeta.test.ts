import { describe, expect, it } from 'vitest';
import {
  DASHBOARD_INLINE_TABLE_HUG_CLASS,
  getDataTableColumnWidthStyle,
  getDataTableHugClassName,
} from '@/lib/utils/dataTableColumnMeta';

describe('dataTableColumnMeta', () => {
  describe('getDataTableHugClassName', () => {
    it('returns shrink classes when hug is true', () => {
      expect(getDataTableHugClassName({ hug: true })).toBe('w-0 whitespace-nowrap');
    });

    it('returns empty string when hug is false or absent', () => {
      expect(getDataTableHugClassName({ hug: false })).toBe('');
      expect(getDataTableHugClassName(undefined)).toBe('');
      expect(getDataTableHugClassName({})).toBe('');
    });
  });

  describe('getDataTableColumnWidthStyle', () => {
    it('returns undefined for hug columns', () => {
      expect(getDataTableColumnWidthStyle({ hug: true, width: '3rem' })).toBeUndefined();
    });

    it('returns pixel width for numeric values', () => {
      expect(getDataTableColumnWidthStyle({ width: 48 })).toEqual({ width: '48px' });
    });

    it('returns string width for rem/percent values', () => {
      expect(getDataTableColumnWidthStyle({ width: '22%' })).toEqual({ width: '22%' });
      expect(getDataTableColumnWidthStyle({ width: '9rem' })).toEqual({ width: '9rem' });
    });

    it('returns undefined when no width is set', () => {
      expect(getDataTableColumnWidthStyle({})).toBeUndefined();
    });
  });

  it('exports inline table hug class constant', () => {
    expect(DASHBOARD_INLINE_TABLE_HUG_CLASS).toBe('w-0 whitespace-nowrap');
  });
});
