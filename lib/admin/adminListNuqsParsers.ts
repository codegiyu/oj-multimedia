import { parseAsInteger, parseAsString, type ParserBuilder, type SingleParser } from 'nuqs';
import {
  ADMIN_LIST_FILTER_ALL,
  ADMIN_LIST_FILTER_FIELDS,
  type AdminListFilterField,
  type AdminListResourceKey,
} from '@/lib/admin/listFilters';

type NuqsParser = SingleParser<string> | SingleParser<number> | ParserBuilder<string>;

const FILTER_DEFAULTS: Partial<Record<AdminListFilterField, string>> = {
  status: ADMIN_LIST_FILTER_ALL,
  category: ADMIN_LIST_FILTER_ALL,
  artist: ADMIN_LIST_FILTER_ALL,
  vendor: ADMIN_LIST_FILTER_ALL,
  scope: ADMIN_LIST_FILTER_ALL,
  slot: ADMIN_LIST_FILTER_ALL,
  entityType: ADMIN_LIST_FILTER_ALL,
  intent: ADMIN_LIST_FILTER_ALL,
  type: ADMIN_LIST_FILTER_ALL,
  tab: ADMIN_LIST_FILTER_ALL,
  isActive: ADMIN_LIST_FILTER_ALL,
  sort: '',
  startDate: '',
  endDate: '',
};

function parserForField(field: AdminListFilterField): NuqsParser {
  if (field === 'search') {
    return parseAsString.withDefault('');
  }

  const defaultValue = FILTER_DEFAULTS[field] ?? ADMIN_LIST_FILTER_ALL;
  return parseAsString.withDefault(defaultValue);
}

/** Typed nuqs parsers per admin list resource (client URL state). */
export function buildAdminListNuqsParsers(
  resource: AdminListResourceKey
): Record<string, NuqsParser> {
  const fields = ADMIN_LIST_FILTER_FIELDS[resource];
  const parsers: Record<string, NuqsParser> = {
    page: parseAsInteger.withDefault(1),
    id: parseAsString.withDefault('').withOptions({ shallow: true, history: 'replace' }),
  };

  for (const field of fields) {
    parsers[field] = parserForField(field);
  }

  if (resource === 'music' && !('sort' in parsers)) {
    parsers.sort = parseAsString.withDefault('newest');
  }

  return parsers;
}
