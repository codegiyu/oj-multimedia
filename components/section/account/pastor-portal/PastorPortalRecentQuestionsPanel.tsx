'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuestionListItem } from '@/lib/types/community';

interface PastorPortalRecentQuestionsPanelProps {
  recentQuestions: QuestionListItem[];
}

export function PastorPortalRecentQuestionsPanel({
  recentQuestions,
}: PastorPortalRecentQuestionsPanelProps) {
  return (
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
              <span className="text-xs text-muted-foreground shrink-0">{q.status ?? 'active'}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
