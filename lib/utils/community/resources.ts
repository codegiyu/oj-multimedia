import { RESOURCES_ITEMS, type ResourceItem } from '@/lib/constants/community/resources';

/**
 * Get a resource item by its ID
 * @param id - The numeric ID of the resource item
 * @returns The resource item if found, undefined otherwise
 */
export function getResourceById(id: number): ResourceItem | undefined {
  return RESOURCES_ITEMS.find(item => item.id === id);
}

/**
 * Filter resources by type
 * @param type - The resource type to filter by
 * @returns Array of resources matching the type
 */
export function filterByType(
  type: 'ebook' | 'template' | 'beat' | 'wallpaper' | 'affiliate'
): ResourceItem[] {
  return RESOURCES_ITEMS.filter(item => item.type === type);
}
