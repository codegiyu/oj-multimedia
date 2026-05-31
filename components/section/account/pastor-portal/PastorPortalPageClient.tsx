'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HelpCircle, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import type { IPastorDashboardStatsRes, ClientPastorProfile } from '@/lib/constants/endpoints';
import type { QuestionListItem } from '@/lib/types/community';

export interface PastorPortalPageClientProps {
  stats: IPastorDashboardStatsRes | null;
  recentQuestions: QuestionListItem[];
  pastor: ClientPastorProfile | null;
  errorMessage: string | null;
}

export function PastorPortalPageClient({
  stats,
  recentQuestions,
  errorMessage,
}: PastorPortalPageClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Pastor overview"
        description="Your ministry dashboard for Ask a Pastor">
        <Button asChild className="rounded-full bg-primary px-5 hover:bg-primary/90">
          <Link href="/account/pastor-portal/questions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            View questions
          </Link>
        </Button>
      </DashboardPageHeader>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          label="Questions answered"
          value={stats?.questionsAnswered ?? 0}
          icon={HelpCircle}
        />
        <DashboardStatCard
          label="Pending questions"
          value={stats?.pendingQuestions ?? 0}
          icon={MessageSquare}
        />
        <DashboardStatCard
          label="Assigned to you"
          value={stats?.assignedQuestions ?? 0}
          icon={Star}
        />
        <DashboardStatCard
          label="Community upvotes"
          value={stats?.totalUpvotes ?? 0}
          icon={ThumbsUp}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold">Recent questions</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/pastor-portal/questions">View all</Link>
          </Button>
        </div>

        {recentQuestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No questions in your inbox yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentQuestions.slice(0, 5).map(q => (
              <li key={q._id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/account/pastor-portal/questions/${q._id}`}
                    className="font-medium hover:text-primary line-clamp-2">
                    {q.question}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {q.category} · {q.author}
                    {q.isPrivate ? ' · Private' : ''}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {q.status ?? 'active'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
