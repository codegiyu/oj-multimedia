'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Flame, Clock } from 'lucide-react';

export interface TrendingStory {
  id: number;
  title: string;
  category: string;
  readTime: string;
  rank: number;
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

      <div className="space-y-4">
        {trendingStories.map((story, index) => (
          <motion.article
            key={story.id}
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
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="text-primary">{story.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {story.readTime}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* View All */}
      <button className="w-full mt-6 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
        <TrendingUp className="w-4 h-4" />
        See all trending
      </button>
    </aside>
  );
};
