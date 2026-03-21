'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import Link from 'next/link';

export interface Discussion {
  _id: string;
  title: string;
  author: string;
  replies: number;
  participants: number;
  lastActive: string;
  trending: boolean;
}

interface ActiveDiscussionsProps {
  discussions: Discussion[];
}

export const ActiveDiscussions = ({ discussions }: ActiveDiscussionsProps) => {
  return (
    <SectionComp
      icon={MessageCircle}
      iconColor="accent"
      heading="Active Discussions"
      subtext="Join the conversation"
      viewAllLink="/community"
      contentProps={{ enableAnimation: false }}>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {discussions.map((discussion, index) => (
          <motion.div
            key={discussion._id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/30 last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium line-clamp-1">{discussion.title}</h3>
                  {discussion.trending && (
                    <span className="shrink-0 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>by {discussion.author}</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {discussion.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {discussion.participants} joined
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="w-3 h-3" />
                {discussion.lastActive}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="accent" className="gap-2" asChild>
          <Link href="/community">
            <MessageCircle className="w-4 h-4" />
            Start a Discussion
          </Link>
        </Button>
      </div>
    </SectionComp>
  );
};
