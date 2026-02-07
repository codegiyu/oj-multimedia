'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Baby, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MarriageFamily } from './DevotionalsPageClient';

interface MarriageAndFamilySectionProps {
  content: MarriageFamily[];
}

const categoryIcons: Record<string, typeof Heart> = {
  Marriage: Heart,
  Parenting: Baby,
  Family: Home,
  Default: Users,
};

export const MarriageAndFamilySection = ({ content }: MarriageAndFamilySectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="section-header">Marriage & Family</h2>
            <p className="text-muted-foreground text-sm">Guidance for strong Christian families</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-secondary" asChild>
          <Link href="/community/devotionals">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item, index) => {
          const Icon = categoryIcons[item.category] || categoryIcons.Default;
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
              <Link href={`/community/devotionals/${item._id}`}>
                <div className="relative aspect-[1.75] overflow-hidden bg-gradient-to-br from-secondary/20 to-accent/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.articles} articles available
                    </span>
                    <Button variant="ghost" size="sm" className="group/btn" asChild>
                      <Link href={`/community/devotionals/${item._id}`}>
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
