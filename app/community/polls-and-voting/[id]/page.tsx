import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PollDetailPageClient } from '@/components/section/community/polls/PollDetailPageClient';
import { getPollById } from '@/lib/utils/community/polls';

interface PollDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the poll detail page
export async function generateMetadata({ params }: PollDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return {
      title: 'Poll Not Found',
      description: 'The requested poll could not be found.',
    };
  }

  const poll = getPollById(id);

  if (!poll) {
    return {
      title: 'Poll Not Found',
      description: 'The requested poll could not be found.',
    };
  }

  return {
    title: `${poll.question} - Polls & Voting`,
    description: poll.description || poll.question,
  };
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  // Validate ID
  if (isNaN(id)) {
    notFound();
  }

  // Get poll item
  const poll = getPollById(id);

  // Return 404 if not found
  if (!poll) {
    notFound();
  }

  return (
    <MainLayout>
      <PollDetailPageClient poll={poll} />
    </MainLayout>
  );
}
