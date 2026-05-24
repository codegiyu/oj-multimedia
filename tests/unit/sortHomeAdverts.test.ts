import { describe, expect, it } from 'vitest';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';
import { sortHomeAdverts } from '@/lib/utils/sortHomeAdverts';

function advert(overrides: Partial<IHomeAdvertItem> = {}): IHomeAdvertItem {
  return {
    _id: '507f1f77bcf86cd799439011',
    slot: 'after_hero',
    imageUrl: 'https://cdn.example/ad.jpg',
    displayOrder: 0,
    ...overrides,
  };
}

describe('sortHomeAdverts', () => {
  it('sorts by displayOrder ascending', () => {
    const input = [
      advert({ _id: 'b', displayOrder: 2 }),
      advert({ _id: 'a', displayOrder: 0 }),
      advert({ _id: 'c', displayOrder: 1 }),
    ];

    expect(sortHomeAdverts(input).map(a => a._id)).toEqual(['a', 'c', 'b']);
  });

  it('breaks displayOrder ties by older createdAt first', () => {
    const input = [
      advert({ _id: 'newer', displayOrder: 1, createdAt: '2026-02-01T00:00:00.000Z' }),
      advert({ _id: 'older', displayOrder: 1, createdAt: '2026-01-01T00:00:00.000Z' }),
    ];

    expect(sortHomeAdverts(input).map(a => a._id)).toEqual(['older', 'newer']);
  });

  it('places adverts without createdAt after those with createdAt at the same displayOrder', () => {
    const input = [
      advert({ _id: 'no-date', displayOrder: 0 }),
      advert({ _id: 'dated', displayOrder: 0, createdAt: '2026-01-15T00:00:00.000Z' }),
    ];

    expect(sortHomeAdverts(input).map(a => a._id)).toEqual(['dated', 'no-date']);
  });

  it('excludes inactive adverts', () => {
    const input = [
      advert({ _id: 'active', isActive: true }),
      advert({ _id: 'inactive', isActive: false }),
    ];

    expect(sortHomeAdverts(input).map(a => a._id)).toEqual(['active']);
  });
});
