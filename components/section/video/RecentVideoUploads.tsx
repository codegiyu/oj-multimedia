'use client';

import { motion } from 'framer-motion';
import { Play, Heart, Clock, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RecentVideoUpload {
  id: number;
  title: string;
  creator: string;
  thumbnail: string;
  uploadedAt: string;
  category: string;
  views: string;
  duration: string;
}

interface RecentVideoUploadsProps {
  uploads: RecentVideoUpload[];
}

export const RecentVideoUploads = ({ uploads: recentUploads }: RecentVideoUploadsProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Fresh Uploads</h2>
              <p className="text-sm text-muted-foreground">Just added by creators</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            View All
          </Button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentUploads.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group flex gap-4 p-4 bg-card rounded-2xl hover:shadow-md transition-all cursor-pointer">
              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-5 h-5 text-background fill-current" />
                </div>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mb-2">{video.creator}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-full">{video.category}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
