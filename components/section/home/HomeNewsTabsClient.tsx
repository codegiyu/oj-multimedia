'use client';

import { useState } from 'react';
import { NewsSection, type NewsArticle } from './NewsSection';
import { cn } from '@/lib/utils';

type NewsTabId = 'featured' | 'trending' | 'latest';

interface HomeNewsTabsClientProps {
  featured: NewsArticle[];
  trending: NewsArticle[];
  latest: NewsArticle[];
  defaultTab?: NewsTabId;
}

const TAB_CONFIG: Record<
  NewsTabId,
  { label: string; heading: string; subtext: string; viewAllLink: string }
> = {
  featured: {
    label: 'Featured',
    heading: 'News',
    subtext: 'Editorial picks and latest stories',
    viewAllLink: '/news/featured',
  },
  trending: {
    label: 'Trending',
    heading: 'News',
    subtext: 'What readers engage with most',
    viewAllLink: '/news/trending',
  },
  latest: {
    label: 'Latest',
    heading: 'News',
    subtext: 'Stay updated with trending news',
    viewAllLink: '/news/latest',
  },
};

export function HomeNewsTabsClient({
  featured,
  trending,
  latest,
  defaultTab = 'featured',
}: HomeNewsTabsClientProps) {
  const [activeTab, setActiveTab] = useState<NewsTabId>(defaultTab);

  const articlesByTab: Record<NewsTabId, NewsArticle[]> = {
    featured,
    trending,
    latest,
  };

  const config = TAB_CONFIG[activeTab];
  const articles = articlesByTab[activeTab];

  const tabBar = (
    <div
      className="relative -mt-2 mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      role="tablist"
      aria-label="News categories">
      {(Object.keys(TAB_CONFIG) as NewsTabId[]).map(tabId => {
        const isActive = activeTab === tabId;
        return (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tabId)}
            className={cn(
              'quick-link whitespace-nowrap min-h-11',
              isActive && 'bg-primary text-primary-foreground'
            )}>
            {TAB_CONFIG[tabId].label}
          </button>
        );
      })}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent sm:w-12"
        aria-hidden
      />
    </div>
  );

  return (
    <NewsSection
      articles={articles}
      heading={config.heading}
      subtext={config.subtext}
      viewAllLink={config.viewAllLink}
      sectionId="news"
      sectionClassName="section-content-visibility"
      afterHeader={tabBar}
    />
  );
}
