'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ClientPastorProfile } from '@/lib/constants/endpoints';
import type { QuestionListItem } from '@/lib/types/community';
import {
  filterPastorQuestionsByTab,
  type PastorQuestionTab,
} from '@/lib/utils/pastorPortalQuestions';
import { Lock } from 'lucide-react';

export interface PastorPortalQuestionsPageClientProps {
  initialQuestions: QuestionListItem[];
  pastor: ClientPastorProfile | null;
  errorMessage: string | null;
}

export function PastorPortalQuestionsPageClient({
  initialQuestions,
  pastor,
  errorMessage,
}: PastorPortalQuestionsPageClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<PastorQuestionTab>('directed');
  const pastorId = pastor?._id ?? '';

  const filtered = useMemo(
    () => filterPastorQuestionsByTab(initialQuestions, tab, pastorId),
    [initialQuestions, tab, pastorId]
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Questions inbox"
        description="Answer questions directed to you, from the open pool, or review your past answers"
      />

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <Tabs value={tab} onValueChange={value => setTab(value as PastorQuestionTab)}>
        <TabsList>
          <TabsTrigger value="directed">For me</TabsTrigger>
          <TabsTrigger value="pool">Open pool</TabsTrigger>
          <TabsTrigger value="answered">My answers</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No questions in this tab right now.
          </Card>
        ) : (
          filtered.map(q => (
            <Card key={q._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{q.category}</Badge>
                    {q.isPrivate ? (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    ) : null}
                    {q.isAnswered ? <Badge>Answered</Badge> : null}
                  </div>
                  <Link
                    href={`/account/pastor-portal/questions/${q._id}`}
                    className="font-medium hover:text-primary line-clamp-2">
                    {q.question}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {q.author} · {q.views} views · {(q.answersCount ?? q.answers) || 0} answers
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/account/pastor-portal/questions/${q._id}`}>Open</Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
