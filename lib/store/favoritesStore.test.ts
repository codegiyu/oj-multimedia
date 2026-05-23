import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInitFavoritesStore } from '@/lib/store/favoritesStore';
import { callApi } from '@/lib/services/callApi';

vi.mock('@/lib/services/callApi', () => ({
  callApi: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('favoritesStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInitFavoritesStore.getState().actions.reset();
  });

  it('optimistically toggles favorites and rolls back on API error', async () => {
    vi.mocked(callApi).mockResolvedValueOnce({
      type: 'error',
      message: 'Failed',
      requestName: 'USER_FAVORITES_ADD',
      error: { success: false, message: 'Failed', responseCode: 500 },
    } as never);

    const { actions } = useInitFavoritesStore.getState();

    expect(actions.isFavorite('music', 'track-1')).toBe(false);

    const result = await actions.toggleFavorite('music', 'track-1');

    expect(result.favorited).toBe(false);
    expect(result.error).toBe('Failed');
    expect(actions.isFavorite('music', 'track-1')).toBe(false);
    expect(callApi).toHaveBeenCalledWith('USER_FAVORITES_ADD', {
      payload: { entityType: 'music', entityId: 'track-1' },
    });
  });

  it('removes favorite keys on successful toggle off', async () => {
    useInitFavoritesStore.setState({
      favoriteKeys: { 'music:track-2': true },
      hydrated: true,
    });

    vi.mocked(callApi).mockResolvedValueOnce({
      type: 'success',
      message: 'Removed',
      requestName: 'USER_FAVORITES_REMOVE',
      data: { success: true },
    } as never);

    const { actions } = useInitFavoritesStore.getState();
    const result = await actions.toggleFavorite('music', 'track-2');

    expect(result.favorited).toBe(false);
    expect(actions.isFavorite('music', 'track-2')).toBe(false);
    expect(callApi).toHaveBeenCalledWith('USER_FAVORITES_REMOVE', {
      query: '/music/track-2',
    });
  });
});
