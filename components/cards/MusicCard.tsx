'use client';

import { motion } from 'motion/react';
import { Play, Heart, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';

interface MusicCardProps {
  _id: string;
  title: string;
  artist: string | { _id: string; name: string };
  cover: string;
  plays: string;
  genre: string;
  isNew?: boolean;
}

export const MusicCard = ({ _id, title, artist, cover, plays, genre, isNew }: MusicCardProps) => {
  const artistName = typeof artist === 'string' ? artist : artist.name;
  const detailHref = `/music/${_id}`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <Link href={detailHref} className="absolute inset-0 z-0 block" aria-label={`View ${title}`}>
          <FillImage
            src={cover}
            alt=""
            sizes="(max-width: 768px) 50vw, 280px"
            className="transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <Play className="w-6 h-6 fill-current ml-1" aria-hidden />
            </span>
          </div>

          <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
            {isNew && <span className="badge-new">NEW</span>}
            <span className="genre-tag bg-card/90 backdrop-blur-sm text-foreground">{genre}</span>
          </div>
        </Link>

        <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="bg-card/80 backdrop-blur-sm hover:bg-card"
            aria-label="Add to favorites"
            onClick={e => e.preventDefault()}>
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="bg-card/80 backdrop-blur-sm hover:bg-card"
            aria-label="Download"
            onClick={e => e.preventDefault()}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={detailHref} className="min-w-0 flex-1">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{artistName}</p>
            <p className="text-xs text-muted-foreground mt-2">{plays} plays</p>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label="More options"
            onClick={e => e.preventDefault()}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
