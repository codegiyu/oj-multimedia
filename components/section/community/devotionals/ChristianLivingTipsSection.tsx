'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LivingTip } from './DevotionalsPageClient';

interface ChristianLivingTipsSectionProps {
  tips: LivingTip[];
}

export const ChristianLivingTipsSection = ({ tips }: ChristianLivingTipsSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Christian Living Tips</h2>
            <p className="text-muted-foreground text-sm">Practical wisdom for daily life</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary">
          View All Tips
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
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
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{tip.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {tip.views} views
                </span>
                <Button variant="ghost" size="sm" className="group/btn">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
