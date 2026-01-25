'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, MessageCircle, ArrowRight } from 'lucide-react';

export interface FeaturedStory {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
  comments: number;
  featured?: boolean;
}

interface FeaturedStoriesProps {
  stories: FeaturedStory[];
}

export const FeaturedStories = ({ stories: featuredStories }: FeaturedStoriesProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">Featured Stories</h2>
          <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Featured Story */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer">
            <img
              src={featuredStories[0].image}
              alt={featuredStories[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-primary-foreground">
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                {featuredStories[0].category}
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 group-hover:text-primary-glow transition-colors">
                {featuredStories[0].title}
              </h3>
              <p className="text-primary-foreground/80 text-sm md:text-base line-clamp-2 mb-4">
                {featuredStories[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-primary-foreground/70">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredStories[0].readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {featuredStories[0].views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {featuredStories[0].comments}
                </span>
              </div>
            </div>
          </motion.article>

          {/* Secondary Featured Stories */}
          <div className="grid gap-6">
            {featuredStories.slice(1).map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group flex gap-4 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
                <div className="w-1/3 min-w-[140px] overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <span className="inline-flex w-fit px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium mb-2">
                    {story.category}
                  </span>
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {story.views}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
