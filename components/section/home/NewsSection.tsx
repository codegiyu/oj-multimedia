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
        className: 'grid lg:grid-cols-2 gap-6',
        enableAnimation: true,
      }}>
      {/* Featured Article */}
      <NewsCard {...newsArticles[0]} />

      {/* Other Articles */}
      <div className="grid gap-6">
        {newsArticles.slice(1).map((article, index) => (
          <NewsCard key={index} {...article} />
        ))}
      </div>
    </SectionComp>
  );
};
