'use client';

import { motion } from 'framer-motion';
import { Play, Eye, Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VideoCardProps {
  _id?: string;
  title: string;
  creator: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}

export const VideoCard = ({
  _id,
  title,
  creator,
  thumbnail,
  views,
  duration,
  category,
}: VideoCardProps) => {
  const cardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${_id ? 'cursor-pointer' : ''}`}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-all">
            <Button variant="play" size="icon-lg">
              <Play className="w-6 h-6 fill-current ml-1" />
            </Button>
          </motion.div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-foreground/80 text-primary-foreground text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
            {category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-muted-foreground">{creator.charAt(0)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{creator}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (_id) {
    return (
      <Link href={`/videos/${_id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
