'use client';

import { motion } from 'motion/react';
import { BarChart3, Vote, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { ContentAllBrowseStatusFilter } from '@/components/general/ContentAllBrowseStatusFilter';
import { MultilinePreview } from '@/components/general/MultilinePreview';
import type { Poll } from './PollsPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

const POLLS_GRID_CLASS = 'grid md:grid-cols-2 gap-6';

interface AllPollsPageClientProps {
  config: AllBrowseConfig;
  polls: Poll[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllPollsPageClient({
  config,
  polls,
  pagination = null,
  initialErrorMessage = null,
}: AllPollsPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={polls}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load polls"
      errorIcon={<BarChart3 className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No polls found',
        description: 'Try adjusting your search, sort, or status filters, or check back later.',
        icon: BarChart3,
        actionLabel: 'Back to Polls',
        actionHref: '/community/polls-and-voting',
      }}
      gridClassName={POLLS_GRID_CLASS}
      listId="all-polls"
      toolbarChildren={<ContentAllBrowseStatusFilter config={config} />}
      emptyInGrid
      renderItem={(poll, index) => (
        <motion.div
          key={poll._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}>
          <Card className="card-interactive h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-primary" />
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                    {poll.status}
                  </span>
                </div>
                {poll.endDate ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Ends {poll.endDate}</span>
                  </div>
                ) : null}
              </div>

              <h3 className="font-bold text-foreground mb-1">{poll.question}</h3>
              {poll.creatorLabel ? (
                <p className="text-xs text-muted-foreground mb-2">By {poll.creatorLabel}</p>
              ) : null}
              {poll.description ? (
                <MultilinePreview
                  text={poll.description}
                  className="text-sm text-muted-foreground mb-6 line-clamp-3"
                />
              ) : null}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>{poll.totalVotes} total votes</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/community/polls-and-voting/${poll._id}`}>
                    {poll.status === 'closed' ? 'View Results' : 'Vote Now'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    />
  );
}
