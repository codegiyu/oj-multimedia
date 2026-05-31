import { notFound } from 'next/navigation';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPastor } from '@/lib/utils/communityApiMappers';
import { PastorPublicProfilePageClient } from '@/components/section/community/ask-a-pastor/PastorPublicProfilePageClient';
import type { PastorDetail } from '@/lib/types/community';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_PASTOR_ITEM', {
    query: `/${slug}` as `/${string}`,
  });

  if (res.type !== 'success' || !res.data.pastor) {
    return { title: 'Pastor profile' };
  }

  return {
    title: res.data.pastor.name,
    description: res.data.pastor.bio ?? `${res.data.pastor.name} — Ask a Pastor`,
  };
}

export default async function PastorPublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const res = await callPublicServerApi('PUBLIC_GET_ASK_A_PASTOR_PASTOR_ITEM', {
    query: `/${slug}` as `/${string}`,
  });

  if (res.type === 'error' || !res.data.pastor) {
    notFound();
  }

  const mapped = mapToPastor(res.data.pastor as unknown as Record<string, unknown>);
  const pastor: PastorDetail = {
    ...mapped,
    slug: mapped.slug ?? slug,
    bio: mapped.bio,
  };

  return <PastorPublicProfilePageClient pastor={pastor} />;
}
