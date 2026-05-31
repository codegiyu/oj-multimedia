'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Clock, User } from 'lucide-react';
import { FillImage } from '@/components/general/FillImage';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import type { NewsItem } from '@/lib/constants/news';

interface NewsRelatedStoriesGridProps {
  stories: NewsItem[];
}

export function NewsRelatedStoriesGrid({ stories }: NewsRelatedStoriesGridProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-foreground mb-8">Related Stories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.article
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <Link href={`/news/story/${story._id}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <FillImage
                    src={story.image}
                    alt={story.title}
                    imageContext="public"
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {story.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <MultilinePreview
                      text={story.excerpt}
                      className="text-sm text-muted-foreground line-clamp-2 mb-3"
                    />
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {story.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {story.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
