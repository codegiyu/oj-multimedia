import { describe, expect, it } from 'vitest';
import {
  DASHBOARD_SIDEBAR_DESKTOP_MIN_PX,
  DASHBOARD_SIDEBAR_TABLET_MIN_PX,
  isDashboardTabletViewport,
} from '@/lib/dashboard/sidebarViewport';

describe('isDashboardTabletViewport', () => {
  it('uses md–lg range aligned with Tailwind breakpoints', () => {
    expect(DASHBOARD_SIDEBAR_TABLET_MIN_PX).toBe(768);
    expect(DASHBOARD_SIDEBAR_DESKTOP_MIN_PX).toBe(1024);
  });

  it('returns false below md and at lg+', () => {
    expect(isDashboardTabletViewport(767)).toBe(false);
    expect(isDashboardTabletViewport(1024)).toBe(false);
    expect(isDashboardTabletViewport(1280)).toBe(false);
  });

  it('returns true from md up to below lg', () => {
    expect(isDashboardTabletViewport(768)).toBe(true);
    expect(isDashboardTabletViewport(900)).toBe(true);
    expect(isDashboardTabletViewport(1023)).toBe(true);
  });
});
