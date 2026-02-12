'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';

export interface Devotional {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  views: number;
  category: string;
}

interface TrendingDevotionalsProps {
  devotionals: Devotional[];
}

export const TrendingDevotionals = ({ devotionals }: TrendingDevotionalsProps) => {
  return (
    <SectionComp
      icon={BookOpen}
      iconColor="secondary"
      heading="Popular Devotionals"
      subtext="Daily inspiration for your journey"
      viewAllLink="/community/devotionals/popular"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 gap-4">
        {devotionals.map((devotional, index) => (
          <motion.div
            key={devotional._id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <Link href={`/community/devotionals/${devotional._id}`}>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7 text-secondary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs text-secondary font-medium">
                        {devotional.category}
                      </span>
                      <h3 className="font-semibold group-hover:text-secondary transition-colors line-clamp-1">
                        {devotional.title}
                      </h3>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                      <Bookmark className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {devotional.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{devotional.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {devotional.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {devotional.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
