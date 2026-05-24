import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInitAuthStore } from './useAuthStore';

const hydrateFromServer = vi.fn().mockResolvedValue(undefined);
const resetFavorites = vi.fn();

vi.mock('./favoritesStore', () => ({
  useInitFavoritesStore: {
    getState: () => ({
      actions: {
        hydrateFromServer,
        reset: resetFavorites,
      },
    }),
  },
}));

describe('useAuthStore setUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInitAuthStore.getState().actions.clearSession();
    vi.clearAllMocks();
  });

  it('hydrates favorites when setting a customer user', () => {
    useInitAuthStore.getState().actions.setUser({
      _id: 'user-1',
      email: 'user@example.com',
      phoneNumber: '+1234567890',
    } as never);

    expect(hydrateFromServer).toHaveBeenCalledTimes(1);
    expect(resetFavorites).not.toHaveBeenCalled();
  });

  it('does not hydrate favorites for admin users', () => {
    useInitAuthStore.getState().actions.setUser({
      _id: 'admin-1',
      email: 'admin@example.com',
    } as never);

    expect(hydrateFromServer).not.toHaveBeenCalled();
  });

  it('resets favorites when clearing the user', () => {
    useInitAuthStore.getState().actions.setUser({
      _id: 'user-1',
      email: 'user@example.com',
      phoneNumber: '+1234567890',
    } as never);

    hydrateFromServer.mockClear();

    useInitAuthStore.getState().actions.setUser(null);

    expect(resetFavorites).toHaveBeenCalledTimes(1);
    expect(hydrateFromServer).not.toHaveBeenCalled();
  });
});
