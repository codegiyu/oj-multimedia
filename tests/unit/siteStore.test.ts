import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useInitSiteStore', () => {
  beforeEach(async () => {
    const { useInitSiteStore } = await import('@/lib/store/siteStore');
    useInitSiteStore.setState({ siteLoading: true });
  });

  it('starts with siteLoading true and does not persist loading state', async () => {
    const { useInitSiteStore } = await import('@/lib/store/siteStore');
    const source = readFileSync(join(process.cwd(), 'lib/store/siteStore.ts'), 'utf8');

    expect(useInitSiteStore.getState().siteLoading).toBe(true);
    expect(source).not.toContain("from 'zustand/middleware'");
    expect(source).not.toContain('partialize');
  });

  it('updates siteLoading in memory only', async () => {
    const { useInitSiteStore } = await import('@/lib/store/siteStore');

    useInitSiteStore.getState().actions.setSiteLoading(false);
    expect(useInitSiteStore.getState().siteLoading).toBe(false);

    useInitSiteStore.getState().actions.setSiteLoading(true);
    expect(useInitSiteStore.getState().siteLoading).toBe(true);
  });
});
