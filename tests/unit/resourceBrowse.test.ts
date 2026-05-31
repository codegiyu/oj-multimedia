import { describe, expect, it } from 'vitest';
import {
  buildResourceBrowseQuery,
  parseResourceTypeFilter,
  mapPublicResourceBrowseItem,
} from '@/lib/utils/resourceBrowse';

describe('parseResourceTypeFilter', () => {
  it('defaults to all', () => {
    expect(parseResourceTypeFilter(undefined)).toBe('all');
    expect(parseResourceTypeFilter('all')).toBe('all');
  });

  it('accepts valid resource types', () => {
    expect(parseResourceTypeFilter('beat')).toBe('beat');
    expect(parseResourceTypeFilter('template')).toBe('template');
  });

  it('rejects unknown types', () => {
    expect(parseResourceTypeFilter('invalid')).toBe('all');
  });
});

describe('buildResourceBrowseQuery', () => {
  it('omits type for all', () => {
    const q = buildResourceBrowseQuery(1, 'all');

    expect(q).not.toContain('type=');
  });

  it('includes type filter', () => {
    const q = buildResourceBrowseQuery(2, 'ebook');

    expect(q).toContain('type=ebook');
    expect(q).toContain('page=2');
  });
});

describe('mapPublicResourceBrowseItem', () => {
  it('maps by type field', () => {
    const beat = mapPublicResourceBrowseItem({
      _id: '1',
      type: 'beat',
      title: 'Beat',
      description: 'd',
    });

    expect(beat.kind).toBe('beat');
  });
});
