import { buildAdminDashboardHref } from '@/lib/admin/adminListUrl';

/** Admin dashboard record types that support `?id=` deep links. */
export type AdminEntityRecordType =
  | 'artist'
  | 'pastor'
  | 'user'
  | 'vendor'
  | 'product'
  | 'music'
  | 'album'
  | 'video'
  | 'devotional'
  | 'news'
  | 'poll'
  | 'resource'
  | 'order'
  | 'testimony'
  | 'prayer-request'
  | 'ask-a-pastor'
  | 'contact-submission'
  | 'document'
  | 'content-category'
  | 'home-advert'
  | 'email-log';

type EntityRecordRoute = {
  pathname: string;
  /** Marketplace-style pages set `tab` before `id`. */
  tab?: string;
};

export const ADMIN_ENTITY_RECORD_ROUTES: Record<AdminEntityRecordType, EntityRecordRoute> = {
  artist: { pathname: '/admin/dashboard/artists' },
  pastor: { pathname: '/admin/dashboard/pastors' },
  user: { pathname: '/admin/dashboard/users' },
  vendor: { pathname: '/admin/dashboard/marketplace', tab: 'vendors' },
  product: { pathname: '/admin/dashboard/marketplace', tab: 'products' },
  music: { pathname: '/admin/dashboard/music' },
  album: { pathname: '/admin/dashboard/albums' },
  video: { pathname: '/admin/dashboard/videos' },
  devotional: { pathname: '/admin/dashboard/devotionals' },
  news: { pathname: '/admin/dashboard/news' },
  poll: { pathname: '/admin/dashboard/polls' },
  resource: { pathname: '/admin/dashboard/resources' },
  order: { pathname: '/admin/dashboard/marketplace', tab: 'orders' },
  testimony: { pathname: '/admin/dashboard/testimonies' },
  'prayer-request': { pathname: '/admin/dashboard/prayer-requests' },
  'ask-a-pastor': { pathname: '/admin/dashboard/ask-a-pastor' },
  'contact-submission': { pathname: '/admin/dashboard/contact-submissions' },
  document: { pathname: '/admin/dashboard/documents' },
  'content-category': { pathname: '/admin/dashboard/content-categories' },
  'home-advert': { pathname: '/admin/dashboard/home-adverts' },
  'email-log': { pathname: '/admin/dashboard/email-logs' },
};

/** List pages filtered by a related entity id (not record deep link). */
export type AdminEntityFilterTarget =
  | 'music'
  | 'albums'
  | 'videos'
  | 'devotionals'
  | 'marketplace-products'
  | 'marketplace-orders';

type EntityFilterRoute = {
  pathname: string;
  param: 'artist' | 'vendor' | 'category';
  tab?: string;
};

export const ADMIN_ENTITY_FILTER_ROUTES: Record<AdminEntityFilterTarget, EntityFilterRoute> = {
  music: { pathname: '/admin/dashboard/music', param: 'artist' },
  albums: { pathname: '/admin/dashboard/albums', param: 'artist' },
  videos: { pathname: '/admin/dashboard/videos', param: 'artist' },
  devotionals: { pathname: '/admin/dashboard/devotionals', param: 'artist' },
  'marketplace-products': {
    pathname: '/admin/dashboard/marketplace',
    param: 'vendor',
    tab: 'products',
  },
  'marketplace-orders': {
    pathname: '/admin/dashboard/marketplace',
    param: 'vendor',
    tab: 'orders',
  },
};

/** Maps document list `entityType` values to admin record routes. */
export const DOCUMENT_ENTITY_TYPE_TO_RECORD: Partial<Record<string, AdminEntityRecordType>> = {
  vendor: 'vendor',
  product: 'product',
  user: 'user',
  music: 'music',
  video: 'video',
  artist: 'artist',
};

export function resolveEntityId(ref: string | { _id?: string } | null | undefined): string | null {
  if (ref == null) return null;
  if (typeof ref === 'string') {
    const trimmed = ref.trim();
    return trimmed || null;
  }

  const id = ref._id != null ? String(ref._id).trim() : '';
  return id || null;
}

export type BuildAdminEntityHrefOptions = {
  tab?: string;
  listParams?: URLSearchParams;
};

/** Deep link to an admin list page with optional preserved filters and `?id=`. */
export function buildAdminEntityHref(
  entityType: AdminEntityRecordType,
  recordId: string,
  options: BuildAdminEntityHrefOptions = {}
): string {
  const route = ADMIN_ENTITY_RECORD_ROUTES[entityType];
  const params = new URLSearchParams(options.listParams?.toString() ?? '');
  const tab = options.tab ?? route.tab;

  if (tab) {
    params.set('tab', tab);
  }

  return buildAdminDashboardHref(route.pathname, params, recordId.trim());
}

export type BuildAdminEntityFilterHrefOptions = {
  listParams?: URLSearchParams;
};

/** Link to a filtered admin list (e.g. all music for an artist). */
export function buildAdminEntityFilterHref(
  target: AdminEntityFilterTarget,
  filterId: string,
  options: BuildAdminEntityFilterHrefOptions = {}
): string {
  const route = ADMIN_ENTITY_FILTER_ROUTES[target];
  const params = new URLSearchParams(options.listParams?.toString() ?? '');
  const id = filterId.trim();

  if (route.tab) {
    params.set('tab', route.tab);
  }

  params.set(route.param, id);

  const qs = params.toString();
  return qs ? `${route.pathname}?${qs}` : route.pathname;
}

/** Document rows store `entityType` + `entityId`; map type to a record href when known. */
export function buildAdminDocumentEntityHref(
  documentEntityType: string,
  entityId: string
): string | null {
  const recordType = DOCUMENT_ENTITY_TYPE_TO_RECORD[documentEntityType.trim().toLowerCase()];
  if (!recordType) return null;

  const id = entityId.trim();
  if (!id) return null;

  return buildAdminEntityHref(recordType, id);
}
