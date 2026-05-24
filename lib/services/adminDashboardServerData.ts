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
  AlbumListItem,
  DevotionalListItem,
  PollListItem,
  ResourceListItem,
  TestimonyListItem,
  PrayerRequestListItem,
  QuestionListItem,
  ArtistListItem,
} from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import {
  type AdminStandardListParams,
  type AdminCategoriesListParams,
  type AdminHomeAdvertsListParams,
  type AdminDocumentsListParams,
  type AdminEmailLogsListParams,
  type AdminContentListParams,
  type AdminMusicListParams,
} from '@/lib/utils/adminDashboardSearchParams';
import { buildAdminListQuery } from '@/lib/admin/buildListQuery';
import { callServerApi } from '@/lib/services/serverApi';

export type AdminListPayload<T> = {
  items: T[];
  totalPages: number;
  listError: string | null;
};

function toContentParams(p: AdminStandardListParams): AdminContentListParams {
  return { ...p, category: 'all', artist: 'all', vendor: 'all' };
}

export async function serverFetchAdminMusicList(
  p: AdminStandardListParams | AdminContentListParams | AdminMusicListParams,
  sortKey: string
): Promise<AdminListPayload<ArtistMusicListItem>> {
  const content = 'category' in p ? p : toContentParams(p);
  const params = buildAdminListQuery('music', content, { sortKey });
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
  p: AdminStandardListParams | AdminContentListParams
): Promise<AdminListPayload<ArtistVideoListItem>> {
  const content = 'category' in p ? p : toContentParams(p);
  const params = buildAdminListQuery('content', content, { sort: '-createdAt' });
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
  p: AdminStandardListParams | AdminContentListParams
): Promise<AdminListPayload<PublicNewsListItem>> {
  const content = 'category' in p ? p : toContentParams(p);
  const params = buildAdminListQuery('content', content, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('standard', p, { sort: '-createdAt' });
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

export async function serverFetchAdminAlbumsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<AlbumListItem>> {
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
  const res = await callServerApi('ADMIN_ALBUMS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load albums' };
  }
  return {
    items: res.data.albums ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminDevotionalsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<DevotionalListItem>> {
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
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
  const params = buildAdminListQuery('standard', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
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
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
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
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
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

export async function serverFetchAdminAskAPastorList(
  p: AdminStandardListParams
): Promise<AdminListPayload<QuestionListItem>> {
  const params = buildAdminListQuery('content', toContentParams(p), { sort: '-createdAt' });
  const res = await callServerApi('ADMIN_ASK_PASTOR_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });
  if (res.type === 'error') {
    return { items: [], totalPages: 1, listError: res.message ?? 'Failed to load questions' };
  }
  return {
    items: res.data.questions ?? [],
    totalPages: res.data.pagination?.totalPages ?? 1,
    listError: null,
  };
}

export async function serverFetchAdminContactSubmissionsList(
  p: AdminStandardListParams
): Promise<AdminListPayload<ContactSubmission>> {
  const params = buildAdminListQuery('contactSubmissions', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('documents', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('emailLogs', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('categories', p, { sort: 'displayOrder' });
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
  const params = buildAdminListQuery('homeAdverts', p, { sort: 'displayOrder' });
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
  const params = buildAdminListQuery('artists', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('pastors', p, { sort: '-createdAt' });
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
  const params = buildAdminListQuery('standard', p, { sort: marketplaceSort });
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
  const params = buildAdminListQuery('marketplaceWithVendor', toContentParams(p), {
    sort: marketplaceSort,
  });
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
  const params = buildAdminListQuery('marketplaceWithVendor', toContentParams(p), {
    sort: marketplaceSort,
  });
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
