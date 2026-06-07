'use client';

import { useRouter } from 'next/navigation';
import { DiscAlbum } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { AlbumCard } from '@/components/cards/AlbumCard';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import type { Pagination } from '@/lib/types/pagination';

const ALBUM_GRID_CLASS = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';

interface AllAlbumsPageClientProps {
  config: AllBrowseConfig;
  albums: PublicAlbumCard[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllAlbumsPageClient({
  config,
  albums,
  pagination = null,
  initialErrorMessage = null,
}: AllAlbumsPageClientProps) {
  const router = useRouter();

  if (initialErrorMessage && albums.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load albums"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<DiscAlbum className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config} />
      </SectionContainer>
      {albums.length === 0 ? (
        <SectionContainer>
          <SectionEmptyState
            title="No Albums Found"
            description="Try adjusting your search or sort filters, or check back later for new releases."
            icon={DiscAlbum}
            actionLabel="Browse music"
            actionHref="/music/all"
          />
        </SectionContainer>
      ) : (
        <ContentBrowseList pagination={pagination} gridClassName={ALBUM_GRID_CLASS}>
          {albums.map(album => (
            <AlbumCard key={album._id} {...album} />
          ))}
        </ContentBrowseList>
      )}
    </>
  );
}
