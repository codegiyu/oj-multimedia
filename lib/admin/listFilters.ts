/**
 * Registry of admin list resources and which URL/API filter params they support.
 * Phase 1+ pages wire parsers and PageClients against these keys.
 */
export const ADMIN_LIST_FILTER_ALL = 'all';

export type AdminListResourceKey =
  | 'standard'
  | 'content'
  | 'music'
  | 'documents'
  | 'emailLogs'
  | 'categories'
  | 'homeAdverts'
  | 'contactSubmissions'
  | 'artists'
  | 'pastors'
  | 'marketplaceWithVendor'
  | 'marketplaceOrders';

export type AdminListFilterField =
  | 'search'
  | 'status'
  | 'sort'
  | 'category'
  | 'artist'
  | 'vendor'
  | 'scope'
  | 'slot'
  | 'entityType'
  | 'intent'
  | 'type'
  | 'tab'
  | 'startDate'
  | 'endDate'
  | 'isActive';

export const ADMIN_LIST_FILTER_FIELDS: Record<AdminListResourceKey, AdminListFilterField[]> = {
  standard: ['search', 'status', 'sort'],
  content: ['search', 'status', 'sort', 'category', 'artist', 'vendor'],
  music: ['search', 'status', 'sort', 'category', 'artist', 'vendor'],
  documents: ['search', 'status', 'sort', 'entityType', 'intent'],
  emailLogs: ['search', 'status', 'type', 'tab', 'startDate', 'endDate', 'sort'],
  categories: ['search', 'scope', 'sort', 'isActive'],
  homeAdverts: ['slot', 'search', 'sort'],
  contactSubmissions: ['search', 'sort'],
  artists: ['search', 'status', 'sort'],
  pastors: ['search', 'sort'],
  marketplaceWithVendor: ['search', 'status', 'sort', 'vendor', 'category'],
  marketplaceOrders: ['search', 'status', 'sort', 'vendor', 'startDate', 'endDate'],
};

export function adminListSupportsFilter(
  resource: AdminListResourceKey,
  field: AdminListFilterField
): boolean {
  return ADMIN_LIST_FILTER_FIELDS[resource].includes(field);
}
