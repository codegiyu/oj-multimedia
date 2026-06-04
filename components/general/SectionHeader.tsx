'use client';

import { ReactNode } from 'react';
import { LucideIcon, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SectionTabs, type Tab } from './SectionTabs';

export type { Tab };

export interface SectionHeaderProps {
  icon?: LucideIcon;
  /** Pre-rendered icon markup from server components (cannot pass LucideIcon across the boundary). */
  iconSlot?: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'accent';
  iconBackground?: string;
  heading: string;
  subtext?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
  showPrevNext?: boolean;
  extraButtons?: ReactNode;
  tabs?: Tab[];
  tabsQueryKey?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const iconColorStyles = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
  },
  secondary: {
    bg: 'bg-secondary/10',
    icon: 'text-secondary',
  },
  accent: {
    bg: 'bg-accent/20',
    icon: 'text-accent-foreground',
  },
};

const railNavButtonClass = 'touch-hit shrink-0';

export const SectionHeader = ({
  icon: Icon,
  iconSlot,
  iconColor = 'primary',
  iconBackground,
  heading,
  subtext,
  viewAllLink,
  viewAllLabel = 'View All',
  onPrev,
  onNext,
  showPrevNext = false,
  extraButtons,
  tabs,
  tabsQueryKey = 'category',
  defaultTab = 'all',
  onTabChange,
  className,
}: SectionHeaderProps) => {
  const colorStyles = iconColorStyles[iconColor];

  const prevNextControls = showPrevNext ? (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        className={cn(railNavButtonClass, 'md:hidden')}
        aria-label="Scroll section left">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className={cn(railNavButtonClass, 'md:hidden')}
        aria-label="Scroll section right">
        <ChevronRight className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        className={cn(railNavButtonClass, 'hidden md:flex')}
        aria-label="Scroll section left">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className={cn(railNavButtonClass, 'hidden md:flex')}
        aria-label="Scroll section right">
        <ChevronRight className="w-5 h-5" />
      </Button>
    </>
  ) : null;

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {iconSlot ??
              (Icon ? (
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    iconBackground || colorStyles.bg
                  )}>
                  <Icon className={cn('w-5 h-5', iconBackground ? '' : colorStyles.icon)} />
                </div>
              ) : null)}
            <div className="min-w-0">
              <h2 className="section-header">{heading}</h2>
              {subtext && <p className="text-muted-foreground text-sm">{subtext}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {prevNextControls}
            {extraButtons ? (
              <div className="hidden md:flex items-center gap-2">{extraButtons}</div>
            ) : null}
            {viewAllLink && (
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground hover:text-primary min-h-11"
                asChild>
                <Link href={viewAllLink}>
                  {viewAllLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="relative">
            <SectionTabs
              tabs={tabs}
              queryKey={tabsQueryKey}
              defaultTab={defaultTab}
              onTabChange={onTabChange}
              iconColor={iconColor}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent sm:w-12"
              aria-hidden
            />
          </div>
        )}

        {extraButtons ? (
          <div className="flex flex-wrap gap-2 md:hidden [&_button]:min-h-11">{extraButtons}</div>
        ) : null}
      </div>
    </div>
  );
};
