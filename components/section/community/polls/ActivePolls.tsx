'use client';

import { motion } from 'motion/react';
import { BarChart3, Vote, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { Poll } from './PollsPageClient';
import { MultilinePreview } from '@/components/general/MultilinePreview';

interface ActivePollsProps {
  polls: Poll[];
}

export const ActivePolls = ({ polls }: ActivePollsProps) => {
  const [displayedItems, setDisplayedItems] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 4, polls.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < polls.length;
  const itemsToShow = polls.slice(0, displayedItems);

  return (
    <SectionComp
      id="active-polls"
      icon={BarChart3}
      iconColor="primary"
      heading="Active Polls"
      subtext="Participate in ongoing polls and share your opinion with the community"
      contentProps={{ enableAnimation: false }}>
      {polls.length === 0 ? (
        <SectionEmptyState
          title="No active polls"
          description="There are no open polls right now. Create one or check recent results below."
          icon={BarChart3}
          actionLabel="Create a poll"
          actionHref="#create-poll"
        />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {itemsToShow.map((poll, index) => (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}>
                <Card className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Vote className="w-5 h-5 text-primary" />
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      {poll.endDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Ends {poll.endDate}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-foreground mb-2">{poll.question}</h3>
                    {poll.description && (
                      <MultilinePreview
                        text={poll.description}
                        className="text-sm text-muted-foreground mb-6 line-clamp-3"
                      />
                    )}

                    <div className="space-y-3 mb-6">
                      {poll.options.map(option => (
                        <div key={option._id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">{option.text}</span>
                            <span className="text-muted-foreground">
                              {option.votes} votes ({option.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${option.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <span>{poll.totalVotes} total votes</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/community/polls-and-voting/${poll._id}`}>Vote Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && itemsToShow.length > 0 && (
            <div className="flex justify-center mt-10">
              <motion.button
                onClick={loadMoreItems}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Load More Polls
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </>
      )}
    </SectionComp>
  );
};
