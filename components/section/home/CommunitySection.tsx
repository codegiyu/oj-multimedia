'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, BarChart3, Sparkles, ArrowRight, BookOpen, Heart, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FixedImage } from '@/components/general/FillImage';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LoginModal } from '@/components/auth/LoginModal';
import { EmptyState } from '@/components/section/news/EmptyState';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import type { CommunityHighlightItem } from '@/lib/utils/mergeCommunityHighlights';
import { cn } from '@/lib/utils';

export interface PollOption {
  _id: string;
  option: string;
  votes: number;
}

interface CommunitySectionProps {
  highlights: CommunityHighlightItem[];
  pollOptions: PollOption[];
  pollTotalVotes: number;
  pollQuestion?: string;
  pollHref?: string;
}

const kindStyles: Record<
  CommunityHighlightItem['kind'],
  { icon: typeof Heart; className: string }
> = {
  testimony: { icon: Heart, className: 'bg-primary/10 text-primary' },
  devotional: { icon: BookOpen, className: 'bg-secondary/10 text-secondary' },
  'prayer-request': { icon: HandHeart, className: 'bg-accent/10 text-accent' },
};

export const CommunitySection = ({
  highlights,
  pollOptions,
  pollTotalVotes,
  pollQuestion,
  pollHref = '/community/polls-and-voting',
}: CommunitySectionProps) => {
  const user = useAuthStore(state => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <section id="community" className="py-16 md:py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="section-header">Community</h2>
              <p className="text-muted-foreground text-sm">Connect with creators</p>
            </div>
          </div>
          {user ? (
            <Button variant="secondary" className="gap-2" asChild>
              <Link href="/community">
                Visit community
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setIsLoginModalOpen(true)}>
                Join Community
                <ArrowRight className="w-4 h-4" />
              </Button>
              <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Latest content from community
            </h3>
            <div className="space-y-4">
              {highlights.length === 0 ? (
                <EmptyState
                  title="No community content yet"
                  description="Join the community to share your story, devotionals, and prayer requests."
                  icon={<Sparkles className="w-12 h-12 text-muted-foreground" />}
                  actionLabel="Visit community"
                  actionHref="/community"
                  showDefaultActions={false}
                />
              ) : (
                highlights.map((item, index) => {
                  const style = kindStyles[item.kind];
                  const Icon = style.icon;

                  return (
                    <Link key={`${item.kind}-${item._id}`} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex gap-3">
                          {item.avatar ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                              <FixedImage
                                imageContext="public"
                                src={item.avatar}
                                alt={item.author ?? item.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                'h-10 w-10 shrink-0 rounded-full flex items-center justify-center',
                                style.className
                              )}>
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={cn(
                                  'text-xs font-medium px-2 py-0.5 rounded-full',
                                  style.className
                                )}>
                                {item.badge}
                              </span>
                              {item.metaLabel && (
                                <span className="text-xs text-muted-foreground">
                                  {item.metaLabel}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-sm line-clamp-1">{item.title}</p>
                            <MultilinePreview
                              text={item.preview}
                              className="text-muted-foreground mt-1 line-clamp-2 text-sm"
                            />
                            {item.author && (
                              <p className="text-xs text-muted-foreground mt-2">— {item.author}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

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
                <EmptyState
                  title="No active poll"
                  description="Check back later for new polls, or visit the polls page to see past votes."
                  icon={<BarChart3 className="w-12 h-12 text-muted-foreground" />}
                  actionLabel="View all polls"
                  actionHref="/community/polls-and-voting"
                  showDefaultActions={false}
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
        </div>
      </div>
    </section>
  );
};
