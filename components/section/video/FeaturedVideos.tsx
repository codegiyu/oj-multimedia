'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/cards/VideoCard';

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
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Featured Videos</h2>
              <p className="text-sm text-muted-foreground">Editor's picks and popular uploads</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            View All
          </Button>
        </div>

        {/* Featured Grid */}
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
      </div>
    </section>
  );
};
