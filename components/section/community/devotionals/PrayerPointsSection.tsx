'use client';

import { motion } from 'motion/react';
import { Heart, CheckCircle, Clock, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import { useHubViewAllLink } from '@/lib/hooks/useHubViewAllLink';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { PrayerPoint } from './DevotionalsPageClient';
import { MultilinePreview } from '@/components/general/MultilinePreview';

interface PrayerPointsSectionProps {
  prayerPoints: PrayerPoint[];
}

export const PrayerPointsSection = ({ prayerPoints }: PrayerPointsSectionProps) => {
  const viewAllLink = useHubViewAllLink('/community/devotionals');

  return (
    <SectionComp
      id="prayer-points"
      icon={Heart}
      iconColor="accent"
      heading="Prayer Points"
      subtext="Structured prayers for every need"
      viewAllLink={viewAllLink}
      contentProps={{ enableAnimation: false }}>
      {prayerPoints.length === 0 ? (
        <SectionEmptyState
          title="No prayer points yet"
          description="Structured prayers for every need will be added here."
          icon={Heart}
          actionLabel="Browse devotionals"
          actionHref="/community/devotionals"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayerPoints.map((prayer, index) => (
            <motion.div
              key={prayer._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
              <Link href={`/community/devotionals/${prayer._id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {prayer.category}
                      </Badge>
                      <Bookmark className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                      {prayer.title}
                    </h3>
                    <p className="text-sm text-primary font-medium">{prayer.verse}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {prayer.points} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {prayer.readingTime}
                  </span>
                </div>

                <MultilinePreview
                  text={prayer.excerpt}
                  className="text-sm text-muted-foreground mb-4 line-clamp-2"
                />

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/community/devotionals/${prayer._id}`}>Read Full Prayer</Link>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
