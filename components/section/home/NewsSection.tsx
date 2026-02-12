'use client';

import { Newspaper } from 'lucide-react';
import { NewsCard } from '@/components/cards/NewsCard';
import { SectionComp } from '@/components/general/SectionComp';

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
}

export const NewsSection = ({ articles: newsArticles }: NewsSectionProps) => {
  return (
    <SectionComp
      id="news"
      icon={Newspaper}
      iconColor="primary"
      heading="Latest Stories"
      subtext="Stay updated with trending news"
      viewAllLink="/news"
      background="bg-muted/30"
      contentProps={{
        className: 'h-full',
        enableAnimation: true,
      }}>
      {/* Mobile up to lg: 3 articles — 1 featured + 2 stacked */}
      <div className="grid gap-6 lg:grid-cols-2 xl:hidden">
        <NewsCard {...newsArticles[0]} featured />
        <div className="grid gap-6">
          {newsArticles.slice(1, 3).map(article => (
            <NewsCard key={article._id} {...article} featured />
          ))}
        </div>
      </div>

      {/* xl: 5 articles — 1 large left, 4 smaller in 2×2 right */}
      <div className="hidden xl:grid xl:grid-cols-2 xl:gap-6 xl:items-stretch">
        <div className="h-full min-h-[400px]">
          <NewsCard {...newsArticles[0]} featured />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {newsArticles.slice(1, 5).map(article => (
            <NewsCard key={article._id} {...article} featured />
          ))}
        </div>
      </div>
    </SectionComp>
  );
};
