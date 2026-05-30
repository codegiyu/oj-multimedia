'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { IVendorDashboardStatsRes } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';

export function VendorDashboardCharts({
  stats,
  className,
}: {
  stats: IVendorDashboardStatsRes | null;
  className?: string;
}) {
  if (!stats) return null;

  const rows = [
    { label: 'Products listed', value: String(stats.productsCount) },
    { label: 'Pending orders', value: String(stats.pendingOrdersCount) },
    { label: 'Total paid revenue', value: formatPrice(stats.totalPaidRevenue) },
  ];

  return (
    <Card className={cn('border-border/80 p-5 shadow-sm', className)}>
      <h3 className="mb-4 text-base font-semibold text-foreground">Store summary</h3>
      <dl className="grid gap-3 sm:grid-cols-3">
        {rows.map(row => (
          <div key={row.label} className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
