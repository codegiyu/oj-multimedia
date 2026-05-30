/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo } from 'react';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import type { SelectOption } from '@/lib/types/general';
import {
  getCachedContentCategories,
  useContentCategoriesStore,
  useInitContentCategoriesStore,
} from '@/lib/store/useContentCategoriesStore';

type Scope = IContentCategoryItem['scope'];
type Audience = 'public' | 'admin';

const DEFAULT_ALL_LABEL: Record<Scope, string> = {
  music: 'All Categories',
  video: 'All Videos',
  news: 'All Stories',
  devotional: 'All',
  resource: 'All Resources',
  testimony: 'All Testimonies',
  'prayer-request': 'All Prayer Requests',
  poll: 'All Polls',
  question: 'All Questions',
};

export function useContentCategoryOptions({
  scope,
  audience = 'public',
  includeAllOption = false,
  allLabel,
  allValue = 'all',
}: {
  scope: Scope;
  audience?: Audience;
  includeAllOption?: boolean;
  allLabel?: string;
  allValue?: string;
}) {
  const {
    categoriesByKey,
    loadingByKey,
    errorByKey,
    actions: { fetchCategories },
  } = useContentCategoriesStore(state => state);
  const key = `${audience}:${scope}` as const;

  useEffect(() => {
    void fetchCategories(scope, { audience });
  }, [scope, audience]);

  const categories = useMemo(() => categoriesByKey[key] ?? [], [categoriesByKey, key]);
  const loading = loadingByKey[key] ?? false;
  const error = errorByKey[key] ?? null;

  const options = useMemo<SelectOption[]>(() => {
    const rows = categories.map(category => ({
      text: category.name,
      value: category.slug,
    }));
    if (!includeAllOption) return rows;
    return [{ text: allLabel ?? DEFAULT_ALL_LABEL[scope], value: allValue }, ...rows];
  }, [allLabel, allValue, categories, includeAllOption, scope]);

  return { categories, options, loading, error };
}

export async function getAdminCategorySelectOptions(scope: Scope): Promise<SelectOption[]> {
  const rows = await useInitContentCategoriesStore
    .getState()
    .actions.fetchCategories(scope, { audience: 'admin' });

  return rows.map(category => ({
    text: category.isActive === false ? `${category.name} (inactive)` : category.name,
    value: category.slug,
  }));
}

export function getCachedPublicCategorySlugs(scope: Scope): string[] {
  return getCachedContentCategories(scope, 'public').map(category => category.slug);
}
