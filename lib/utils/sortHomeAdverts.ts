import type { IHomeAdvertItem } from '@/lib/constants/endpoints';

function createdAtSortKey(createdAt: string | undefined): number {
  if (!createdAt) return Number.POSITIVE_INFINITY;

  const parsed = Date.parse(createdAt);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

export function sortHomeAdverts(adverts: IHomeAdvertItem[]): IHomeAdvertItem[] {
  return adverts
    .filter(a => a.isActive !== false)
    .sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;

      return createdAtSortKey(a.createdAt) - createdAtSortKey(b.createdAt);
    });
}
