'use client';

import { motion } from 'framer-motion';
import { Play, Users, Verified, Video, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FeaturedCreator {
  _id: string;
  name: string;
  category: string;
  avatar: string;
  followers: string;
  videos: number;
  views: string;
  verified: boolean;
  latestVideo: {
    thumbnail: string;
    title: string;
    duration: string;
  };
}

interface CreatorSpotlightProps {
  creators: FeaturedCreator[];
}

export const CreatorSpotlight = ({ creators: featuredCreators }: CreatorSpotlightProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Creator Spotlight</h2>
              <p className="text-sm text-muted-foreground">Active and trending creators</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            Discover Creators
          </Button>
        </div>

        {/* Creators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCreators.map((creator, index) => (
            <motion.div
              key={creator._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Latest Video Preview */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={creator.latestVideo.thumbnail}
                  alt={creator.latestVideo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="play" size="icon" className="shadow-glow">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </Button>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/80 text-background text-xs rounded font-medium">
                  {creator.latestVideo.duration}
                </span>
              </div>

              {/* Creator Info */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-background shadow-md">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    {creator.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                        <Verified className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {creator.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{creator.category}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {creator.followers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {creator.videos}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {creator.views}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Latest Video Title */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Latest:</p>
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {creator.latestVideo.title}
                  </p>
                </div>

                {/* Follow Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Follow Creator
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
