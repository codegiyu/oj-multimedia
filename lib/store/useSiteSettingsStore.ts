'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientSiteSettings } from '../constants/endpoints';
import { callApi } from '../services/callApi';

// Define the available settings slices
export type SiteSettingsSlice =
  | 'all'
  | 'appDetails'
  | 'seo'
  | 'legal'
  | 'features'
  | 'analytics'
  | 'localization'
  | 'branding'
  | 'contactInfo'
  | 'socials';

export interface SiteSettingsStore {
  // State
  settings: Partial<ClientSiteSettings> | null;
  loadedSlices: Set<SiteSettingsSlice>;
  loadingSlices: Set<SiteSettingsSlice>;
  lastFetched: Date | null;
  fetchError: string | null;

  // Actions
  actions: {
    fetchSettings: (slice?: SiteSettingsSlice, options?: { force?: boolean }) => Promise<void>;
    ensureSettingsLoaded: (
      slices: SiteSettingsSlice[],
      options?: { force?: boolean }
    ) => Promise<void>;
    fetchAllSettings: (options?: { force?: boolean }) => Promise<void>;
    setSettings: (settings: Partial<ClientSiteSettings>) => void;
    updateSettings: (updates: Partial<ClientSiteSettings>) => void;
    clearCache: () => void;
    isSliceLoaded: (slice: SiteSettingsSlice) => boolean;
  };
}

type InitialSiteSettingsStore = Omit<SiteSettingsStore, 'actions'>;

const initialData: InitialSiteSettingsStore = {
  settings: null,
  loadedSlices: new Set(),
  loadingSlices: new Set(),
  lastFetched: null,
  fetchError: null,
};

/** Slices loaded once per session for global chrome (footer, etc.). */
export const PUBLIC_CHROME_SETTINGS_SLICES: SiteSettingsSlice[] = ['socials', 'appDetails'];

// Cache duration in minutes - longer for settings since they change less frequently
const CACHE_DURATION_MINUTES = 10;

const isCacheValid = (lastFetched: Date | null): boolean => {
  if (!lastFetched) return false;
  return differenceInMinutes(new Date(), lastFetched) < CACHE_DURATION_MINUTES;
};

const sliceNeedsFetch = (
  slice: SiteSettingsSlice,
  loadedSlices: Set<SiteSettingsSlice>,
  lastFetched: Date | null,
  force: boolean
): boolean => {
  if (force) return true;
  if (!isCacheValid(lastFetched)) return true;

  return !loadedSlices.has(slice);
};

export const useInitSiteSettingsStore = create<SiteSettingsStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchSettings: async (slice = 'all', options = {}) => {
      const { force = false } = options;
      const { lastFetched, loadingSlices, loadedSlices } = get();

      if (!sliceNeedsFetch(slice, loadedSlices, lastFetched, force)) {
        return;
      }

      if (loadingSlices.has(slice)) {
        return;
      }

      set(state => ({
        loadingSlices: new Set([...state.loadingSlices, slice]),
        fetchError: null,
      }));

      try {
        const { data, error } = await callApi('GET_SITE_SETTINGS', {
          query: `/${slice}`,
        });

        if (error || !data) {
          const errorMessage = error?.message || 'Failed to fetch site settings';
          console.error('Failed to fetch site settings:', errorMessage);
          set({ fetchError: errorMessage });
          return;
        }

        set(state => ({
          settings: {
            ...state.settings,
            ...(slice === 'all' ? data : { [slice]: data }),
          },
          loadedSlices: new Set([...state.loadedSlices, slice]),
          lastFetched: new Date(),
          fetchError: null,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch site settings';
        console.error('Failed to fetch site settings:', errorMessage);
        set({ fetchError: errorMessage });
      } finally {
        set(state => {
          const nextLoading = new Set(state.loadingSlices);
          nextLoading.delete(slice);

          return { loadingSlices: nextLoading };
        });
      }
    },

    ensureSettingsLoaded: async (slices, options = {}) => {
      const { actions } = get();
      const unique = [...new Set(slices)];

      for (const slice of unique) {
        await actions.fetchSettings(slice, options);
      }
    },

    fetchAllSettings: async (options = {}) => {
      const { actions } = get();
      await actions.fetchSettings('all', options);
    },

    setSettings: settings => {
      set({
        settings,
        loadedSlices: new Set(['all']),
        lastFetched: new Date(),
      });
    },

    updateSettings: updates => {
      set(state => ({
        settings: {
          ...state.settings,
          ...updates,
        },
      }));
    },

    clearCache: () => {
      set({
        ...initialData,
        loadedSlices: new Set(),
        loadingSlices: new Set(),
        fetchError: null,
      });
    },

    isSliceLoaded: slice => {
      const { loadedSlices, lastFetched } = get();
      return loadedSlices.has(slice) && isCacheValid(lastFetched);
    },
  },
}));

export const useSiteSettingsStore = <T>(selector: SelectorFn<SiteSettingsStore, T>) => {
  const state = useInitSiteSettingsStore(useShallow(selector));
  return state;
};
