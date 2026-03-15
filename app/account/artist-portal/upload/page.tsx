import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistPortalUploadPageClient } from '@/components/section/account/artist-portal/ArtistPortalUploadPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { ArtistMusicListItem, ArtistVideoListItem } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Artist Portal - Upload',
  description: 'Upload new music and video content.',
};

function ArtistUploadSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-64 rounded-md bg-muted" />
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  );
}

type SearchParams = { id?: string; type?: string };

export default function ArtistPortalUploadPage({ searchParams }: { searchParams?: SearchParams }) {
  const editId = searchParams?.id ?? '';
  const editType = (searchParams?.type === 'video' ? 'video' : 'music') as 'music' | 'video';

  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<ArtistUploadSkeleton />}>
        <ArtistUploadPageServer editId={editId} editType={editType} />
      </Suspense>
    </MainLayout>
  );
}

async function ArtistUploadPageServer({
  editId,
  editType,
}: {
  editId: string;
  editType: 'music' | 'video';
}) {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.error || !meRes.data) {
    const responseCode = (meRes.error as ApiErrorResponse | undefined)?.responseCode;
    const hasArtistProfile = responseCode !== 403 && responseCode !== 404;
    return (
      <ArtistPortalUploadPageClient
        initialHasArtistProfile={hasArtistProfile}
        initialLoadError={meRes.message || 'Unable to load artist profile.'}
        initialMusicItem={null}
        initialVideoItem={null}
        editId={editId}
        editType={editType}
      />
    );
  }

  let initialMusicItem: ArtistMusicListItem | null = null;
  let initialVideoItem: ArtistVideoListItem | null = null;

  if (editId && editType === 'music') {
    const itemRes = await callServerApi('ARTIST_GET_MUSIC_ITEM', {
      query: `/${editId}`,
    });
    if (!itemRes.error && itemRes.data?.music) {
      initialMusicItem = itemRes.data.music;
    }
  } else if (editId && editType === 'video') {
    const itemRes = await callServerApi('ARTIST_GET_VIDEO_ITEM', {
      query: `/${editId}`,
    });
    if (!itemRes.error && itemRes.data?.video) {
      initialVideoItem = itemRes.data.video;
    }
  }

  return (
    <ArtistPortalUploadPageClient
      initialHasArtistProfile={true}
      initialLoadError={null}
      initialMusicItem={initialMusicItem}
      initialVideoItem={initialVideoItem}
      editId={editId}
      editType={editType}
    />
  );
}
