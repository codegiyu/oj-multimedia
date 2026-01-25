'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Video, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/cards/VideoCard';

export interface TrendingVideoItem {
  title: string;
  creator: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}

interface TrendingVideosSectionProps {
  videos: TrendingVideoItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TrendingVideosSection = ({ videos: trendingVideos }: TrendingVideosSectionProps) => {
  return (
    <section id="videos" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="section-header">Trending Videos</h2>
              <p className="text-muted-foreground text-sm">Watch the latest creative content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="accent" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Your Video
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Music Videos', 'Short Clips', 'Talks', 'Dance', 'Creative', 'BTS'].map(
            (cat, index) => (
              <button
                key={cat}
                className={`quick-link whitespace-nowrap ${index === 0 ? 'bg-secondary text-secondary-foreground' : ''}`}>
                {cat}
              </button>
            )
          )}
        </div>

        {/* Videos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingVideos.map((video, index) => (
            <motion.div key={index} variants={itemVariants}>
              <VideoCard {...video} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
