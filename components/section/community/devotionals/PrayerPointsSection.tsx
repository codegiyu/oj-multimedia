'use client';

import { motion } from 'framer-motion';
import { Heart, CheckCircle, Clock, ArrowRight, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PrayerPoint } from './DevotionalsPageClient';

interface PrayerPointsSectionProps {
  prayerPoints: PrayerPoint[];
}

export const PrayerPointsSection = ({ prayerPoints }: PrayerPointsSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="section-header">Prayer Points</h2>
            <p className="text-muted-foreground text-sm">Structured prayers for every need</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-accent" asChild>
          <Link href="/community/devotionals">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

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

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{prayer.excerpt}</p>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/community/devotionals/${prayer._id}`}>Read Full Prayer</Link>
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
