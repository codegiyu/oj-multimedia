'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { QuestionDetail, TestimonyDetail, PrayerRequestDetail } from '@/lib/types/community';
import { Lock, MessageSquare } from 'lucide-react';

export interface AccountCommunityPageClientProps {
  questions: QuestionDetail[];
  testimonies: TestimonyDetail[];
  prayerRequests: PrayerRequestDetail[];
  errorMessage: string | null;
}

export function AccountCommunityPageClient({
  questions,
  testimonies,
  prayerRequests,
  errorMessage,
}: AccountCommunityPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My community"
        description="Questions, testimonies, and prayer requests you've submitted"
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
      </Tabs>
    </div>
  );
}
