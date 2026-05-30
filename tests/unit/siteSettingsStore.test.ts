import { beforeEach, describe, expect, it, vi } from 'vitest';

const callApiMock = vi.fn();

vi.mock('@/lib/services/callApi', () => ({
  callApi: (...args: unknown[]) => callApiMock(...args),
}));

describe('useInitSiteSettingsStore ensureSettingsLoaded', () => {
  beforeEach(async () => {
    callApiMock.mockReset();
    callApiMock.mockResolvedValue({
      data: { label: 'test-slice' },
      error: null,
    });

    const { useInitSiteSettingsStore } = await import('@/lib/store/useSiteSettingsStore');
    useInitSiteSettingsStore.getState().actions.clearCache();
  });

  it('fetches missing slices and skips network when cache is warm', async () => {
    const { useInitSiteSettingsStore } = await import('@/lib/store/useSiteSettingsStore');

    await useInitSiteSettingsStore
      .getState()
      .actions.ensureSettingsLoaded(['socials', 'appDetails']);

    expect(callApiMock).toHaveBeenCalledTimes(2);
    expect(useInitSiteSettingsStore.getState().loadedSlices.has('socials')).toBe(true);
    expect(useInitSiteSettingsStore.getState().loadedSlices.has('appDetails')).toBe(true);

    callApiMock.mockClear();

    await useInitSiteSettingsStore
      .getState()
      .actions.ensureSettingsLoaded(['socials', 'appDetails']);

    expect(callApiMock).not.toHaveBeenCalled();
  });
});
