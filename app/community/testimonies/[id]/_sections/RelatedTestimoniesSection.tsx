import { SectionLoadError } from '@/components/general/SectionLoadError';
import { RelatedTestimoniesGrid } from '@/components/section/community/testimonies/RelatedTestimoniesGrid';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { TestimonyItem } from '@/lib/constants/community/testimonies';

type RelatedTestimoniesSectionProps = {
  id: string;
  category?: string;
};

export async function RelatedTestimoniesSection({ id, category }: RelatedTestimoniesSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', {
    query: buildCommunityListQuery({ type: 'all', limit: 12, category }),
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Related testimonies unavailable"
        message={res.error?.message ?? 'Failed to load related testimonies'}
      />
    );
  }

  const testimonies = ((res.data?.testimonies ?? []) as unknown[])
    .map(i => mapToTestimony(i as Record<string, unknown>) as TestimonyItem)
    .filter(t => t._id !== id)
    .slice(0, 3);

  return <RelatedTestimoniesGrid testimonies={testimonies} />;
}
