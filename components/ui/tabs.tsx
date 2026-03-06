'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within Tabs');
  return ctx;
}

function Tabs({
  className,
  value,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabDefinition {
  value: string;
  label: string;
}

interface TabsListProps extends React.ComponentProps<'div'> {
  tabs?: TabDefinition[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showNavigation?: boolean;
}

const TriangleLeft = ({ className }: { className?: string }) => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className={className}>
    <path d="M7 0L0 5L7 10V0Z" />
  </svg>
);

const TriangleRight = ({ className }: { className?: string }) => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className={className}>
    <path d="M1 0L8 5L1 10V0Z" />
  </svg>
);

function TabsList({
  className,
  tabs,
  activeTab,
  onTabChange,
  showNavigation,
  children,
  ...props
}: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const ctx = useTabsContext();
  const value = activeTab ?? ctx.value;
  const onValueChange = onTabChange ?? ctx.onValueChange;

  const shouldShowNavigation =
    showNavigation !== false && tabs && tabs.length > 0 && value && onValueChange;

  const currentIndex = React.useMemo(() => {
    if (!tabs || !value) return -1;
    return tabs.findIndex(t => t.value === value);
  }, [tabs, value]);

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex >= 0 && currentIndex < (tabs?.length ?? 0) - 1;

  const handleNavigate = (direction: 'left' | 'right') => {
    if (!tabs || currentIndex === -1) return;
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tabs.length) return;
    onValueChange(tabs[newIndex].value);
  };

  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground rounded-sm p-1 overflow-hidden w-full',
        shouldShowNavigation && 'flex items-center gap-1',
        className
      )}
      {...props}>
      {shouldShowNavigation && (
        <button
          type="button"
          onClick={() => handleNavigate('left')}
          disabled={!canGoLeft}
          className={cn(
            'flex items-center justify-center h-8 w-8 rounded-md transition-colors shrink-0',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Previous tab">
          <TriangleLeft className="size-3" />
        </button>
      )}
      <div
        ref={listRef}
        data-slot="tabs-list"
        role="tablist"
        className={cn(
          'inline-flex w-full items-center justify-start sm:justify-around overflow-x-auto scrollbar-none',
          shouldShowNavigation && 'flex-1'
        )}>
        {tabs && tabs.length > 0
          ? tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))
          : children}
      </div>
      {shouldShowNavigation && (
        <button
          type="button"
          onClick={() => handleNavigate('right')}
          disabled={!canGoRight}
          className={cn(
            'flex items-center justify-center h-8 w-8 rounded-md transition-colors shrink-0',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Next tab">
          <TriangleRight className="size-3" />
        </button>
      )}
    </div>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'> & { value: string }) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'inline-flex h-[calc(100%-1px)] flex-1 sm:flex-none items-center justify-center rounded-md border border-transparent px-5 sm:px-10 py-1.5 sm:py-1 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer min-w-fit shrink-0',
        isActive &&
          'bg-background text-foreground shadow-sm border-input dark:border-input dark:bg-input/30',
        !isActive && 'text-muted-foreground',
        className
      )}
      onClick={e => {
        ctx.onValueChange(value);
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }}
      {...props}>
      {children}
    </button>
  );
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<'div'> & { value: string }) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;
  return (
    <div data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
