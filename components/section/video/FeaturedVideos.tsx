'use client';

import { motion } from 'framer-motion';
import { Play, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FeaturedVideo {
  _id: string;
  title: string;
  creator: string;
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
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative">
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="play" size="icon-lg" className="shadow-glow">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-foreground/80 text-background text-xs rounded-md font-medium">
                    {video.duration}
                  </span>

                  {/* Featured Badge */}
                  {video.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-primary font-medium mb-1 block">
                      {video.category}
                    </span>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{video.creator}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
