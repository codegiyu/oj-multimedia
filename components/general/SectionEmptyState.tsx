'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/section/news/EmptyState';

export interface SectionEmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Pre-rendered icon markup from server components (cannot pass LucideIcon across the boundary). */
  iconSlot?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  /** Enable category-filter fallback actions (news contexts). Section rails default to false. */
  showDefaultActions?: boolean;
}

export function SectionEmptyState({
  title,
  description,
  icon: Icon,
  iconSlot,
  actionLabel,
  actionHref,
  onAction,
  showDefaultActions = false,
}: SectionEmptyStateProps) {
  const iconNode =
    iconSlot ?? (Icon ? <Icon className="w-12 h-12 text-muted-foreground" /> : undefined);

  return (
    <EmptyState
      title={title}
      description={description}
      icon={iconNode}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
      showDefaultActions={showDefaultActions}
    />
  );
}
