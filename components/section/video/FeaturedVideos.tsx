'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { VideoCard } from '@/components/cards/VideoCard';
import { EmptyState } from '../news/EmptyState';

export interface FeaturedVideo {
  _id: string;
  title: string;
  creator: { _id: string; name: string };
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
  featured: boolean;
}

interface FeaturedVideosProps {
  videos: FeaturedVideo[];
}

export const FeaturedVideos = ({ videos: featuredVideos }: FeaturedVideosProps) => {
  if (featuredVideos.length === 0) {
    return (
      <SectionComp
        icon={Star}
        iconColor="primary"
        heading="Featured Videos"
        subtext="Editor's picks and popular uploads"
        viewAllLink="/videos/featured"
        background="bg-muted/30"
        contentProps={{ enableAnimation: false }}>
        <EmptyState
          title="No featured videos"
          description="No featured videos in this category yet. Check back later."
          icon={<Star className="w-12 h-12 text-muted-foreground" />}
        />
      </SectionComp>
    );
  }

  return (
    <SectionComp
      icon={Star}
      iconColor="primary"
      heading="Featured Videos"
      subtext="Editor's picks and popular uploads"
      viewAllLink="/videos/featured"
      background="bg-muted/30"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredVideos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <VideoCard
              _id={video._id}
              title={video.title}
              creator={video.creator}
              thumbnail={video.thumbnail}
              views={video.views}
              duration={video.duration}
              category={video.category}
              variant="featured"
              featured={video.featured}
            />
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
