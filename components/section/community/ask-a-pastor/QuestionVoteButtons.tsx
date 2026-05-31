'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { getErrorMessage } from '@/lib/utils/general';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface QuestionVoteButtonsProps {
  questionId: string;
  initialUpvotes: number;
  initialDownvotes: number;
}

export function QuestionVoteButtons({
  questionId,
  initialUpvotes,
  initialDownvotes,
}: QuestionVoteButtonsProps) {
  const user = useAuthStore(state => state.user);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const vote = async (direction: 'up' | 'down') => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setLoading(true);
    const res = await callApi('PUBLIC_QUESTION_VOTE', {
      query: `/${questionId}/vote` as `/${string}/vote`,
      payload: { direction },
    });
    setLoading(false);

    if (res.error) {
      toast({ title: 'Vote failed', description: getErrorMessage(res.error), variant: 'error' });
      return;
    }

    if (res.data) {
      setUpvotes(res.data.upvotes);
      setDownvotes(res.data.downvotes);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={loading}
          onClick={() => vote('up')}>
          <ThumbsUp className="h-4 w-4" />
          {upvotes}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={loading}
          onClick={() => vote('down')}>
          <ThumbsDown className="h-4 w-4" />
          {downvotes}
        </Button>
      </div>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
