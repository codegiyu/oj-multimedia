export type ChartTrend = 'up' | 'down' | 'same';

export function chartTrendAriaLabel(trend: ChartTrend): string {
  if (trend === 'up') return 'Rank moved up';
  if (trend === 'down') return 'Rank moved down';

  return 'Rank unchanged';
}

export function formatChartChangePercent(trend: ChartTrend, change: number): string {
  const prefix = trend === 'up' ? '+' : trend === 'down' ? '-' : '';

  return `${prefix}${Math.abs(change)}%`;
}
