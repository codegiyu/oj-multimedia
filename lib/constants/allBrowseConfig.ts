import type { ContentCategoryScope } from '@/lib/types/server-models';
import type { ResourceType } from '@/lib/types/community';
import { RESOURCE_TYPE_FILTER_LABELS } from '@/lib/utils/resourceBrowse';

export type AllBrowseContentType =
  | 'music'
  | 'video'
  | 'news'
  | 'album'
  | 'devotional'
  | 'testimony'
  | 'prayer-request'
  | 'poll'
  | 'question'
  | 'resource'
  | 'artist';

export type AllBrowseSortOption = {
  value: string;
  label: string;
};

export type AllBrowseFilterOption = {
  value: string;
  label: string;
};

export type AllBrowseConfig = {
  contentKey: AllBrowseContentType;
  searchPlaceholder: string;
  sortOptions: AllBrowseSortOption[];
  categoryScope?: ContentCategoryScope;
  statusFilterOptions?: AllBrowseFilterOption[];
  /** When status filter is all/omitted, send this API status (e.g. polls → `all`). */
  statusAllQueryValue?: string;
  resourceTypeFilter?: {
    options: AllBrowseFilterOption[];
  };
};

export const ALL_BROWSE_DEFAULT_SORT = 'newest';

export const ALL_BROWSE_SORT_OPTIONS: AllBrowseSortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'featured', label: 'Featured' },
];

const RESOURCE_TYPE_FILTER_OPTIONS: AllBrowseFilterOption[] = (
  Object.entries(RESOURCE_TYPE_FILTER_LABELS) as [ResourceType, string][]
).map(([value, label]) => ({ value, label }));

export const ALL_BROWSE_CONFIG: Record<AllBrowseContentType, AllBrowseConfig> = {
  music: {
    contentKey: 'music',
    searchPlaceholder: 'Search songs, artists, albums…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'music',
  },
  video: {
    contentKey: 'video',
    searchPlaceholder: 'Search videos, creators, topics…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'video',
  },
  news: {
    contentKey: 'news',
    searchPlaceholder: 'Search news, headlines, topics…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'news',
  },
  album: {
    contentKey: 'album',
    searchPlaceholder: 'Search albums, artists…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
  },
  devotional: {
    contentKey: 'devotional',
    searchPlaceholder: 'Search devotionals, themes…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'devotional',
  },
  testimony: {
    contentKey: 'testimony',
    searchPlaceholder: 'Search testimonies, themes…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'testimony',
  },
  'prayer-request': {
    contentKey: 'prayer-request',
    searchPlaceholder: 'Search prayer requests…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'prayer-request',
    statusFilterOptions: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'answered', label: 'Answered' },
    ],
  },
  poll: {
    contentKey: 'poll',
    searchPlaceholder: 'Search polls, topics…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    statusFilterOptions: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'closed', label: 'Closed' },
    ],
    statusAllQueryValue: 'all',
  },
  question: {
    contentKey: 'question',
    searchPlaceholder: 'Search questions, topics…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'question',
    statusFilterOptions: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'answered', label: 'Answered' },
    ],
  },
  resource: {
    contentKey: 'resource',
    searchPlaceholder: 'Search resources, downloads…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
    categoryScope: 'resource',
    resourceTypeFilter: {
      options: [{ value: 'all', label: 'All types' }, ...RESOURCE_TYPE_FILTER_OPTIONS],
    },
  },
  artist: {
    contentKey: 'artist',
    searchPlaceholder: 'Search artists, genres…',
    sortOptions: ALL_BROWSE_SORT_OPTIONS,
  },
};

export function getAllBrowseConfig(contentType: AllBrowseContentType): AllBrowseConfig {
  return ALL_BROWSE_CONFIG[contentType];
}
