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

  it('adds favorite keys on successful toggle on', async () => {
    vi.mocked(callApi).mockResolvedValueOnce({
      type: 'success',
      message: 'Added',
      requestName: 'USER_FAVORITES_ADD',
      data: {
        item: {
          _id: 'f1',
          entityType: 'music',
          entityId: 'track-new',
          createdAt: '2026-05-20T00:00:00.000Z',
          title: 'Track',
          href: '/music/track-new',
        },
      },
    } as never);

    const { actions } = useInitFavoritesStore.getState();
    const result = await actions.toggleFavorite('music', 'track-new');

    expect(result.favorited).toBe(true);
    expect(actions.isFavorite('music', 'track-new')).toBe(true);
    expect(callApi).toHaveBeenCalledWith('USER_FAVORITES_ADD', {
      payload: { entityType: 'music', entityId: 'track-new' },
    });
  });

  it('hydrates favorite keys from paginated list responses', async () => {
    vi.mocked(callApi).mockResolvedValueOnce({
      type: 'success',
      message: 'OK',
      requestName: 'USER_FAVORITES_LIST',
      data: {
        items: [
          { entityType: 'music', entityId: 'a' },
          { entityType: 'video', entityId: 'b' },
        ],
        pagination: { page: 1, limit: 100, total: 2, totalPages: 1 },
      },
    } as never);

    const { actions } = useInitFavoritesStore.getState();

    await actions.hydrateFromServer();

    expect(useInitFavoritesStore.getState().hydrated).toBe(true);
    expect(actions.isFavorite('music', 'a')).toBe(true);
    expect(actions.isFavorite('video', 'b')).toBe(true);
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
