import { ADMIN_DASHBOARD_LIST_PAGE_SIZE } from '@/lib/constants/pagination';
import {
  firstListPageSizeParam,
  firstSearchParam,
  parsePositiveInt,
} from '@/lib/utils/adminDashboardSearchParams';
import { ACCOUNT_FILTER_ALL } from '@/lib/account/accountListFilters';

export function parseAccountListPageParams(raw: Record<string, string | string[] | undefined>): {
  page: number;
  pageSize: number;
  search: string;
  status: string;
} {
  return {
    page: parsePositiveInt(firstSearchParam(raw.page), 1),
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), 10),
    search: firstSearchParam(raw.search) ?? '',
    status: firstSearchParam(raw.status) ?? '',
  };
}

export function parseAccountVendorProductsPageParams(
  raw: Record<string, string | string[] | undefined>
): {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  category: string;
} {
  const base = parseAccountListPageParams(raw);
  return {
    ...base,
    pageSize: parsePositiveInt(firstListPageSizeParam(raw), ADMIN_DASHBOARD_LIST_PAGE_SIZE),
    status: firstSearchParam(raw.status) ?? ACCOUNT_FILTER_ALL,
    category: firstSearchParam(raw.category) ?? ACCOUNT_FILTER_ALL,
  };
}
