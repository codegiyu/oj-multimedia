'use client';

import { motion } from 'framer-motion';
import { Play, Clock, ArrowRight } from 'lucide-react';

export interface VideoNewsItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  image: string;
  views: string;
}

interface VideoNewsProps {
  videos: VideoNewsItem[];
}

export const VideoNews = ({ videos: videoNews }: VideoNewsProps) => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Video Stories</h2>
              <p className="text-sm text-muted-foreground">Watch and explore</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Watch more <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoNews.map((video, index) => (
            <motion.article
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer">
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </motion.div>
                </div>

                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-foreground/80 text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>

                {/* Category */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  {video.category}
                </span>
              </div>

              {/* Info */}
              <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
                {video.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{video.views} views</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
