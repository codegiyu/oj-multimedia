import { describe, expect, it } from 'vitest';
import { chartTrendAriaLabel, formatChartChangePercent } from '@/lib/utils/chartCardDisplay';

describe('chartCardDisplay (phase 4)', () => {
  it('chartTrendAriaLabel describes movement', () => {
    expect(chartTrendAriaLabel('up')).toBe('Rank moved up');
    expect(chartTrendAriaLabel('down')).toBe('Rank moved down');
    expect(chartTrendAriaLabel('same')).toBe('Rank unchanged');
  });

  it('formatChartChangePercent includes sign and shows zero', () => {
    expect(formatChartChangePercent('up', 5)).toBe('+5%');
    expect(formatChartChangePercent('down', 3)).toBe('-3%');
    expect(formatChartChangePercent('same', 0)).toBe('0%');
  });
});
