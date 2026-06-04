'use client';
import { create } from 'zustand';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { Permission } from '@/lib/types/server-models';
import type { ClientAdmin, PopulatedUser } from '../constants/endpoints';
import { callApi } from '../services/callApi';
import { getRouter } from '../utils/navigation';
import { useInitFavoritesStore } from './favoritesStore';

export interface AuthStore {
  initLoading: boolean;
  loginLoading: boolean;
  pauseNavigatingAwayFromAuth: boolean;
  user: ClientAdmin | PopulatedUser | null;
  permissions: Permission[];
  actions: {
    setUser: (
      user: ClientAdmin | PopulatedUser | null,
      options?: {
        permissions?: Permission[];
        initLoading?: boolean;
        pauseNavigatingAwayFromAuth?: boolean;
      }
    ) => void;
    setPermissions: (permissions: Permission[]) => void;
    initSession: () => Promise<void>;
    clearSession: () => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    googleLogin: (googleCode: string) => Promise<{
      success: boolean;
      error?: string;
      suspended?: boolean;
      suspendedPayload?: import('@/lib/types/rolePortal').AccountSuspendedPayload;
    }>;
    logout: () => Promise<void>;
  };
}

const initialData: Omit<AuthStore, 'actions'> = {
  initLoading: false,
  loginLoading: false,
  pauseNavigatingAwayFromAuth: false,
  user: null,
  permissions: [],
};

export const useInitAuthStore = create<AuthStore>()((set, get) => ({
  ...initialData,
  actions: {
    setUser: (user, options) => {
      const pauseNavigatingAwayFromAuth = options?.pauseNavigatingAwayFromAuth ?? false;
      const permissions = options?.permissions ?? [];
      const initLoading = options?.initLoading ?? false;

      set({
        user,
        ...(permissions.length > 0 ? { permissions } : {}),
        initLoading,
        pauseNavigatingAwayFromAuth,
      });

      if (!user?._id) {
        useInitFavoritesStore.getState().actions.reset();
        return;
      }

      // Favorites and cart merge require client-access; customer accounts only (not admin console users).
      if ('phoneNumber' in user) {
        void useInitFavoritesStore.getState().actions.hydrateFromServer();
        void import('./cartStore').then(({ mergeGuestCartWithBackend }) =>
          mergeGuestCartWithBackend()
        );
      }
    },
    setPermissions: permissions => {
      set({ permissions });
    },
    initSession: async () => {
      set({ initLoading: true });
      const { setUser, clearSession } = get().actions;

      try {
        const { data, error } = await callApi('AUTH_SESSION', {});

        if (error || !data) {
          clearSession();
          return;
        }

        // Backend uses optional auth: may return 200 with user: null instead of 401
        // Treat user: null as unauthenticated (same as 401) - clear session so
        // AdminAuthWrapper redirects to admin login
        if (!data.user || !data.user._id) {
          clearSession();
          return;
        }

        setUser(data.user);
      } catch (error) {
        void error;
        clearSession();
      } finally {
        set({ initLoading: false });
      }
    },
    clearSession: () => {
      useInitFavoritesStore.getState().actions.reset();
      set({ ...initialData, initLoading: false });
    },
    login: async (email: string, password: string) => {
      set({ loginLoading: true });
      const { setUser } = get().actions;

      try {
        const { data, error } = await callApi('AUTH_LOGIN', {
          payload: { email, password },
        });

        if (error || !data) {
          return {
            success: false,
            error: error?.message || 'Login failed',
          };
        }

        setUser(data.user, {
          pauseNavigatingAwayFromAuth: false,
        });

        return { success: true };
      } catch (error) {
        void error;
        return {
          success: false,
          error: 'An unexpected error occurred',
        };
      } finally {
        set({ loginLoading: false });
      }
    },
    googleLogin: async (googleCode: string) => {
      set({ loginLoading: true });
      const { setUser } = get().actions;

      try {
        const { data, error } = await callApi('AUTH_GOOGLE_LOGIN', {
          payload: { googleCode },
        });

        if (error || !data) {
          const payload = error?.data as
            | import('@/lib/types/rolePortal').AccountSuspendedPayload
            | undefined;
          if (payload?.code === 'ACCOUNT_SUSPENDED') {
            return {
              success: false,
              error: error?.message || 'Your account has been suspended',
              suspended: true,
              suspendedPayload: payload,
            };
          }

          return {
            success: false,
            error: error?.message || 'Google login failed',
          };
        }

        setUser(data.user, {
          pauseNavigatingAwayFromAuth: true,
        });

        return { success: true };
      } catch (error) {
        void error;
        return {
          success: false,
          error: 'An unexpected error occurred',
        };
      } finally {
        set({ loginLoading: false });
      }
    },
    logout: async () => {
      const {
        actions: { clearSession },
        user,
      } = get();

      try {
        await callApi('AUTH_LOGOUT', {});
      } catch {
        void 0;
      } finally {
        clearSession();

        // Redirect: admin to admin login, customer/marketplace to home (IUser has phoneNumber, IAdmin does not)
        const router = getRouter();
        if (router) {
          const isCustomer = user && 'phoneNumber' in user;
          router.replace(isCustomer ? '/' : '/admin/auth/login');
        }
      }
    },
  },
}));

export const useAuthStore = <T>(selector: SelectorFn<AuthStore, T>) => {
  const state = useInitAuthStore(useShallow(selector));
  return state;
};
