'use client';

import { motion } from 'framer-motion';
import { Video, Play, Eye, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { VideoSermon } from './SermonsPageClient';

interface VideoSermonsSectionProps {
  sermons: VideoSermon[];
}

export const VideoSermonsSection = ({ sermons }: VideoSermonsSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Video className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="section-header">Video Sermons</h2>
            <p className="text-muted-foreground text-sm">
              Watch inspiring messages from our pastors
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-accent">
          View All Videos
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sermons.map((sermon, index) => (
          <motion.div
            key={sermon.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20">
              <img
                src={sermon.thumbnail}
                alt={sermon.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="icon" variant="play" className="w-14 h-14 rounded-full">
                  <Play className="w-6 h-6" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {sermon.duration}
              </div>
              <div className="absolute top-2 left-2 flex gap-2">
                {sermon.isLive && (
                  <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                )}
                {sermon.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors mb-2">
                {sermon.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{sermon.pastor}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {sermon.views} views
                </span>
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
