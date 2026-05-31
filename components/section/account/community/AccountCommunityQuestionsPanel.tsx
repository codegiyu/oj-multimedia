'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuestionDetail } from '@/lib/types/community';
import { Lock, MessageSquare } from 'lucide-react';

interface AccountCommunityQuestionsPanelProps {
  questions: QuestionDetail[];
}

export function AccountCommunityQuestionsPanel({ questions }: AccountCommunityQuestionsPanelProps) {
  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        You haven&apos;t submitted any questions yet.{' '}
        <Link href="/community/ask-a-pastor#submit-question" className="text-primary underline">
          Ask a question
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(q => (
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
      ))}
    </div>
  );
}
