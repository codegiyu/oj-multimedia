export type ChartTrend = 'up' | 'down' | 'same';
export type ChartEntry = 'new' | 'reentry' | 'peak';

export function formatChartRankChangeValue(change: number): string | null {
  if (change === 0) return null;

  return String(Math.abs(change));
}

export function chartMovementAriaLabel(trend: ChartTrend, change: number): string {
  if (change === 0) return 'Rank unchanged';

  if (trend === 'up') {
    return change === 1 ? 'Rank moved up 1 position' : `Rank moved up ${change} positions`;
  }

  if (trend === 'down') {
    return change === 1 ? 'Rank moved down 1 position' : `Rank moved down ${change} positions`;
  }

  return 'Rank unchanged';
}

export function chartEntryBadgeLabel(chartEntry: ChartEntry): {
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  ariaLabel: string;
} {
  if (chartEntry === 'new') {
    return { label: 'New', variant: 'default', ariaLabel: 'New chart entry' };
  }

  if (chartEntry === 'reentry') {
    return { label: 'Re-entry', variant: 'secondary', ariaLabel: 'Re-entry to the chart' };
  }

  return { label: 'Peak', variant: 'outline', ariaLabel: 'New peak chart position' };
}

/** @deprecated Use formatChartRankChangeValue + ChartMovementDisplay instead */
export function chartTrendAriaLabel(trend: ChartTrend): string {
  if (trend === 'up') return 'Rank moved up';
  if (trend === 'down') return 'Rank moved down';

  return 'Rank unchanged';
}

/** @deprecated Use formatChartRankChangeValue instead */
export function formatChartChangePercent(trend: ChartTrend, change: number): string {
  const value = formatChartRankChangeValue(change);
  if (value == null) return '—';

  return value;
}
