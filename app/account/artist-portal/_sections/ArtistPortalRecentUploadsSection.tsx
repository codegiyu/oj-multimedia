import { SectionLoadError } from '@/components/general/SectionLoadError';
import {
  ArtistPortalRecentUploadsPanel,
  type ArtistRecentUpload,
} from '@/components/section/account/artist-portal/ArtistPortalRecentUploadsPanel';
import { callServerApi } from '@/lib/services/serverApi';
import type { IArtistRecentUploadItem } from '@/lib/constants/endpoints';

function mapRecentUpload(item: IArtistRecentUploadItem): ArtistRecentUpload {
  return {
    kind: item.kind,
    _id: item._id,
    title: item.title,
    createdAt: item.createdAt,
    status: item.status,
    views: item.views ?? 0,
    plays: item.plays,
  };
}

export async function ArtistPortalRecentUploadsSection() {
  const res = await callServerApi('ARTIST_GET_RECENT_UPLOADS', {
    query: '?limit=6' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Recent uploads unavailable"
        message={res.message || 'Unable to load recent uploads.'}
      />
    );
  }

  const recentUploads = (res.data.uploads ?? []).map(mapRecentUpload);

  return <ArtistPortalRecentUploadsPanel recentUploads={recentUploads} />;
}
