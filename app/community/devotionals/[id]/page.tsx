import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalDetailPageClient } from '@/components/section/community/devotionals/DevotionalDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';

interface DevotionalDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DevotionalDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return {
      title: 'Devotional Not Found',
      description: 'The requested devotional could not be found.',
    };
  }
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONAL_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return {
      title: 'Devotional Not Found',
      description: 'The requested devotional could not be found.',
    };
  }
  const data = res.data;
  const d = data.devotional as unknown as Record<string, unknown>;
  const title = String(d?.title ?? 'Devotional');
  const excerpt = d?.excerpt ?? d?.description ?? title;
  return {
    title: `${title} - Devotionals`,
    description: String(excerpt),
  };
}

export default async function DevotionalDetailPage({ params }: DevotionalDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) notFound();

  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONAL_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') notFound();

  const data = res.data;
  const raw = data.devotional as unknown as Record<string, unknown>;
  const base = mapToDailyDevotional(raw);
  const devotional = {
    ...base,
    fullContent: raw.fullContent,
    content: raw.content,
  } as Parameters<typeof DevotionalDetailPageClient>[0]['devotional'];

  const relatedRaw = (data.relatedDevotionals ?? []) as unknown[];
  const relatedDevotionals = relatedRaw.map(r => {
    const item = r as Record<string, unknown>;
    return {
      ...mapToDailyDevotional(item),
      fullContent: item.fullContent,
      content: item.content,
    };
  }) as Parameters<typeof DevotionalDetailPageClient>[0]['relatedDevotionals'];

  return (
    <MainLayout>
      <DevotionalDetailPageClient devotional={devotional} relatedDevotionals={relatedDevotionals} />
    </MainLayout>
  );
}
