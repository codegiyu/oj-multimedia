'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { MusicCategories } from './MusicCategories';
import { TrendingSongs, type TrendingSong } from './TrendingSongs';
import { TopMusicCharts, type ChartSong } from './TopMusicCharts';
import { RecentUploads, type RecentUpload } from './RecentUploads';
import { FeaturedArtists, type FeaturedArtist } from './FeaturedArtists';
import { FeaturedAlbums } from './FeaturedAlbums';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { Music } from 'lucide-react';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

interface MusicPageClientProps {
  trendingSongs: TrendingSong[];
  chartSongs: ChartSong[];
  recentUploads: RecentUpload[];
  featuredArtists: FeaturedArtist[];
  featuredAlbums: PublicAlbumCard[];
  categoryOptions: CategoryNavItem[];
  initialErrorMessage?: string | null;
}

export const MusicPageClient = ({
  trendingSongs,
  chartSongs,
  recentUploads,
  featuredArtists,
  featuredAlbums,
  categoryOptions,
  initialErrorMessage = null,
}: MusicPageClientProps) => {
  const router = useRouter();
  const hasAnyContent =
    trendingSongs.length > 0 ||
    chartSongs.length > 0 ||
    recentUploads.length > 0 ||
    featuredArtists.length > 0 ||
    featuredAlbums.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
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
      <TrendingSongs songs={trendingSongs} />
      <FeaturedAlbums albums={featuredAlbums} />
      <TopMusicCharts songs={chartSongs} />
      <RecentUploads uploads={recentUploads} />
      <FeaturedArtists artists={featuredArtists} />
      <MusicUploadCTA />
    </>
  );
};
