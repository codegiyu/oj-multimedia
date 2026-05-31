'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { MultilineText } from '@/components/general/MultilineText';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { getErrorMessage } from '@/lib/utils/general';
import type { QuestionDetail } from '@/lib/types/community';
import { Lock, ArrowLeft } from 'lucide-react';

export interface PastorPortalQuestionDetailPageClientProps {
  question: QuestionDetail;
  errorMessage: string | null;
}

export function PastorPortalQuestionDetailPageClient({
  question: initialQuestion,
  errorMessage,
}: PastorPortalQuestionDetailPageClientProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const answers = question.answersList ?? [];
  const canAnswer = question.status !== 'closed';

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    const res = await callApi('PASTOR_ANSWER_QUESTION', {
      query: `/${question._id}/answers` as `/${string}/answers`,
      payload: { answer: answer.trim() },
    });
    setSubmitting(false);

    if (res.error) {
      toast({
        title: 'Unable to submit answer',
        description: getErrorMessage(res.error),
        variant: 'error',
      });
      return;
    }

    toast({ title: 'Answer submitted', variant: 'success' });
    setAnswer('');
    if (res.data?.question) {
      setQuestion(res.data.question);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
        <Link href="/account/pastor-portal/questions">
          <ArrowLeft className="h-4 w-4" />
          Back to inbox
        </Link>
      </Button>

      <DashboardPageHeader
        title="Question detail"
        description="Review and respond to this question"
      />

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

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
        <p className="text-sm text-muted-foreground">Asked by {question.author}</p>
      </Card>

      {answers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Answers ({answers.length})</h3>
          {answers.map(entry => (
            <Card key={entry._id} className="p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-sm">
                  {entry.pastor?.name ?? 'Pastor'}
                  {entry.pastor?.title ? ` · ${entry.pastor.title}` : ''}
                </p>
                {entry.answeredAt ? (
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.answeredAt).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
              <MultilineText text={entry.answer} paragraphClassName="text-sm text-foreground" />
              <p className="text-xs text-muted-foreground">{entry.likes} likes</p>
            </Card>
          ))}
        </div>
      )}

      {canAnswer && (
        <Card className="p-6">
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <RegularTextarea
              id="pastor-answer"
              name="answer"
              label="Your answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={8}
              required
              maxLength={5000}
            />
            <RegularBtn
              type="submit"
              text="Submit answer"
              loading={submitting}
              disabled={!answer.trim()}
            />
          </form>
        </Card>
      )}
    </div>
  );
}
