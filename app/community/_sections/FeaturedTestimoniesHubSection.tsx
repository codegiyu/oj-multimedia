import { FeaturedTestimonies } from '@/components/section/community/FeaturedTestimonies';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';

export async function FeaturedTestimoniesHubSection() {
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

  const testimonies = (res.data?.testimonies ?? []).map(t =>
    mapToTestimony(t as unknown as Record<string, unknown>)
  );

  return <FeaturedTestimonies testimonies={testimonies} />;
}
