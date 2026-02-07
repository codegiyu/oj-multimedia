'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BibleStudy } from './DevotionalsPageClient';

interface BibleStudySeriesSectionProps {
  series: BibleStudy[];
}

export const BibleStudySeriesSection = ({ series }: BibleStudySeriesSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Bible Study Series</h2>
            <p className="text-muted-foreground text-sm">Deep dive into God's word</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary" asChild>
          <Link href="/community/devotionals/bible-study">
            View All Series
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {study.description}
                </p>
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
      </div>
    </section>
  );
};
