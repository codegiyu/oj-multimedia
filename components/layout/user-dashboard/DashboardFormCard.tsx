'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface DashboardFormCardProps {
  title: string;
  description?: string | null;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

export function DashboardFormCard({
  title,
  description,
  icon: Icon,
  className,
  children,
}: DashboardFormCardProps) {
  return (
    <Card className={cn('gap-0 overflow-hidden border-border/80 py-0 shadow-sm', className)}>
      <div className="border-b border-border/60 bg-card px-5 py-4 md:px-6">
        <div className="flex gap-3">
          {Icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          ) : null}
          <div className="min-w-0 space-y-1">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6 md:py-6">{children}</div>
    </Card>
  );
}
