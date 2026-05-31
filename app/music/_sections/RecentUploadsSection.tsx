import { RecentUploads } from '@/components/section/music/RecentUploads';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToRecentUpload } from '@/lib/utils/publicApiMappers';
import { buildMusicBaseQuery } from './shared';

interface RecentUploadsSectionProps {
  category: string;
}

export async function RecentUploadsSection({ category }: RecentUploadsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query: `${buildMusicBaseQuery(category)}&type=${MUSIC_TYPES.recent}` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Recent uploads unavailable"
        message={res.error?.message ?? 'Failed to load recent uploads'}
      />
    );
  }

  const uploads = (res.data?.music ?? []).map(mapPublicMusicToRecentUpload).slice(0, 6);

  return <RecentUploads uploads={uploads} />;
}
