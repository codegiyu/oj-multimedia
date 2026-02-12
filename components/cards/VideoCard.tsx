'use client';

import { motion } from 'framer-motion';
import { Play, Eye, Clock, MoreVertical, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VideoCardProps {
  _id?: string;
  title: string;
  creator: string | { _id: string; name: string };
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
  /** 'featured' | 'shortForm' | 'recent' = different layouts. 'recent' = horizontal row, small thumb, uploadedAt */
  variant?: 'default' | 'featured' | 'shortForm' | 'recent';
  /** Show FEATURED badge on thumbnail (used when variant='featured') */
  featured?: boolean;
  /** Likes count (used when variant='shortForm') */
  likes?: string;
  /** Upload date label (used when variant='recent') */
  uploadedAt?: string;
}

export const VideoCard = ({
  _id,
  title,
  creator,
  thumbnail,
  views,
  duration,
  category,
  variant = 'default',
  featured = false,
  likes,
  uploadedAt,
}: VideoCardProps) => {
  const creatorName = typeof creator === 'string' ? creator : creator.name;
  const isFeaturedVariant = variant === 'featured';
  const isShortFormVariant = variant === 'shortForm';
  const isRecentVariant = variant === 'recent';

  /** Horizontal row layout for "recent uploads" */
  const recentCardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group flex gap-4 p-4 bg-card rounded-2xl hover:shadow-md transition-all cursor-pointer">
      <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-5 h-5 text-background fill-current" />
        </div>
        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
          {duration}
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground truncate mb-2">{creatorName}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 bg-muted rounded-full">{category}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views}
          </span>
          {uploadedAt != null && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {uploadedAt}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <Heart className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  if (isRecentVariant) {
    if (_id) {
      return (
        <Link href={`/videos/${_id}`} className="block">
          {recentCardContent}
        </Link>
      );
    }
    return recentCardContent;
  }

  const cardContent = (
    <motion.div
      whileHover={{
        y: isShortFormVariant ? 0 : isFeaturedVariant ? -8 : -4,
        scale: isShortFormVariant ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      className={`group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${_id ? 'cursor-pointer' : ''}`}>
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden ${isShortFormVariant ? 'aspect-[9/16]' : 'aspect-video'}`}>
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isFeaturedVariant || isShortFormVariant ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}
        />

        {/* Play Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${isShortFormVariant ? 'bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100' : isFeaturedVariant ? 'bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100' : 'bg-foreground/20 opacity-0 group-hover:opacity-100'}`}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="transition-all opacity-0 group-hover:opacity-100">
            <Button
              variant="play"
              size={isShortFormVariant ? 'icon' : 'icon-lg'}
              className={isFeaturedVariant || isShortFormVariant ? 'shadow-glow' : undefined}>
              <Play
                className={`fill-current ml-0.5 ${isShortFormVariant ? 'w-4 h-4' : 'w-6 h-6 ml-1'}`}
              />
            </Button>
          </motion.div>
        </div>

        {/* Duration Badge */}
        <span
          className={`absolute font-medium rounded bg-foreground/80 ${isShortFormVariant ? 'bottom-2 right-2 px-1.5 py-0.5 text-[10px] text-background' : isFeaturedVariant ? 'bottom-3 right-3 text-xs px-2 py-1 rounded-md text-background' : 'bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-md text-primary-foreground'}`}>
          {!isFeaturedVariant && !isShortFormVariant && <Clock className="w-3 h-3" />}
          {duration}
        </span>

        {/* Category (default) or FEATURED badge — not for shortForm */}
        {!isShortFormVariant && (
          <div className={`absolute top-2 left-2 ${isFeaturedVariant ? 'top-3 left-3' : ''}`}>
            {isFeaturedVariant && featured ? (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                FEATURED
              </span>
            ) : !isFeaturedVariant ? (
              <span className="px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
                {category}
              </span>
            ) : null}
          </div>
        )}

        {/* ShortForm: Heart / Share on hover */}
        {isShortFormVariant && (
          <div className="absolute bottom-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              <Heart className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={isShortFormVariant ? 'p-2' : 'p-4'}>
        {isShortFormVariant ? (
          <>
            <h3 className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {title}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate mb-1">{creatorName}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{views} views</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5" />
                {likes ?? '0'}
              </span>
            </div>
          </>
        ) : isFeaturedVariant ? (
          <>
            <div className="mb-2">
              <span className="text-xs text-primary font-medium mb-1 block">{category}</span>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{creatorName}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-muted-foreground">
                {creatorName.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{creatorName}</p>
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
        )}
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
