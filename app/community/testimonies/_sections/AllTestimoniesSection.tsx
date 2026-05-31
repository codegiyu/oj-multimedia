import { AllTestimonies } from '@/components/section/community/testimonies/AllTestimonies';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

const DEFAULT_LIMIT = 12;

type AllTestimoniesSectionProps = {
  page: number;
};

export async function AllTestimoniesSection({ page }: AllTestimoniesSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', {
    query: `?limit=${DEFAULT_LIMIT}&page=${page}&type=all` as `?${string}`,
  });

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

  return <AllTestimonies testimonies={testimonies} pagination={pagination} />;
}
