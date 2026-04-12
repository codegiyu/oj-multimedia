import type {
  ArtistMusicListItem,
  ArtistVideoListItem,
  ClientSiteSettings,
  ContactSubmission,
  IContentCategoryItem,
  IEmailLog,
  IHomeAdvertItem,
  IMarketplaceProduct,
  IMarketplaceVendor,
  PopulatedMarketplaceOrder,
  PublicNewsListItem,
} from '@/lib/constants/endpoints';
import type { IGospelVerse } from '@/lib/types/server-models';
import type {
  DevotionalListItem,
  PollListItem,
  ResourceListItem,
  TestimonyListItem,
  PrayerRequestListItem,
  ArtistListItem,
} from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import {
  type AdminStandardListParams,
  type AdminCategoriesListParams,
  type AdminHomeAdvertsListParams,
  type AdminDocumentsListParams,
  type AdminEmailLogsListParams,
} from '@/lib/utils/adminDashboardSearchParams';
import { callServerApi } from '@/lib/services/serverApi';
import { ADMIN_DASHBOARD_LIST_PAGE_SIZE } from '@/lib/constants/pagination';

/** Ensures API `limit` is a positive integer string (backend: `^[0-9]+$`). */
function limitQueryValue(pageSize: unknown): string {
  const n =
    typeof pageSize === 'number' && Number.isFinite(pageSize)
      ? Math.floor(pageSize)
      : parseInt(String(pageSize ?? '').trim(), 10);
  const safe = Number.isFinite(n) && n > 0 ? n : ADMIN_DASHBOARD_LIST_PAGE_SIZE;
  return String(safe);
}

export type AdminListPayload<T> = {
  items: T[];
  totalPages: number;
  listError: string | null;
};

function standardQueryParams(p: AdminStandardListParams, sort: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', sort);
  if (p.search.trim()) params.set('search', p.search.trim());
  if (p.status && p.status !== 'all') params.set('status', p.status);
  return params;
}

function musicSortParam(sortKey: string): string {
  if (sortKey === 'downloads') return '-downloads';
  if (sortKey === 'plays') return '-plays';
  return '-createdAt';
}

export async function serverFetchAdminMusicList(
  p: AdminStandardListParams,
  sortKey: string
): Promise<AdminListPayload<ArtistMusicListItem>> {
  const params = standardQueryParams(p, musicSortParam(sortKey));
  const res = await callServerApi('ADMIN_MUSIC_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load music' };
  }
  return {
    items: res.data.music ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminVideosList(
  p: AdminStandardListParams
): Promise<AdminListPayload<ArtistVideoListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_VIDEOS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load videos' };
  }
  return {
    items: res.data.videos ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminNewsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<PublicNewsListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_NEWS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load news' };
  }
  return {
    items: res.data.news ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminPollsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<PollListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_POLLS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load polls' };
  }
  return {
    items: res.data.polls ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminDevotionalsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<DevotionalListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_DEVOTIONALS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load devotionals' };
  }
  return {
    items: res.data.devotionals ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminGospelVersesList(
  p: AdminStandardListParams
): Promise<AdminListPayload<IGospelVerse>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_GOSPEL_VERSES_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load gospel verses' };
  }
  return {
    items: res.data.gospelVerses ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminResourcesList(
  p: AdminStandardListParams
): Promise<AdminListPayload<ResourceListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_RESOURCES_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load resources' };
  }
  return {
    items: res.data.resources ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminTestimoniesList(
  p: AdminStandardListParams
): Promise<AdminListPayload<TestimonyListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_TESTIMONIES_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load testimonies' };
  }
  return {
    items: res.data.testimonies ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminPrayerRequestsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<PrayerRequestListItem>> {
  const params = standardQueryParams(p, '-createdAt');
  const res = await callServerApi('ADMIN_PRAYER_REQUESTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load prayer requests' };
  }
  return {
    items: res.data.prayerRequests ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminContactSubmissionsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<ContactSubmission>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', '-createdAt');
  if (p.search.trim()) params.set('search', p.search.trim());
  const res = await callServerApi('ADMIN_CONTACT_SUBMISSIONS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load submissions' };
  }
  return {
    items: res.data.contactSubmissions ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminDocumentsList(
  p: AdminDocumentsListParams
): Promise<AdminListPayload<Record<string, unknown>>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', '-createdAt');
  if (p.status && p.status !== 'all') params.set('status', p.status);
  const res = await callServerApi('ADMIN_DOCUMENTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load documents' };
  }
  return {
    items: res.data.documents ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminEmailLogsList(
  p: AdminEmailLogsListParams
): Promise<AdminListPayload<IEmailLog>> {
  const params = new URLSearchParams();
  if (p.filterStatus !== 'all') params.set('status', p.filterStatus);
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', '-createdAt');
  const res = await callServerApi('ADMIN_EMAIL_LOGS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load email logs' };
  }
  return {
    items: res.data.emailLogs ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminContentCategoriesList(
  p: AdminCategoriesListParams
): Promise<AdminListPayload<IContentCategoryItem>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', 'displayOrder');
  if (p.search.trim()) params.set('search', p.search.trim());
  if (p.scope && p.scope !== 'all') params.set('scope', p.scope);
  const res = await callServerApi('ADMIN_CONTENT_CATEGORIES_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load categories' };
  }
  return {
    items: res.data.categories ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminHomeAdvertsList(
  p: AdminHomeAdvertsListParams
): Promise<AdminListPayload<IHomeAdvertItem>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', 'displayOrder');
  if (p.slot && p.slot !== 'all') params.set('slot', p.slot);
  const res = await callServerApi('ADMIN_HOME_ADVERTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load adverts' };
  }
  return {
    items: res.data.adverts ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminArtistsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<ArtistListItem>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', '-createdAt');
  if (p.search.trim()) params.set('search', p.search.trim());
  const res = await callServerApi('ADMIN_ARTISTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load artists' };
  }
  return {
    items: res.data.artists ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminPastorsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<PastorListItem>> {
  const params = new URLSearchParams();
  params.set('page', String(p.page));
  params.set('limit', limitQueryValue(p.pageSize));
  params.set('sort', '-createdAt');
  if (p.search.trim()) params.set('search', p.search.trim());
  const res = await callServerApi('ADMIN_PASTORS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load pastors' };
  }
  return {
    items: res.data.pastors ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

const marketplaceSort = '-createdAt';

export async function serverFetchAdminVendorsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<IMarketplaceVendor>> {
  const params = standardQueryParams(p, marketplaceSort);
  const res = await callServerApi('ADMIN_VENDORS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load vendors' };
  }
  return {
    items: res.data.vendors ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminProductsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<IMarketplaceProduct>> {
  const params = standardQueryParams(p, marketplaceSort);
  const res = await callServerApi('ADMIN_PRODUCTS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load products' };
  }
  return {
    items: res.data.products ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminOrdersList(
  p: AdminStandardListParams
): Promise<AdminListPayload<PopulatedMarketplaceOrder>> {
  const params = standardQueryParams(p, marketplaceSort);
  const res = await callServerApi('ADMIN_ORDERS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load orders' };
  }
  return {
    items: res.data.orders ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchSiteSettingsAll(): Promise<{
  settings: ClientSiteSettings | null;
  loadError: string | null;
}> {
  const res = await callServerApi('GET_SITE_SETTINGS', { query: '/all' });
  if (res.type === 'error') {
    return {
      settings: null,
      loadError: res.message ?? 'Failed to load settings',
    };
  }
  return { settings: res.data as ClientSiteSettings, loadError: null };
}
