'use client';

import { motion } from 'motion/react';
import { DiscAlbum } from 'lucide-react';
import { AppLink } from '@/components/atoms/AppLink';
import { FillImage } from '@/components/general/FillImage';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import { ArtistNameLine } from '@/components/general/ArtistNameLine';

type AlbumCardProps = PublicAlbumCard;

export function AlbumCard({
  _id,
  slug,
  title,
  artist,
  cover,
  trackCount,
  releaseDate,
  excerpt,
}: AlbumCardProps) {
  const detailHref = `/music/albums/${slug || _id}`;
  const releaseLabel = releaseDate
    ? new Date(releaseDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <AppLink href={detailHref} className="block" aria-label={`View album ${title}`}>
        <div className="relative aspect-square overflow-hidden">
          <FillImage
            imageContext="public"
            src={cover}
            alt=""
            sizes="(max-width: 768px) 50vw, 280px"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-card/90 backdrop-blur-sm text-foreground">
            <DiscAlbum className="w-3.5 h-3.5" />
            Album
          </span>
        </div>
      </AppLink>
      <div className="p-4">
        <AppLink href={detailHref} className="block">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
        </AppLink>
        <ArtistNameLine artist={artist} />
        {excerpt ? (
          <MultilinePreview
            text={excerpt}
            className="text-xs text-muted-foreground mt-2 line-clamp-2"
          />
        ) : null}
        <p className="text-xs text-muted-foreground mt-2">
          {trackCount} track{trackCount === 1 ? '' : 's'}
          {releaseLabel ? ` · ${releaseLabel}` : ''}
        </p>
      </div>
    </motion.div>
  );
}
