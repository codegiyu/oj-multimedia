import { describe, expect, it } from 'vitest';
import { computeAdminTabGateState } from '@/lib/hooks/useAdminServerTabGate';

describe('computeAdminTabGateState', () => {
  it('uses client tab when server and client match', () => {
    const state = computeAdminTabGateState('products', 'products');
    expect(state.tabDataReady).toBe(true);
    expect(state.displayTab).toBe('products');
    expect(state.isTabTransitioning).toBe(false);
  });

  it('keeps server tab data while client tab is ahead of SSR', () => {
    const state = computeAdminTabGateState('vendors', 'products');
    expect(state.tabDataReady).toBe(false);
    expect(state.displayTab).toBe('vendors');
    expect(state.isTabTransitioning).toBe(true);
  });
});
