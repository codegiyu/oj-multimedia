'use client';

import { MusicCategories } from './MusicCategories';
import { TrendingSongs, type TrendingSong } from './TrendingSongs';
import { TopMusicCharts, type ChartSong } from './TopMusicCharts';
import { RecentUploads, type RecentUpload } from './RecentUploads';
import { FeaturedArtists, type FeaturedArtist } from './FeaturedArtists';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';

interface MusicPageClientProps {
  trendingSongs: TrendingSong[];
  chartSongs: ChartSong[];
  recentUploads: RecentUpload[];
  featuredArtists: FeaturedArtist[];
}

export const MusicPageClient = ({
  trendingSongs,
  chartSongs,
  recentUploads,
  featuredArtists,
}: MusicPageClientProps) => {
  return (
    <>
      <MusicCategories />
      <TrendingSongs songs={trendingSongs} />
      <TopMusicCharts songs={chartSongs} />
      <RecentUploads uploads={recentUploads} />
      <FeaturedArtists artists={featuredArtists} />
      <MusicUploadCTA />
    </>
  );
};
