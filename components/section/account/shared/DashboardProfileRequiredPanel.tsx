'use client';

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DashboardProfileRequiredPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryHint?: string;
  className?: string;
}

/**
 * Full-area empty state (modal-like card, no dimmed backdrop) for dashboard routes
 * when the user has not completed onboarding (artist / vendor profile missing).
 */
export function DashboardProfileRequiredPanel({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryHint,
  className,
}: DashboardProfileRequiredPanelProps) {
  return (
    <div
      className={cn(
        'flex min-h-[min(70vh,36rem)] flex-col items-center justify-center px-4 py-16',
        className
      )}>
      <div
        className="w-full max-w-lg space-y-6 rounded-2xl border border-border/80 bg-card px-6 py-12 text-center shadow-lg"
        role="region"
        aria-labelledby="dashboard-profile-required-title">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1
            id="dashboard-profile-required-title"
            className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          {secondaryHint ? (
            <p className="text-xs text-muted-foreground/90">{secondaryHint}</p>
          ) : null}
        </div>
        <Button
          type="button"
          className="rounded-full bg-primary px-8 hover:bg-primary/90"
          onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
