import { describe, expect, it } from 'vitest';
import { DashboardBrandBlock, DashboardProfileMenu } from '@/components/layout/shared';

describe('dashboard layout shared exports', () => {
  it('exports DashboardBrandBlock and DashboardProfileMenu', () => {
    expect(DashboardBrandBlock).toBeDefined();
    expect(DashboardProfileMenu).toBeDefined();
  });
});
