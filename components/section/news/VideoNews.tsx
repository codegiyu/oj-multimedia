'use client';

import { motion } from 'motion/react';
import { Play, Clock, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';
import { EmptyState } from './EmptyState';
import { FillImage } from '@/components/general/FillImage';

export interface VideoNewsItem {
  _id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  views: string;
  author?: string;
  date?: string;
}

interface VideoNewsProps {
  videos: VideoNewsItem[];
}

export const VideoNews = ({ videos }: VideoNewsProps) => {
  return (
    <SectionComp
      icon={Play}
      iconColor="primary"
      heading="Video Stories"
      subtext="Watch and explore"
      viewAllLink="/news/videos"
      background="bg-muted/30"
      contentProps={{ enableAnimation: false }}>
      {videos.length === 0 ? (
        <EmptyState
          title="No Video Stories"
          description="We couldn't find any video stories in this category. Try selecting a different category or check back later for new content."
          icon={<Play className="w-12 h-12 text-muted-foreground" />}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <Link key={video._id} href={`/news/story/${video._id}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <FillImage
                    imageContext="public"
                    src={video.image}
                    alt={video.title}
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </motion.div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-foreground/80 text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                    {video.category}
                  </span>
                </div>
                <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
                  {video.title}
                </h3>
                <div className="mt-1 space-y-1">
                  {(video.author || video.date) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      {video.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {video.author}
                        </span>
                      )}
                      {video.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(video.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{video.views} views</p>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
