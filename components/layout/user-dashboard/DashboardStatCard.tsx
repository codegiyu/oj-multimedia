'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type DashboardStatCardVariant = 'default' | 'emphasis';

export interface DashboardStatCardProps {
  label: string;
  value: ReactNode;
  /** Muted caption under label (e.g. trend) */
  hint?: ReactNode;
  /** Colored value (e.g. pending count) */
  valueClassName?: string;
  icon?: LucideIcon;
  /** Pre-rendered icon markup from server components (cannot pass LucideIcon across the boundary). */
  iconSlot?: ReactNode;
  /** Top-right corner icon (e.g. trend arrow) */
  corner?: ReactNode;
  variant?: DashboardStatCardVariant;
  className?: string;
}

export function DashboardStatCard({
  label,
  value,
  hint,
  valueClassName,
  icon: Icon,
  iconSlot,
  corner,
  variant = 'default',
  className,
}: DashboardStatCardProps) {
  const iconNode =
    iconSlot ??
    (Icon ? (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
    ) : null);

  return (
    <Card
      className={cn(
        'gap-0 border-border/80 p-5 shadow-sm',
        variant === 'emphasis' && 'border-primary/15',
        className
      )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {iconNode}
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className={cn('text-2xl font-bold tabular-nums text-foreground', valueClassName)}>
              {value}
            </p>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
          </div>
        </div>
        {corner ? <div className="shrink-0">{corner}</div> : null}
      </div>
    </Card>
  );
}
