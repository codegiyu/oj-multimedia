import { SectionLoadError } from '@/components/general/SectionLoadError';
import { RelatedDevotionals } from '@/components/section/community/devotionals/RelatedDevotionals';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import type { DevotionalItem } from '@/lib/constants/community/devotionals';

type RelatedDevotionalsSectionProps = {
  id: string;
};

export async function RelatedDevotionalsSection({ id }: RelatedDevotionalsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: '?limit=8&page=1&type=latest' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Related devotionals unavailable"
        message={res.error?.message ?? 'Failed to load related devotionals'}
      />
    );
  }

  const relatedDevotionals = ((res.data?.devotionals ?? []) as unknown[])
    .map(r => {
      const item = r as Record<string, unknown>;
      return {
        ...mapToDailyDevotional(item),
        fullContent: item.fullContent,
        content: item.content,
      };
    })
    .filter(d => d._id !== id)
    .slice(0, 4) as DevotionalItem[];

  if (relatedDevotionals.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-muted/30">
      <RelatedDevotionals devotionals={relatedDevotionals} />
    </section>
  );
}
