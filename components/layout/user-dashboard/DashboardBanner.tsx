'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface DashboardBannerProps {
  title: string;
  description?: string | null;
  className?: string;
  children?: ReactNode;
}

export function DashboardBanner({ title, description, className, children }: DashboardBannerProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-primary/[0.07] to-muted/40 px-5 py-6 md:px-8 md:py-7',
        className
      )}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground md:text-base">{description}</p>
          ) : null}
        </div>
        {children ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
