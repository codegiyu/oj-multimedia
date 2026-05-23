import type { ContentFavoriteEntityType } from '@/lib/constants/endpoints';

export function favoriteKey(entityType: ContentFavoriteEntityType, entityId: string): string {
  return `${entityType}:${entityId}`;
}
