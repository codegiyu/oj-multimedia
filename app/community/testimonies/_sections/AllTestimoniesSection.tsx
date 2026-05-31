import { AllTestimonies } from '@/components/section/community/testimonies/AllTestimonies';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

const HUB_TESTIMONIES_LIMIT = 12;

type AllTestimoniesSectionProps = {
  page: number;
};

export async function AllTestimoniesSection({ page }: AllTestimoniesSectionProps) {
  const query = buildBrowseListQuery({
    page,
    limit: HUB_TESTIMONIES_LIMIT,
    extra: { type: 'all' },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', { query });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Testimonies unavailable"
        message={res.error?.message ?? 'Failed to load testimonies'}
      />
    );
  }

  const testimonies = ((res.data?.testimonies ?? []) as unknown[]).map(t =>
    mapToTestimony(t as Record<string, unknown>)
  ) as Testimony[];
  const pagination = res.data?.pagination ?? null;

  return (
    <AllTestimonies testimonies={testimonies} pagination={pagination} presentation="hub-section" />
  );
}
