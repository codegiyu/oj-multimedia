'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { MusicCategories } from './MusicCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { Button } from '@/components/ui/button';
import { useQueryState, parseAsString } from 'nuqs';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { ChartCard, ChartCardsLegend } from '@/components/cards/ChartCard';
import type { ChartSong } from './TopMusicCharts';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { Music } from 'lucide-react';
import type { Pagination } from '@/lib/types/pagination';

interface TopChartsPageClientProps {
  categoryOptions: CategoryNavItem[];
  chartSongs: (ChartSong & { category?: string })[];
  period: string;
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  showCategories?: boolean;
}

export const TopChartsPageClient = ({
  categoryOptions,
  chartSongs,
  period: initialPeriod,
  pagination = null,
  initialErrorMessage = null,
  showCategories = true,
}: TopChartsPageClientProps) => {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useQueryState(
    'period',
    parseAsString.withDefault(initialPeriod)
  );

  const periodButtons = (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {activePeriod === 'monthly'
          ? "This month's top tracks"
          : activePeriod === 'alltime'
            ? 'All-time top tracks'
            : "This week's top tracks"}
      </p>
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
      {showCategories ? <MusicCategories categoryOptions={categoryOptions} /> : null}
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
      {chartSongs.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Chart Songs"
            description="We couldn't find any chart songs in this category. Try selecting a different category or check back later for new content."
            icon={Trophy}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList
          pagination={pagination}
          toolbar={
            <>
              {periodButtons}
              <div className="mt-4">
                <ChartCardsLegend />
              </div>
            </>
          }
          className="bg-muted/30"
          gridClassName="grid gap-3 md:grid-cols-2 md:gap-4">
          {chartSongs.map((song, index) => (
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
        </ContentBrowseList>
      )}
      <MusicUploadCTA />
    </>
  );
};
