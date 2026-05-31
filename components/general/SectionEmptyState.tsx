'use client';

import type { LucideIcon } from 'lucide-react';
import { EmptyState } from '@/components/section/news/EmptyState';

export interface SectionEmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
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
  actionLabel,
  actionHref,
  onAction,
  showDefaultActions = false,
}: SectionEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<Icon className="w-12 h-12 text-muted-foreground" />}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
      showDefaultActions={showDefaultActions}
    />
  );
}
