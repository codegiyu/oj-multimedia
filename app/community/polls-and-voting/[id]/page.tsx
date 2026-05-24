import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollDetailPageClient } from '@/components/section/community/polls/PollDetailPageClient';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToPoll } from '@/lib/utils/communityApiMappers';
import { buildDetailShareMetadata } from '@/lib/utils/metadata';

interface PollDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PollDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return { title: 'Poll Not Found', description: 'The requested poll could not be found.' };
  }
  const res = await callPublicServerApi('PUBLIC_GET_POLL_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') {
    return { title: 'Poll Not Found', description: 'The requested poll could not be found.' };
  }
  const data = res.data;
  const poll = data.poll as unknown as Record<string, unknown>;
  const question = String(poll?.question ?? 'Poll');
  const title = `${question} - Polls & Voting`;
  const coverImage =
    typeof poll?.coverImage === 'string'
      ? poll.coverImage
      : typeof poll?.image === 'string'
        ? poll.image
        : undefined;

  return buildDetailShareMetadata({
    title,
    description: String(poll?.description ?? question),
    path: `/community/polls-and-voting/${id}`,
    image: coverImage,
    imageAlt: question,
  });
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) notFound();

  const res = await callPublicServerApi('PUBLIC_GET_POLL_ITEM', {
    query: `/${encodeURIComponent(id)}`,
  });
  if (res.type === 'error') notFound();

  const data = res.data;
  const poll = mapToPoll(data.poll as unknown as Record<string, unknown>);

  return (
    <MainLayout>
      <PollDetailPageClient poll={poll} />
    </MainLayout>
  );
}
