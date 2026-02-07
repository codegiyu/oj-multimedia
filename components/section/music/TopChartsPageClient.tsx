'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { MusicCategories } from './MusicCategories';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { EmptyState } from '../news/EmptyState';
import { Button } from '@/components/ui/button';
import { useQueryState, parseAsString } from 'nuqs';
import { ChartCard } from '@/components/cards/ChartCard';
import type { ChartSong } from './TopMusicCharts';

interface TopChartsPageClientProps {
  chartSongs: (ChartSong & { category: string })[];
  period: string;
}

export const TopChartsPageClient = ({
  chartSongs,
  period: initialPeriod,
}: TopChartsPageClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activePeriod] = useQueryState('period', parseAsString.withDefault(initialPeriod));
  const [displayedItems, setDisplayedItems] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handlePeriodChange = (period: string) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    if (period === 'weekly') {
      searchParams.delete('period');
    } else {
      searchParams.set('period', period);
    }

    const newUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 25, chartSongs.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < chartSongs.length;
  const itemsToShow = chartSongs.slice(0, displayedItems);

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'monthly':
        return "This month's top tracks";
      case 'alltime':
        return 'All-time top tracks';
      default:
        return "This week's top tracks";
    }
  };

  return (
    <>
      <MusicCategories />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Top Charts</h2>
                <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePeriodChange('weekly')}
                className={activePeriod === 'weekly' ? 'bg-primary text-primary-foreground' : ''}>
                Weekly
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePeriodChange('monthly')}
                className={activePeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}>
                Monthly
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePeriodChange('alltime')}
                className={activePeriod === 'alltime' ? 'bg-primary text-primary-foreground' : ''}>
                All Time
              </Button>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Chart Songs"
                description="We couldn't find any chart songs in this category. Try selecting a different category or check back later for new content."
                icon={<Trophy className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {itemsToShow.map((song, index) => (
                  <motion.div
                    key={song._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.02 }}>
                    <ChartCard
                      _id={song._id}
                      rank={song.rank}
                      title={song.title}
                      artist={song.artist}
                      cover={song.cover}
                      plays={song.plays}
                      trend={song.trend}
                      change={song.change}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && itemsToShow.length > 0 && (
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
          </div>
        </div>
      </section>
      <MusicUploadCTA />
    </>
  );
};
