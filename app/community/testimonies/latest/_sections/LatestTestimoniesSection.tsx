import { AllTestimonies } from '@/components/section/community/testimonies/AllTestimonies';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

type LatestTestimoniesSectionProps = {
  page: number;
};

export async function LatestTestimoniesSection({ page }: LatestTestimoniesSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: { type: 'latest' },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', { query }, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest testimonies unavailable"
        message={res.error?.message ?? 'Failed to load testimonies'}
      />
    );
  }

  const latestTestimonies = ((res.data?.testimonies ?? []) as unknown[]).map(i =>
    mapToTestimony(i as Record<string, unknown>)
  ) as Testimony[];

  return (
    <AllTestimonies
      testimonies={latestTestimonies}
      pagination={res.data?.pagination ?? null}
      presentation="browse-list"
    />
  );
}
