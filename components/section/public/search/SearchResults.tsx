'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Play, Clock, Video, Eye } from 'lucide-react';
import type { SearchResultType } from '@/lib/constants/endpoints';
import { getSearchResultDetailHref } from '@/lib/utils/searchResultRoutes';
import { FillImage } from '@/components/general/FillImage';

export interface SearchResultItem {
  _id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  image?: string | { src: string };
  meta: string;
}

const typeColors: Record<string, string> = {
  music: 'bg-primary/10 text-primary',
  album: 'bg-secondary/10 text-secondary',
  news: 'bg-accent/10 text-accent',
  video: 'bg-secondary/10 text-secondary',
  community: 'bg-muted text-muted-foreground',
  artist: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
};

function getDetailHref(item: SearchResultItem): string | null {
  return getSearchResultDetailHref(item.type, item._id);
}

interface SearchResultsProps {
  results: SearchResultItem[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {results.map((result, index) => {
        const href = getDetailHref(result);
        const card = (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
              <FillImage
                src={
                  result.image
                    ? typeof result.image === 'string'
                      ? result.image
                      : result.image.src
                    : ''
                }
                alt={result.title}
                imageContext="public"
                sizes="(max-width: 768px) 50vw, 280px"
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Type Badge */}
              <span
                className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeColors[result.type]}`}>
                {result.type}
              </span>

              {/* Play icon (for music/video) - decorative inside link */}
              {(result.type === 'music' || result.type === 'video' || result.type === 'album') && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.span
                    aria-hidden
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg pointer-events-none">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </motion.span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {result.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{result.subtitle}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {result.type === 'music' && <Play className="w-3 h-3" />}
                {(result.type === 'news' || result.type === 'devotional') && (
                  <Clock className="w-3 h-3" />
                )}
                {result.type === 'video' && <Video className="w-3 h-3" />}
                {(result.type === 'testimony' ||
                  result.type === 'prayer-request' ||
                  result.type === 'question' ||
                  result.type === 'poll' ||
                  result.type === 'resource') && <Eye className="w-3 h-3" />}
                <span>{result.meta}</span>
              </div>
            </div>
          </motion.div>
        );

        return href ? (
          <Link key={result._id} href={href} className="block">
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </div>
  );
};
