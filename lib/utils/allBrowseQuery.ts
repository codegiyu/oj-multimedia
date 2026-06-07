import { ALL_BROWSE_DEFAULT_SORT, type AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { buildBrowseListQuery, parseBrowsePageParam } from '@/lib/utils/browsePage';

export type AllBrowseSearchParams = {
  page?: string;
  q?: string;
  sort?: string;
  category?: string;
  status?: string;
  type?: string;
};

export function parseAllBrowseQueryParams(params: AllBrowseSearchParams): AllBrowseQueryParams {
  return {
    page: parseBrowsePageParam(params.page),
    q: params.q,
    sort: params.sort,
    category: params.category,
    status: params.status,
    type: params.type,
  };
}

export function buildAllBrowseSuspenseKey(params: AllBrowseSearchParams): string {
  return ['q', 'sort', 'category', 'status', 'type', 'page']
    .map(key => params[key as keyof AllBrowseSearchParams]?.trim() ?? '')
    .join('|');
}

export type AllBrowseQueryParams = {
  page: number;
  limit?: number;
  q?: string;
  sort?: string;
  category?: string;
  status?: string;
  type?: string;
  artist?: string;
  period?: string;
  rising?: boolean | string;
  featured?: boolean | string;
  spotlight?: boolean | string;
};

function isTruthyFlag(value?: boolean | string): boolean {
  return value === true || value === 'true';
}

function resolveSortParam(
  sort?: string,
  defaultSort = ALL_BROWSE_DEFAULT_SORT
): string | undefined {
  const normalized = sort?.trim();

  if (!normalized || normalized === defaultSort) {
    return undefined;
  }

  return normalized;
}

function applyStatusExtra(
  config: AllBrowseConfig,
  params: AllBrowseQueryParams,
  extra: Record<string, string | undefined>
): void {
  if (!config.statusFilterOptions) {
    return;
  }

  const normalized = params.status?.trim();

  if (normalized && normalized !== 'all') {
    extra.status = normalized;
    return;
  }

  if (config.statusAllQueryValue) {
    extra.status = config.statusAllQueryValue;
  }
}

function finalizeStatusQuery(
  config: AllBrowseConfig,
  params: AllBrowseQueryParams,
  query: string
): string {
  if (!config.statusFilterOptions) {
    return query;
  }

  const normalized = params.status?.trim();
  const search = new URLSearchParams(query.slice(1));

  if (!normalized || normalized === 'all') {
    if (config.statusAllQueryValue) {
      search.set('status', config.statusAllQueryValue);
    } else {
      search.delete('status');
    }
  }

  return `?${search.toString()}`;
}

export function buildAllBrowseListQuery(
  config: AllBrowseConfig,
  params: AllBrowseQueryParams
): `?${string}` {
  const defaultSort = config.sortOptions[0]?.value ?? ALL_BROWSE_DEFAULT_SORT;
  const extra: Record<string, string | undefined> = {};

  const q = params.q?.trim();
  if (q) {
    extra.q = q;
  }

  const sort = resolveSortParam(params.sort, defaultSort);
  if (sort) {
    extra.sort = sort;
  }

  if (params.category && params.category !== 'all') {
    extra.category = params.category;
  }

  applyStatusExtra(config, params, extra);

  if (params.type && params.type !== 'all') {
    extra.type = params.type;
  }

  if (params.artist && params.artist !== 'all') {
    extra.artist = params.artist;
  }

  if (params.period && params.period !== 'all') {
    extra.period = params.period;
  }

  if (isTruthyFlag(params.rising)) {
    extra.rising = 'true';
  }

  if (isTruthyFlag(params.featured)) {
    extra.featured = 'true';
  }

  if (isTruthyFlag(params.spotlight)) {
    extra.spotlight = 'true';
  }

  const rawQuery = buildBrowseListQuery({
    page: params.page,
    limit: params.limit,
    extra: Object.keys(extra).length > 0 ? extra : undefined,
  });

  return finalizeStatusQuery(config, params, rawQuery) as `?${string}`;
}
