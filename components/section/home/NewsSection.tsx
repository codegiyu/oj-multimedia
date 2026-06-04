'use client';

import { Newspaper } from 'lucide-react';
import { NewsCard } from '@/components/cards/NewsCard';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  time: string;
  image: string;
  featured?: boolean;
}

interface NewsSectionProps {
  articles: NewsArticle[];
  heading?: string;
  subtext?: string;
  viewAllLink?: string;
  sectionId?: string;
  sectionClassName?: string;
}

export const NewsSection = ({
  articles: newsArticles,
  heading = 'Latest Stories',
  subtext = 'Stay updated with trending news',
  viewAllLink = '/news',
  sectionId = 'news',
  sectionClassName,
}: NewsSectionProps) => {
  if (!newsArticles || newsArticles.length === 0) {
    return (
      <SectionComp
        id={sectionId}
        icon={Newspaper}
        iconColor="primary"
        heading={heading}
        subtext={subtext}
        viewAllLink={viewAllLink}
        background="bg-muted/30"
        sectionClassName={sectionClassName}
        contentProps={{
          className: 'h-full',
          enableAnimation: true,
        }}>
        <SectionEmptyState
          title="No news stories yet"
          description="Check back later for the latest stories and updates."
          icon={Newspaper}
          actionLabel="View all news"
          actionHref="/news"
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      id={sectionId}
      icon={Newspaper}
      iconColor="primary"
      heading={heading}
      subtext={subtext}
      viewAllLink={viewAllLink}
      background="bg-muted/30"
      sectionClassName={sectionClassName}
      contentProps={{
        className: 'h-full',
        enableAnimation: true,
      }}>
      {/* Below xl: one hero story + compact follow-ups on lg+ */}
      <div className="grid gap-6 lg:grid-cols-2 xl:hidden">
        {newsArticles[0] && <NewsCard {...newsArticles[0]} featured />}
        {newsArticles.length > 1 && (
          <div className="grid gap-4 sm:gap-6">
            {newsArticles.slice(1, 3).map(article => (
              <NewsCard key={article._id} {...article} featured={false} />
            ))}
          </div>
        )}
      </div>

      {/* xl: 5 articles — 1 large left, 4 smaller in 2×2 right */}
      <div className="hidden xl:grid xl:grid-cols-2 xl:gap-6 xl:items-stretch">
        {newsArticles[0] && (
          <div className="h-full min-h-[240px] sm:min-h-[320px] lg:min-h-[400px]">
            <NewsCard {...newsArticles[0]} featured />
          </div>
        )}
        {newsArticles.length > 1 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {newsArticles.slice(1, 5).map(article => (
              <NewsCard key={article._id} {...article} featured />
            ))}
          </div>
        )}
      </div>
    </SectionComp>
  );
};
