'use client';

import { create } from 'zustand';
import { callApi } from '@/lib/services/callApi';
import type { ContentFavoriteEntityType } from '@/lib/constants/endpoints';
import { favoriteKey } from '@/lib/utils/favorites';
import { toast } from 'sonner';

interface FavoritesStore {
  hydrated: boolean;
  favoriteKeys: Record<string, true>;
  pendingKeys: Record<string, true>;
  actions: {
    reset: () => void;
    hydrateFromServer: () => Promise<void>;
    isFavorite: (entityType: ContentFavoriteEntityType, entityId: string) => boolean;
    isPending: (entityType: ContentFavoriteEntityType, entityId: string) => boolean;
    toggleFavorite: (
      entityType: ContentFavoriteEntityType,
      entityId: string
    ) => Promise<{ favorited: boolean; error?: string }>;
  };
}

const initialState = {
  hydrated: false,
  favoriteKeys: {} as Record<string, true>,
  pendingKeys: {} as Record<string, true>,
};

export const useInitFavoritesStore = create<FavoritesStore>()((set, get) => ({
  ...initialState,
  actions: {
    reset: () => {
      set({ ...initialState });
    },
    hydrateFromServer: async () => {
      const keys: Record<string, true> = {};
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await callApi('USER_FAVORITES_LIST', {
          query: `?page=${page}&limit=100`,
        });

        if (res.type === 'error' || !res.data) {
          set({ hydrated: false, favoriteKeys: {} });
          return;
        }

        const data = res.data;

        for (const item of data.items) {
          keys[favoriteKey(item.entityType, item.entityId)] = true;
        }

        totalPages = data.pagination.totalPages;
        page += 1;
      }

      set({ hydrated: true, favoriteKeys: keys });
    },
    isFavorite: (entityType, entityId) => {
      return Boolean(get().favoriteKeys[favoriteKey(entityType, entityId)]);
    },
    isPending: (entityType, entityId) => {
      return Boolean(get().pendingKeys[favoriteKey(entityType, entityId)]);
    },
    toggleFavorite: async (entityType, entityId) => {
      const key = favoriteKey(entityType, entityId);
      const wasFavorite = Boolean(get().favoriteKeys[key]);

      set(state => ({
        pendingKeys: { ...state.pendingKeys, [key]: true },
        favoriteKeys: wasFavorite
          ? Object.fromEntries(Object.entries(state.favoriteKeys).filter(([k]) => k !== key))
          : { ...state.favoriteKeys, [key]: true },
      }));

      if (wasFavorite) {
        const removeRes = await callApi('USER_FAVORITES_REMOVE', {
          query: `/${entityType}/${entityId}`,
        });

        set(state => {
          const { [key]: _removed, ...pendingKeys } = state.pendingKeys;
          return { pendingKeys };
        });

        if (removeRes.type === 'error') {
          set(state => ({
            favoriteKeys: { ...state.favoriteKeys, [key]: true },
          }));
          return {
            favorited: true,
            error: removeRes.message || 'Failed to remove favorite.',
          };
        }

        toast.success('Removed from favorites.');
        return { favorited: false };
      }

      const addRes = await callApi('USER_FAVORITES_ADD', {
        payload: { entityType, entityId },
      });

      set(state => {
        const { [key]: _removed, ...pendingKeys } = state.pendingKeys;
        return { pendingKeys };
      });

      if (addRes.type === 'error') {
        set(state => {
          const next = { ...state.favoriteKeys };
          delete next[key];
          return { favoriteKeys: next };
        });
        return { favorited: false, error: addRes.message || 'Failed to add favorite.' };
      }

      toast.success('Added to favorites.');
      return { favorited: true };
    },
  },
}));

export const useFavoritesStore = useInitFavoritesStore;
