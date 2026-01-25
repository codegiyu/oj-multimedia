'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/cards/NewsCard';

export interface NewsArticle {
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
    <section id="news" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="section-header">Latest Stories</h2>
              <p className="text-muted-foreground text-sm">Stay updated with trending news</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-primary"
            asChild>
            <Link href="/news">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <NewsCard {...newsArticles[0]} />

          {/* Other Articles */}
          <div className="grid gap-6">
            {newsArticles.slice(1).map((article, index) => (
              <NewsCard key={index} {...article} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
