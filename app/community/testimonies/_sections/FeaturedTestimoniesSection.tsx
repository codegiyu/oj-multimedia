import { FeaturedTestimonies } from '@/components/section/community/testimonies/FeaturedTestimonies';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

export async function FeaturedTestimoniesSection() {
  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', {
    query: '?limit=3&page=1&type=featured' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured testimonies unavailable"
        message={res.error?.message ?? 'Failed to load featured testimonies'}
      />
    );
  }

  const featured = ((res.data?.testimonies ?? []) as unknown[]).map(t =>
    mapToTestimony(t as Record<string, unknown>)
  ) as Testimony[];

  return <FeaturedTestimonies testimonies={featured} />;
}
