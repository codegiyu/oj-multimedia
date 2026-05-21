'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { MusicCategories } from './MusicCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { EmptyState } from '../news/EmptyState';
import { SectionComp } from '@/components/general/SectionComp';
import { MusicCard } from '@/components/cards/MusicCard';
import type { TrendingSong } from './TrendingSongs';
import { Music } from 'lucide-react';

interface TrendingSongsPageClientProps {
  categoryOptions: CategoryNavItem[];
  trendingSongs: (TrendingSong & { category?: string })[];
  initialErrorMessage?: string | null;
}

export const TrendingSongsPageClient = ({
  categoryOptions,

  trendingSongs,
  initialErrorMessage = null,
}: TrendingSongsPageClientProps) => {
  const router = useRouter();
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

  if (initialErrorMessage && trendingSongs.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load trending songs"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Music className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <MusicCategories categoryOptions={categoryOptions} />
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
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
