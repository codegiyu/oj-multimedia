'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MultilineText } from '@/components/general/MultilineText';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { getErrorMessage } from '@/lib/utils/general';
import type { QuestionDetail } from '@/lib/types/community';
import { ArrowLeft, Lock } from 'lucide-react';

export interface AccountCommunityQuestionDetailPageClientProps {
  question: QuestionDetail;
}

export function AccountCommunityQuestionDetailPageClient({
  question: initialQuestion,
}: AccountCommunityQuestionDetailPageClientProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialQuestion);
  const [closing, setClosing] = useState(false);

  const answers = question.answersList ?? [];

  const handleClose = async () => {
    setClosing(true);
    const res = await callApi('USER_ME_COMMUNITY_QUESTION_CLOSE', {
      query: `/${question._id}/close` as `/${string}/close`,
    });
    setClosing(false);

    if (res.error) {
      toast({
        title: 'Unable to close question',
        description: getErrorMessage(res.error),
        variant: 'error',
      });
      return;
    }

    if (res.data?.question) {
      setQuestion(res.data.question);
    }

    toast({ title: 'Question closed', variant: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
        <Link href="/account/community">
          <ArrowLeft className="h-4 w-4" />
          Back to My Community
        </Link>
      </Button>

      <DashboardPageHeader
        title="My question"
        description="View answers and manage your submission"
      />

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{question.category}</Badge>
          {question.isPrivate ? (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          ) : null}
          <Badge variant="outline">{question.status}</Badge>
        </div>
        <h2 className="text-xl font-semibold">{question.question}</h2>
        {question.status !== 'closed' ? (
          <Button variant="outline" size="sm" onClick={handleClose} disabled={closing}>
            {closing ? 'Closing…' : 'Close question'}
          </Button>
        ) : null}
      </Card>

      {answers.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold">Answers</h3>
          {answers.map(entry => (
            <Card key={entry._id} className="p-5 space-y-2">
              <p className="font-medium text-sm">{entry.pastor?.name ?? 'Pastor'}</p>
              <MultilineText text={entry.answer} paragraphClassName="text-sm text-foreground" />
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-sm text-muted-foreground">
          No answers yet. Pastors will respond when available.
        </Card>
      )}
    </div>
  );
}
