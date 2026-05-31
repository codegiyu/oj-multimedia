'use client';

import { motion } from 'motion/react';
import { Clock, Eye, MessageCircle, Sparkles, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FillImage } from '@/components/general/FillImage';

export interface FeaturedStory {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
  comments: number;
  featured?: boolean;
  videoUrl?: string;
  author?: string;
  date?: string;
  priority?: number;
}

interface FeaturedStoriesProps {
  stories: FeaturedStory[];
}

export const FeaturedStories = ({ stories: featuredStories }: FeaturedStoriesProps) => {
  if (featuredStories.length === 0) {
    return (
      <SectionComp
        icon={Sparkles}
        iconColor="primary"
        heading="Featured Stories"
        viewAllLink="/news/featured"
        contentProps={{ enableAnimation: false }}>
        <SectionEmptyState
          title="No Featured Stories"
          description="We couldn't find any featured stories in this category. Try selecting a different category or check back later for new content."
          icon={Sparkles}
          showDefaultActions
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Sparkles}
      iconColor="primary"
      heading="Featured Stories"
      viewAllLink="/news/featured"
      contentProps={{ enableAnimation: false }}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Featured Story */}
        <Link href={`/news/story/${featuredStories[0]._id}`} className="h-full">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="h-full group relative md:h-[500px] rounded-2xl overflow-hidden cursor-pointer">
            <FillImage
              imageContext="public"
              src={featuredStories[0].image}
              alt={featuredStories[0].title}
              sizes="(max-width: 768px) 100vw, 600px"
              className="transition-transform duration-500 group-hover:scale-105"
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
              <div className="flex items-center gap-4 text-xs text-primary-foreground/70 flex-wrap">
                {featuredStories[0].author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {featuredStories[0].author}
                  </span>
                )}
                {featuredStories[0].date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(featuredStories[0].date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
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
        </Link>

        {/* Secondary Featured Stories */}
        <div className="grid gap-6">
          {featuredStories.slice(1).map((story, index) => (
            <Link key={story._id} href={`/news/story/${story._id}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="h-full group flex gap-4 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
                <div className="relative w-[140px] min-h-[120px] overflow-hidden shrink-0">
                  <FillImage
                    imageContext="public"
                    src={story.image}
                    alt={story.title}
                    sizes="200px"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <span className="inline-flex w-fit px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium mb-2">
                    {story.category}
                  </span>
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {story.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {story.author}
                      </span>
                    )}
                    {story.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(story.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
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
            </Link>
          ))}
        </div>
      </div>
    </SectionComp>
  );
};
