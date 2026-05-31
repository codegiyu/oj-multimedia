'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  QuestionDetail,
  TestimonyDetail,
  PrayerRequestDetail,
  PollListItem,
} from '@/lib/types/community';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { toast } from '@/components/atoms/Toast';
import { Lock, MessageSquare, BarChart3 } from 'lucide-react';

export interface AccountCommunityPageClientProps {
  questions: QuestionDetail[];
  testimonies: TestimonyDetail[];
  prayerRequests: PrayerRequestDetail[];
  polls: PollListItem[];
  errorMessage: string | null;
}

export function AccountCommunityPageClient({
  questions,
  testimonies,
  prayerRequests,
  polls,
  errorMessage,
}: AccountCommunityPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('questions');
  const [closingPollId, setClosingPollId] = useState<string | null>(null);

  const handleClosePoll = async (pollId: string) => {
    setClosingPollId(pollId);
    const res = await callApi('USER_ME_COMMUNITY_POLL_CLOSE', {
      query: `/${pollId}/close` as `/${string}/close`,
    });
    setClosingPollId(null);

    if (res.error) {
      toast({
        title: 'Could not close poll',
        description: getErrorMessage(res.error),
        variant: 'error',
      });
      return;
    }

    toast({
      title: 'Poll closed',
      description: 'Your poll is no longer accepting votes.',
      variant: 'success',
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My community"
        description="Questions, testimonies, prayer requests, and polls you've submitted"
      />

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="questions">My Questions</TabsTrigger>
          <TabsTrigger value="testimonies">Testimonies</TabsTrigger>
          <TabsTrigger value="prayer-requests">Prayer Requests</TabsTrigger>
          <TabsTrigger value="polls">My Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6 space-y-4">
          {questions.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              You haven&apos;t submitted any questions yet.{' '}
              <Link
                href="/community/ask-a-pastor#submit-question"
                className="text-primary underline">
                Ask a question
              </Link>
            </Card>
          ) : (
            questions.map(q => (
              <Card key={q._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{q.category}</Badge>
                      {q.isPrivate ? (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Private
                        </Badge>
                      ) : null}
                      <Badge variant="outline">{q.status}</Badge>
                    </div>
                    <Link
                      href={`/account/community/questions/${q._id}`}
                      className="font-medium hover:text-primary line-clamp-2">
                      {q.question}
                    </Link>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {(q.answersCount ?? q.answers) || 0} answers
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/account/community/questions/${q._id}`}>View</Link>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="testimonies" className="mt-6 space-y-4">
          {testimonies.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No testimonies submitted yet.
            </Card>
          ) : (
            testimonies.map(t => (
              <Card key={t._id} className="p-5">
                <p className="font-medium">{t.author}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{t.content}</p>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="prayer-requests" className="mt-6 space-y-4">
          {prayerRequests.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No prayer requests submitted yet.
            </Card>
          ) : (
            prayerRequests.map(p => (
              <Card key={p._id} className="p-5">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.content}</p>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="polls" className="mt-6 space-y-4">
          {polls.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No polls submitted yet.{' '}
              <Link
                href="/community/polls-and-voting#create-poll"
                className="text-primary underline">
                Create a poll
              </Link>
            </Card>
          ) : (
            polls.map(poll => (
              <Card key={poll._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {poll.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{poll.question}</p>
                    <p className="text-xs text-muted-foreground">{poll.totalVotes} votes</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {poll.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={closingPollId === poll._id}
                        onClick={() => void handleClosePoll(poll._id)}>
                        {closingPollId === poll._id ? 'Closing…' : 'Close poll'}
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/community/polls-and-voting/${poll._id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
