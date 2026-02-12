'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { MusicCategories } from './MusicCategories';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { EmptyState } from '../news/EmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import { MusicCard } from '@/components/cards/MusicCard';
import type { TrendingSong } from './TrendingSongs';

interface TrendingSongsPageClientProps {
  trendingSongs: (TrendingSong & { category: string })[];
}

export const TrendingSongsPageClient = ({ trendingSongs }: TrendingSongsPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, trendingSongs.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < trendingSongs.length;
  const itemsToShow = trendingSongs.slice(0, displayedItems);

  return (
    <>
      <MusicCategories />
      <SectionComp
        icon={Flame}
        iconColor="primary"
        heading="Trending Now"
        subtext="The most popular songs everyone is listening to"
        viewAllLink="/music/trending"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <EmptyState
            title="No Trending Songs"
            description="We couldn't find any trending songs in this category. Try selecting a different category or check back later for new content."
            icon={<Flame className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {itemsToShow.map((song, index) => (
                <motion.div
                  key={song._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}>
                  <MusicCard
                    _id={song._id}
                    title={song.title}
                    artist={song.artist}
                    cover={song.cover}
                    plays={song.plays}
                    genre={song.category || 'Music'}
                    isNew={song.isNew}
                  />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={loadMoreItems}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <>
                      Load More Songs
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </>
        )}
      </SectionComp>
      <MusicUploadCTA />
    </>
  );
};
