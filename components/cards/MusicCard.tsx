'use client';

import { motion } from 'framer-motion';
import { Play, Heart, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MusicCardProps {
  id?: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  genre: string;
  isNew?: boolean;
}

export const MusicCard = ({
  id,
  title,
  artist,
  cover,
  plays,
  genre,
  isNew,
}: MusicCardProps) => {
  const cardContent = (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${id ? 'cursor-pointer' : ''}`}>
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="play" size="icon-lg" className="shadow-glow">
            <Play className="w-6 h-6 fill-current ml-1" />
          </Button>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && <span className="badge-new">NEW</span>}
          <span className="genre-tag bg-card/90 backdrop-blur-sm text-foreground">{genre}</span>
        </div>

        {/* Quick Actions */}
        <div
          className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            className="bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={e => e.preventDefault()}>
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={e => e.preventDefault()}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{plays} plays</p>
      </div>
    </motion.div>
  );

  if (id) {
    return (
      <Link href={`/music/${id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
