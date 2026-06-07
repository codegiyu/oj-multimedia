'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { MusicCategories } from './MusicCategories';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { MusicCard } from '@/components/cards/MusicCard';
import type { TrendingSong } from './TrendingSongs';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { Pagination } from '@/lib/types/pagination';

interface AllMusicPageClientProps {
  config: AllBrowseConfig;
  categoryOptions: CategoryNavItem[];
  songs: (TrendingSong & { category?: string })[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllMusicPageClient({
  config,
  categoryOptions,
  songs,
  pagination = null,
  initialErrorMessage = null,
}: AllMusicPageClientProps) {
  const router = useRouter();

  if (initialErrorMessage && songs.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load music"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Music className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
      </SectionContainer>
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
      {songs.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Music Found"
            description="Try adjusting your search, sort, or category filters, or check back later for new uploads."
            icon={Music}
            showDefaultActions
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={MEDIA_BROWSE_GRID_CLASS}>
          {songs.map((song, index) => (
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
                album={song.album}
              />
            </motion.div>
          ))}
        </ContentBrowseList>
      )}
    </>
  );
}
