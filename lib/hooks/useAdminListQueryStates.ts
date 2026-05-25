'use client';

import { useMemo } from 'react';
import { useQueryStates } from 'nuqs';
import { buildAdminListNuqsParsers } from '@/lib/admin/adminListNuqsParsers';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import type { AdminListResourceKey } from '@/lib/admin/listFilters';

export type AdminListQueryValues = Record<string, string | number | null>;

export type AdminListQuerySetters = {
  page: (page: number) => void;
  search: (search: string) => void;
  set: (patch: Partial<AdminListQueryValues>) => void;
  setRecordId: (id: string | null) => void;
  clearRecordId: () => void;
};

export function useAdminListQueryStates(resource: AdminListResourceKey) {
  const parsers = useMemo(() => buildAdminListNuqsParsers(resource), [resource]);
  const [state, setState] = useQueryStates(parsers, { history: 'replace', shallow: false });

  const refreshKey = useMemo(
    () => serializeAdminListUrlKey(state as Record<string, unknown>),
    [state]
  );

  const setters: AdminListQuerySetters = useMemo(
    () => ({
      page: page => setState({ page }),
      search: search => setState({ search, page: 1 }),
      set: patch => setState(patch),
      setRecordId: id => setState({ id: id ?? '' }),
      clearRecordId: () => setState({ id: '' }),
    }),
    [setState]
  );

  return {
    state: state as AdminListQueryValues,
    setState,
    setters,
    refreshKey,
    recordId: typeof state.id === 'string' && state.id ? state.id : null,
  };
}
