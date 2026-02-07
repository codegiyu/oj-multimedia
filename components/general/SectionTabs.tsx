'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  emoji?: string;
  icon?: LucideIcon;
}

interface SectionTabsProps {
  tabs: Tab[];
  queryKey?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  iconColor?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const SectionTabs = ({
  tabs,
  queryKey = 'category',
  defaultTab = 'all',
  onTabChange,
  iconColor = 'primary',
  className,
}: SectionTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab] = useQueryState(queryKey, parseAsString.withDefault(defaultTab));

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      // Default behavior: update URL query param
      const newUrl = tabId === defaultTab ? pathname : `${pathname}?${queryKey}=${tabId}`;
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const TabIcon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'quick-link whitespace-nowrap transition-colors flex items-center gap-2',
              isActive
                ? iconColor === 'primary'
                  ? 'bg-primary text-primary-foreground'
                  : iconColor === 'secondary'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-accent text-accent-foreground'
                : ''
            )}>
            {tab.emoji && <span>{tab.emoji}</span>}
            {TabIcon && <TabIcon className="w-4 h-4" />}
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
