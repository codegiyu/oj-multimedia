'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, CheckCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import type { PollItem } from '@/lib/constants/community/polls';

interface PollDetailPageClientProps {
  poll: PollItem;
}

export const PollDetailPageClient = ({ poll }: PollDetailPageClientProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);

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
    } catch (error) {
      // User cancelled share
      console.error(error);
    }
  };

  const handleVote = (optionId: string) => {
    if (hasVoted || poll.status === 'closed') {
      if (poll.status === 'closed') {
        toast({
          title: 'Poll Closed',
          description: 'This poll is no longer accepting votes.',
          variant: 'error',
        });
      }
      return;
    }

    setSelectedOption(optionId);
    setHasVoted(true);

    // Update local state to show vote
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

    toast({
      title: 'Vote Cast!',
      description: 'Thank you for participating in this poll.',
      variant: 'success',
    });
  };

  return (
    <article className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/community/polls-and-voting">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Polls
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {poll.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                  {poll.category && (
                    <span className="px-3 py-1 rounded-full bg-muted text-foreground text-xs">
                      {poll.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {poll.question}
                </h1>
                {poll.description && (
                  <p className="text-lg text-muted-foreground mb-6">{poll.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {poll.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(poll.date).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {localPoll.totalVotes} votes
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4">
            {localPoll.options.map(option => {
              const isSelected = selectedOption === option._id;
              const isDisabled = hasVoted || poll.status === 'closed';

              return (
                <button
                  key={option._id}
                  onClick={() => handleVote(option._id)}
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
    </article>
  );
};
