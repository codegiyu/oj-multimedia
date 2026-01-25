'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AnsweredPrayer } from './PrayerRequestsPageClient';

interface AnsweredPrayersSectionProps {
  prayers: AnsweredPrayer[];
}

export const AnsweredPrayersSection = ({ prayers }: AnsweredPrayersSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="section-header">Answered Prayers</h2>
            <p className="text-muted-foreground text-sm">
              Praise reports and testimonies of God's faithfulness
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-secondary">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayers.map((prayer, index) => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500 text-white">Answered</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{prayer.title}</h3>
                <p className="text-xs text-muted-foreground">{prayer.answeredDate}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 italic line-clamp-2">
                Original: {prayer.originalRequest}
              </p>
              <p className="text-sm text-foreground line-clamp-4">{prayer.testimony}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">— {prayer.author}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="w-3 h-3" />
                {prayer.prayers} prayers
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
