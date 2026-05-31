'use client';

import { useRouter } from 'next/navigation';
import { DiscAlbum } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { AlbumCard } from '@/components/cards/AlbumCard';
import type { PublicAlbumCard } from '@/lib/utils/publicApiMappers';
import type { Pagination } from '@/lib/types/pagination';

const ALBUM_GRID_CLASS = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';

interface AlbumsListPageClientProps {
  albums: PublicAlbumCard[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AlbumsListPageClient({
  albums,
  pagination = null,
  initialErrorMessage = null,
}: AlbumsListPageClientProps) {
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

  if (albums.length === 0) {
    return (
      <SectionContainer>
        <SectionEmptyState
          title="No published albums yet"
          description="Album releases will appear here when artists publish them."
          icon={DiscAlbum}
          actionLabel="Browse music"
          actionHref="/music"
        />
      </SectionContainer>
    );
  }

  return (
    <ContentBrowseList pagination={pagination} gridClassName={ALBUM_GRID_CLASS}>
      {albums.map(album => (
        <AlbumCard key={album._id} {...album} />
      ))}
    </ContentBrowseList>
  );
}
