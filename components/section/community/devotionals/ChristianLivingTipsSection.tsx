'use client';

import { motion } from 'motion/react';
import { Lightbulb, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import type { LivingTip } from './DevotionalsPageClient';
import { MultilinePreview } from '@/components/general/MultilinePreview';

interface ChristianLivingTipsSectionProps {
  tips: LivingTip[];
}

export const ChristianLivingTipsSection = ({ tips }: ChristianLivingTipsSectionProps) => {
  return (
    <SectionComp
      icon={Lightbulb}
      iconColor="primary"
      heading="Christian Living Tips"
      subtext="Practical wisdom for daily life"
      viewAllLink="/community/devotionals"
      viewAllLabel="View All Tips"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <motion.div
            key={tip._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <Link href={`/community/devotionals/${tip._id}`}>
              <div className="relative aspect-[1.75] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {tip.category}
                  </Badge>
                </div>
                {tip.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-500 text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-white text-lg">{tip.title}</h3>
                </div>
              </div>

              <div className="p-5">
                <MultilinePreview
                  text={tip.excerpt}
                  className="text-sm text-muted-foreground mb-4 line-clamp-3"
                />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {tip.views} views
                  </span>
                  <Button variant="ghost" size="sm" className="group/btn" asChild>
                    <Link href={`/community/devotionals/${tip._id}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
