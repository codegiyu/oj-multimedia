'use client';

import { motion } from 'motion/react';
import { BarChart3, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SectionComp } from '@/components/general/SectionComp';
import type { Poll } from './PollsPageClient';

interface RecentPollsProps {
  polls: Poll[];
}

export const RecentPolls = ({ polls }: RecentPollsProps) => {
  if (polls.length === 0) return null;

  return (
    <SectionComp
      icon={BarChart3}
      iconColor="secondary"
      heading="Recent Polls"
      subtext="View results from recently closed polls"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-3 gap-6">
        {polls.map((poll, index) => {
          const winningOption = poll.options.reduce((prev, current) =>
            prev.votes > current.votes ? prev : current
          );

          return (
            <motion.div
              key={poll._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Link href={`/community/polls-and-voting/${poll._id}`}>
                <Card className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                          Closed
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{poll.timeAgo}</span>
                    </div>

                    <h3 className="font-bold text-foreground mb-1 line-clamp-2">{poll.question}</h3>
                    {poll.creatorLabel ? (
                      <p className="text-xs text-muted-foreground mb-4">By {poll.creatorLabel}</p>
                    ) : (
                      <div className="mb-4" />
                    )}

                    <div className="space-y-3 mb-4">
                      {poll.options.map(option => (
                        <div key={option._id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{option.text}</span>
                            <span className="text-muted-foreground">{option.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full"
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          <span>{poll.totalVotes} votes</span>
                        </div>
                        {winningOption && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Winner: </span>
                            <span className="font-semibold text-foreground">
                              {winningOption.text}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SectionComp>
  );
};
