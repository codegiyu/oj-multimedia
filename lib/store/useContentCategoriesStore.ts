'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { IContentCategoryItem } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import type { SelectorFn } from '@/lib/types/general';

type ContentCategoryScope = IContentCategoryItem['scope'];
type Audience = 'public' | 'admin';
type CacheKey = `${Audience}:${ContentCategoryScope}`;

function buildCacheKey(scope: ContentCategoryScope, audience: Audience): CacheKey {
  return `${audience}:${scope}`;
}

export interface ContentCategoriesStore {
  categoriesByKey: Partial<Record<CacheKey, IContentCategoryItem[]>>;
  loadingByKey: Partial<Record<CacheKey, boolean>>;
  errorByKey: Partial<Record<CacheKey, string | null>>;
  fetchedAtByKey: Partial<Record<CacheKey, Date | null>>;
  actions: {
    fetchCategories: (
      scope: ContentCategoryScope,
      options?: { force?: boolean; audience?: Audience }
    ) => Promise<IContentCategoryItem[]>;
    invalidateScope: (scope: ContentCategoryScope) => void;
    invalidateAll: () => void;
  };
}

export const useInitContentCategoriesStore = create<ContentCategoriesStore>()((set, get) => ({
  categoriesByKey: {},
  loadingByKey: {},
  errorByKey: {},
  fetchedAtByKey: {},
  actions: {
    fetchCategories: async (scope, options = {}) => {
      const audience = options.audience ?? 'public';
      const force = options.force ?? false;
      const key = buildCacheKey(scope, audience);
      const state = get();
      const cached = state.categoriesByKey[key] ?? [];
      const isLoading = state.loadingByKey[key];
      const fetchedAt = state.fetchedAtByKey[key] ?? null;

      // Fetch once per app load unless forced/invalidation resets this key.
      if (!force && cached.length > 0 && fetchedAt) {
        return cached;
      }

      if (isLoading) {
        return cached;
      }

      set(prev => ({
        loadingByKey: { ...prev.loadingByKey, [key]: true },
        errorByKey: { ...prev.errorByKey, [key]: null },
      }));

      try {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('limit', '500');
        params.set('sort', 'displayOrder');
        params.set('scope', scope);
        if (audience === 'public') params.set('isActive', 'true');

        const endpoint =
          audience === 'admin' ? 'ADMIN_CONTENT_CATEGORIES_LIST' : 'PUBLIC_GET_CONTENT_CATEGORIES';

        const res = await callApi(endpoint, {
          query: `?${params.toString()}` as `?${string}`,
        });

        if (res.type !== 'success') {
          throw new Error(res.error?.message ?? 'Failed to load categories');
        }

        const rows = (res.data.categories ?? []).filter(cat =>
          audience === 'public' ? cat.isActive !== false : true
        );

        set(prev => ({
          categoriesByKey: { ...prev.categoriesByKey, [key]: rows },
          loadingByKey: { ...prev.loadingByKey, [key]: false },
          errorByKey: { ...prev.errorByKey, [key]: null },
          fetchedAtByKey: { ...prev.fetchedAtByKey, [key]: new Date() },
        }));

        return rows;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load categories';
        set(prev => ({
          loadingByKey: { ...prev.loadingByKey, [key]: false },
          errorByKey: { ...prev.errorByKey, [key]: message },
        }));
        return cached;
      }
    },
    invalidateScope: scope => {
      const publicKey = buildCacheKey(scope, 'public');
      const adminKey = buildCacheKey(scope, 'admin');
      set(prev => ({
        fetchedAtByKey: {
          ...prev.fetchedAtByKey,
          [publicKey]: null,
          [adminKey]: null,
        },
      }));
    },
    invalidateAll: () => {
      set({
        categoriesByKey: {},
        loadingByKey: {},
        errorByKey: {},
        fetchedAtByKey: {},
      });
    },
  },
}));

export function useContentCategoriesStore<T>(selector: SelectorFn<ContentCategoriesStore, T>): T {
  return useInitContentCategoriesStore(useShallow(selector));
}

export function getCachedContentCategories(
  scope: ContentCategoryScope,
  audience: Audience = 'public'
): IContentCategoryItem[] {
  const key = buildCacheKey(scope, audience);
  return useInitContentCategoriesStore.getState().categoriesByKey[key] ?? [];
}
