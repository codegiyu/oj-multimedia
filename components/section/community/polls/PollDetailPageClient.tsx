'use client';

import { motion } from 'motion/react';
import { Calendar, Share2, CheckCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { mapToPoll } from '@/lib/utils/communityApiMappers';
import type { PollItem } from '@/lib/constants/community/polls';
import { MultilineText } from '@/components/general/MultilineText';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';

interface PollDetailPageClientProps {
  poll: PollItem;
}

export const PollDetailPageClient = ({ poll }: PollDetailPageClientProps) => {
  const user = useAuthStore(state => state.user);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: poll.question,
          text: poll.description || poll.question,
          url: window.location.href,
        });
        toast({
          title: 'Shared!',
          description: 'Poll shared successfully.',
          variant: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Poll link copied to clipboard.',
          variant: 'success',
        });
      }
    } catch {
      // User cancelled share
    }
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted || poll.status === 'closed' || isVoting) {
      if (poll.status === 'closed') {
        toast({
          title: 'Poll Closed',
          description: 'This poll is no longer accepting votes.',
          variant: 'error',
        });
      }
      return;
    }

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsVoting(true);
    const res = await callApi('PUBLIC_POLL_VOTE', {
      query: `/${encodeURIComponent(poll._id)}/vote`,
      payload: { optionId },
    });
    setIsVoting(false);

    if (res.error) {
      if (res.error.responseCode === 401) {
        setIsLoginModalOpen(true);
        return;
      }

      const isAlreadyVoted = res.error.responseCode === 409;
      const msg = getErrorMessage(res.error);
      toast({
        title: isAlreadyVoted ? 'Already voted' : 'Vote failed',
        description: isAlreadyVoted
          ? "You've already voted on this poll."
          : msg || 'You may have already voted, or the poll is closed.',
        variant: 'error',
      });
      return;
    }

    setSelectedOption(optionId);
    setHasVoted(true);

    const updatedPoll = res.data?.poll as Record<string, unknown> | undefined;
    if (updatedPoll) {
      setLocalPoll(mapToPoll(updatedPoll) as PollItem);
    } else {
      // Fallback: optimistic update
      const updatedOptions = localPoll.options.map(opt => {
        if (opt._id === optionId) {
          const newVotes = opt.votes + 1;
          const newTotal = localPoll.totalVotes + 1;
          const newPercentage = Math.round((newVotes / newTotal) * 100);
          return { ...opt, votes: newVotes, percentage: newPercentage };
        }
        return opt;
      });
      const newTotal = localPoll.totalVotes + 1;
      const recalculatedOptions = updatedOptions.map(opt => ({
        ...opt,
        percentage: Math.round((opt.votes / newTotal) * 100),
      }));
      setLocalPoll({
        ...localPoll,
        options: recalculatedOptions,
        totalVotes: newTotal,
      });
    }

    toast({
      title: 'Vote Cast!',
      description: 'Thank you for participating in this poll.',
      variant: 'success',
    });
  };

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/polls-and-voting"
        backLabel="Back to Polls"
        title={poll.question}
        badge={
          <>
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-2">
              {poll.status === 'active' ? 'Active' : 'Closed'}
            </span>
            {poll.category && (
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-muted text-foreground text-xs">
                {poll.category}
              </span>
            )}
          </>
        }
        metaItems={[
          ...(poll.creatorLabel ? [{ icon: BarChart3, label: `By ${poll.creatorLabel}` }] : []),
          ...(poll.date
            ? [{ icon: Calendar, label: new Date(poll.date).toLocaleDateString() }]
            : []),
          { icon: BarChart3, label: `${localPoll.totalVotes} votes` },
        ]}>
        {poll.description && (
          <MultilineText
            text={poll.description}
            className="mb-2"
            paragraphClassName="text-lg text-muted-foreground"
          />
        )}
      </CommunityContentDetailHero>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4">
            {localPoll.options.map(option => {
              const isSelected = selectedOption === option._id;
              const isDisabled = hasVoted || poll.status === 'closed' || isVoting;

              return (
                <button
                  key={option._id}
                  onClick={() => void handleVote(option._id)}
                  disabled={isDisabled}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : isDisabled
                        ? 'border-border bg-muted/30 cursor-not-allowed'
                        : 'border-border hover:border-primary hover:bg-muted/50 cursor-pointer'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{option.text}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{option.votes} votes</span>
                    <span>{option.percentage}%</span>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-600 font-medium">Thank you for voting!</p>
            </motion.div>
          )}

          {poll.status === 'closed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
              <p className="text-muted-foreground">This poll is now closed.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {localPoll.totalVotes} total votes
              </span>
            </div>
            <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Poll
            </Button>
          </motion.div>
        </div>
      </section>
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title="Sign in to vote"
        description="Create an account or sign in to participate in this poll."
      />
    </article>
  );
};
