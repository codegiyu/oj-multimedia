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

  return (
    <div className={cn('mb-8', className)}>
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {iconSlot ??
            (Icon ? (
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  iconBackground || colorStyles.bg
                )}>
                <Icon className={cn('w-5 h-5', iconBackground ? '' : colorStyles.icon)} />
              </div>
            ) : null)}
          <div>
            <h2 className="section-header">{heading}</h2>
            {subtext && <p className="text-muted-foreground text-sm">{subtext}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showPrevNext && (
            <>
              <Button variant="ghost" size="icon" onClick={onPrev} className="hidden md:flex">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onNext} className="hidden md:flex">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
          {extraButtons}
          {viewAllLink && (
            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-primary"
              asChild>
              <Link href={viewAllLink}>
                {viewAllLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs - Only rendered when tabs are provided */}
      {tabs && tabs.length > 0 && (
        <SectionTabs
          tabs={tabs}
          queryKey={tabsQueryKey}
          defaultTab={defaultTab}
          onTabChange={onTabChange}
          iconColor={iconColor}
        />
      )}
    </div>
  );
};
