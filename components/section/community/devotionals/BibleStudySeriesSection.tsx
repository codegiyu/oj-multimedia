'use client';

import { motion } from 'motion/react';
import { BookOpen, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { BibleStudy } from './DevotionalsPageClient';
import type { BrowsePresentation, Pagination } from '@/lib/types/pagination';

interface BibleStudySeriesSectionProps {
  series: BibleStudy[];
  presentation?: BrowsePresentation;
  pagination?: Pagination | null;
}

const BIBLE_STUDY_GRID_CLASS = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';

function BibleStudyCards({ series }: { series: BibleStudy[] }) {
  return (
    <>
      {series.map((study, index) => (
        <motion.div
          key={study._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
          <Link href={`/community/devotionals/${study._id}`}>
            <div className="relative aspect-[1.75] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      study.status === 'Ongoing'
                        ? 'default'
                        : study.status === 'Upcoming'
                          ? 'secondary'
                          : 'outline'
                    }
                    className={
                      study.status === 'Ongoing'
                        ? 'bg-green-500 hover:bg-green-600'
                        : study.status === 'Upcoming'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                    }>
                    {study.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{study.title}</h3>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{study.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {study.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {study.duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {study.participants} participants
                </span>
                <Button size="sm" variant="default">
                  Join Study
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  );
}

export const BibleStudySeriesSection = ({
  series,
  presentation = 'hub-section',
  pagination = null,
}: BibleStudySeriesSectionProps) => {
  const isBrowseList = presentation === 'browse-list';

  if (series.length === 0) {
    return (
      <div className={isBrowseList ? undefined : undefined}>
        <SectionEmptyState
          title="No Bible study series yet"
          description="In-depth study series will be listed here when available."
          icon={BookOpen}
          actionLabel="View all series"
          actionHref="/community/devotionals/bible-study"
        />
      </div>
    );
  }

  if (isBrowseList) {
    return (
      <ContentBrowseList pagination={pagination} gridClassName={BIBLE_STUDY_GRID_CLASS}>
        <BibleStudyCards series={series} />
      </ContentBrowseList>
    );
  }

  return (
    <SectionComp
      id="bible-study-series"
      icon={BookOpen}
      iconColor="primary"
      heading="Bible Study Series"
      subtext="Deep dive into God's word"
      viewAllLink="/community/devotionals/bible-study"
      viewAllLabel="View All Series"
      contentProps={{ enableAnimation: false }}>
      <div className={BIBLE_STUDY_GRID_CLASS}>
        <BibleStudyCards series={series} />
      </div>
    </SectionComp>
  );
};
