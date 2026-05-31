'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Trophy, ArrowRight } from 'lucide-react';
import { MusicCategories } from './MusicCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { Button } from '@/components/ui/button';
import { useQueryState, parseAsString } from 'nuqs';
import { SectionComp } from '@/components/general/SectionComp';
import { ChartCard, ChartCardsLegend } from '@/components/cards/ChartCard';
import type { ChartSong } from './TopMusicCharts';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { Music } from 'lucide-react';

interface TopChartsPageClientProps {
  categoryOptions: CategoryNavItem[];
  chartSongs: (ChartSong & { category?: string })[];
  period: string;
  initialErrorMessage?: string | null;
}

export const TopChartsPageClient = ({
  categoryOptions,

  chartSongs,
  period: initialPeriod,
  initialErrorMessage = null,
}: TopChartsPageClientProps) => {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useQueryState(
    'period',
    parseAsString.withDefault(initialPeriod)
  );
  const [displayedItems, setDisplayedItems] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

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

  const periodButtons = (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await setActivePeriod('weekly');
          router.refresh();
        }}
        className={activePeriod === 'weekly' ? 'bg-primary text-primary-foreground' : ''}>
        Weekly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await setActivePeriod('monthly');
          router.refresh();
        }}
        className={activePeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}>
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await setActivePeriod('alltime');
          router.refresh();
        }}
        className={activePeriod === 'alltime' ? 'bg-primary text-primary-foreground' : ''}>
        All Time
      </Button>
    </div>
  );

  if (initialErrorMessage && chartSongs.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load charts"
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
        icon={Trophy}
        iconColor="accent"
        heading="Top Charts"
        subtext={getPeriodLabel()}
        extraButtons={periodButtons}
        background="bg-muted/30"
        sectionClassName="overflow-hidden"
        contentProps={{ enableAnimation: false }}>
        {itemsToShow.length === 0 ? (
          <SectionEmptyState
            title="No Chart Songs"
            description="We couldn't find any chart songs in this category. Try selecting a different category or check back later for new content."
            icon={Trophy}
            showDefaultActions
          />
        ) : (
          <>
            <ChartCardsLegend />
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
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
                    chartEntry={song.chartEntry}
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
