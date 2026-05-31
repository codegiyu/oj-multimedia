'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import type { PrayerRequestItem } from '@/lib/constants/community/prayer-requests';

interface RelatedPrayerRequestsGridProps {
  requests: PrayerRequestItem[];
}

export function RelatedPrayerRequestsGrid({ requests }: RelatedPrayerRequestsGridProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-muted/30">
      <h2 className="text-2xl font-display font-bold mb-6">Related Prayer Requests</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {requests.map((related, index) => (
          <motion.div
            key={related._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Link
              href={`/community/prayer-requests/${related._id}`}
              className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{related.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{related.author}</span>
                <span>{related.prayers} praying</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
