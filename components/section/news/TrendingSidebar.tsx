'use client';

import { motion } from 'motion/react';
import { TrendingUp, Flame, Clock, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface TrendingStory {
  _id: string;
  title: string;
  excerpt?: string;
  category: string;
  readTime: string;
  rank: number;
  image?: string;
  views?: string;
  videoUrl?: string; // Optional video URL to differentiate video stories from regular stories
  author?: string; // Author name
  date?: string; // Publication date
}

interface TrendingSidebarProps {
  stories: TrendingStory[];
}

export const TrendingSidebar = ({ stories: trendingStories }: TrendingSidebarProps) => {
  return (
    <aside className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Flame className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display font-bold text-foreground">Trending Now</h3>
      </div>

      <div className="grid gap-6">
        {trendingStories.map((story, index) => (
          <Link key={story._id} href={`/news/story/${story._id}`}>
            <motion.article
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className="group flex gap-4 cursor-pointer">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <span
                  className={`text-sm font-bold ${story.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {story.rank}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span className="text-primary">{story.category}</span>
                  {(story.author || story.date) && <span>•</span>}
                  {story.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {story.author}
                    </span>
                  )}
                  {story.date && (
                    <>
                      {story.author && <span>•</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(story.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>

      {/* View All */}
      <Link
        href="/news/trending"
        className="w-full mt-6 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
        <TrendingUp className="w-4 h-4" />
        See all trending
      </Link>
    </aside>
  );
};
