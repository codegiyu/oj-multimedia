import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountCommunityTestimoniesPanel } from '@/components/section/account/community/AccountCommunityTestimoniesPanel';
import { callServerApi } from '@/lib/services/serverApi';
import type { TestimonyDetail } from '@/lib/types/community';

export async function AccountCommunityTestimoniesSection() {
  const res = await callServerApi('USER_ME_COMMUNITY_TESTIMONIES', {
    query: '?limit=50' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Testimonies unavailable"
        message={res.message || 'Unable to load your testimonies.'}
      />
    );
  }

  const testimonies = (res.data.testimonies as TestimonyDetail[]) ?? [];

  return <AccountCommunityTestimoniesPanel testimonies={testimonies} />;
}
