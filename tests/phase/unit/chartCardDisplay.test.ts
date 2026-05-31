import { describe, expect, it } from 'vitest';
import {
  chartEntryBadgeLabel,
  chartMovementAriaLabel,
  formatChartRankChangeValue,
} from '@/lib/utils/chartCardDisplay';

describe('chartCardDisplay', () => {
  it('formatChartRankChangeValue returns null for zero change', () => {
    expect(formatChartRankChangeValue(0)).toBeNull();
    expect(formatChartRankChangeValue(4)).toBe('4');
  });

  it('chartMovementAriaLabel describes direction and magnitude', () => {
    expect(chartMovementAriaLabel('up', 0)).toBe('Rank unchanged');
    expect(chartMovementAriaLabel('up', 4)).toBe('Rank moved up 4 positions');
    expect(chartMovementAriaLabel('down', 1)).toBe('Rank moved down 1 position');
  });

  it('chartEntryBadgeLabel maps situational badges', () => {
    expect(chartEntryBadgeLabel('new').label).toBe('New');
    expect(chartEntryBadgeLabel('reentry').label).toBe('Re-entry');
    expect(chartEntryBadgeLabel('peak').label).toBe('Peak');
  });
});
