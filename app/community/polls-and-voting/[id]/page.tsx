import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollDetailPageClient } from '@/components/section/community/polls/PollDetailPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import { mapToPoll } from '@/lib/utils/communityApiMappers';

interface PollDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PollDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return { title: 'Poll Not Found', description: 'The requested poll could not be found.' };
  }
  const res = await callServerApi('PUBLIC_GET_POLL_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') {
    return { title: 'Poll Not Found', description: 'The requested poll could not be found.' };
  }
  const data = res.data;
  const poll = data.poll as unknown as Record<string, unknown>;
  return {
    title: `${String(poll?.question ?? 'Poll')} - Polls & Voting`,
    description: String(poll?.description ?? poll?.question ?? ''),
  };
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) notFound();

  const res = await callServerApi('PUBLIC_GET_POLL_ITEM', { query: `/${encodeURIComponent(id)}` });
  if (res.type === 'error') notFound();

  const data = res.data;
  const poll = mapToPoll(data.poll as unknown as Record<string, unknown>);

  return (
    <MainLayout>
      <PollDetailPageClient poll={poll} />
    </MainLayout>
  );
}
