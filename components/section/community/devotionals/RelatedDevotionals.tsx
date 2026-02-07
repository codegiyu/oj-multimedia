'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { DevotionalItem } from '@/lib/constants/community/devotionals';

interface RelatedDevotionalsProps {
  devotionals: DevotionalItem[];
}

export const RelatedDevotionals = ({ devotionals }: RelatedDevotionalsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Related Devotionals</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {devotionals.map((devotional, index) => (
          <motion.div
            key={devotional._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Link
              href={`/community/devotionals/${devotional._id}`}
              className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2 line-clamp-2">{devotional.title}</h3>
              {devotional.excerpt && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {devotional.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{devotional.category}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
