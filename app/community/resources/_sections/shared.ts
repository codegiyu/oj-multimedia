import { RESOURCE_TYPES } from '@/lib/types/community';

export const RESOURCE_TYPE_ORDER: (typeof RESOURCE_TYPES)[number][] = [
  'ebook',
  'template',
  'beat',
  'wallpaper',
  'affiliate',
];

export const RESOURCES_BASE_QUERY = '?limit=50&page=1';
