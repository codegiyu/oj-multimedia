'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';

export interface PollOption {
  _id: string;
  option: string;
  votes: number;
}

interface CommunityPollPanelProps {
  pollOptions: PollOption[];
  pollTotalVotes: number;
  pollQuestion?: string;
  pollHref?: string;
}

export function CommunityPollPanel({
  pollOptions,
  pollTotalVotes,
  pollQuestion,
  pollHref = '/community/polls-and-voting',
}: CommunityPollPanelProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          Recent Poll
        </h3>
        {pollOptions.length === 0 ? (
          <SectionEmptyState
            title="No active poll"
            description="Check back later for new polls, or visit the polls page to see past votes."
            icon={BarChart3}
            actionLabel="View all polls"
            actionHref="/community/polls-and-voting"
          />
        ) : (
          <>
            {pollQuestion && <p className="text-sm mb-4 font-medium">{pollQuestion}</p>}
            <div className="space-y-2">
              {pollOptions.map(item => (
                <div
                  key={item._id}
                  className="w-full relative bg-muted rounded-lg p-3 text-left text-sm overflow-hidden"
                  aria-label={`Poll result for ${item.option}`}>
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 transition-all"
                    style={{ width: `${item.votes}%` }}
                  />
                  <span className="relative flex items-center justify-between">
                    {item.option}
                    <span className="text-muted-foreground">{item.votes}%</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                {pollTotalVotes.toLocaleString()} votes
              </p>
              <Link
                href={pollHref}
                className="text-xs text-primary hover:text-primary/80 transition-colors">
                Vote on this poll →
              </Link>
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link href="/community/devotionals" className="quick-link w-full justify-start">
            📖 Daily Devotionals
          </Link>
          <Link href="/community/ask-a-pastor" className="quick-link w-full justify-start">
            💬 Ask a Pastor
          </Link>
          <Link
            href="/community/devotionals/bible-study"
            className="quick-link w-full justify-start">
            📚 Bible Study Resources
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
