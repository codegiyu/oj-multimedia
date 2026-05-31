'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { PollListItem } from '@/lib/types/community';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { toast } from '@/components/atoms/Toast';
import { BarChart3 } from 'lucide-react';

interface AccountCommunityPollsPanelProps {
  polls: PollListItem[];
}

export function AccountCommunityPollsPanel({ polls }: AccountCommunityPollsPanelProps) {
  const router = useRouter();
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

  if (polls.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No polls submitted yet.{' '}
        <Link href="/community/polls-and-voting#create-poll" className="text-primary underline">
          Create a poll
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map(poll => (
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
      ))}
    </div>
  );
}
