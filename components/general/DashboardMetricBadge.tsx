'use client';

import { Download, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCompactNumber } from '@/lib/utils/general';
import { cn } from '@/lib/utils';

export type DashboardMetricKind = 'downloads' | 'plays';

const METRIC_STYLES: Record<DashboardMetricKind, string> = {
  downloads: 'border-transparent bg-sky-500/15 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200',
  plays:
    'border-transparent bg-violet-500/15 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
};

type DashboardMetricBadgeProps = {
  kind: DashboardMetricKind;
  value?: number | null;
  className?: string;
};

export function DashboardMetricBadge({ kind, value, className }: DashboardMetricBadgeProps) {
  const Icon = kind === 'downloads' ? Download : Play;
  const label = formatCompactNumber(value ?? 0);

  return (
    <Badge className={cn(METRIC_STYLES[kind], 'tabular-nums gap-1 px-1.5', className)}>
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </Badge>
  );
}
