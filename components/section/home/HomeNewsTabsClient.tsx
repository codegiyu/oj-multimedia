'use client';

import { useState } from 'react';
import { NewsSection, type NewsArticle } from './NewsSection';
import { cn } from '@/lib/utils';

type NewsTabId = 'featured' | 'trending' | 'latest';

interface HomeNewsTabsClientProps {
  featured: NewsArticle[];
  trending: NewsArticle[];
  latest: NewsArticle[];
}

const TAB_CONFIG: Record<
  NewsTabId,
  { label: string; heading: string; subtext: string; viewAllLink: string }
> = {
  featured: {
    label: 'Featured',
    heading: 'Featured news',
    subtext: 'Editorial picks',
    viewAllLink: '/news/featured',
  },
  trending: {
    label: 'Trending',
    heading: 'Trending news',
    subtext: 'What readers engage with most',
    viewAllLink: '/news/trending',
  },
  latest: {
    label: 'Latest',
    heading: 'Latest stories',
    subtext: 'Stay updated with trending news',
    viewAllLink: '/news',
  },
};

export function HomeNewsTabsClient({ featured, trending, latest }: HomeNewsTabsClientProps) {
  const [activeTab, setActiveTab] = useState<NewsTabId>('featured');

  const articlesByTab: Record<NewsTabId, NewsArticle[]> = {
    featured,
    trending,
    latest,
  };

  const config = TAB_CONFIG[activeTab];
  const articles = articlesByTab[activeTab];

  return (
    <div>
      <div
        className="container mx-auto px-4 -mt-2 mb-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
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
      </div>
      <NewsSection
        articles={articles}
        heading={config.heading}
        subtext={config.subtext}
        viewAllLink={config.viewAllLink}
        sectionId="news"
        sectionClassName="section-content-visibility"
      />
    </div>
  );
}
