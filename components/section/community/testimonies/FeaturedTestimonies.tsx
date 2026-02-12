'use client';

import { motion } from 'framer-motion';
import { Heart, MessageSquare, Quote, Star } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SectionComp } from '@/components/general/SectionComp';
import type { Testimony } from './TestimoniesPageClient';

interface FeaturedTestimoniesProps {
  testimonies: Testimony[];
}

export const FeaturedTestimonies = ({ testimonies }: FeaturedTestimoniesProps) => {
  return (
    <SectionComp
      id="featured-testimonies"
      icon={Star}
      iconColor="primary"
      heading="Featured Testimonies"
      subtext="Inspiring stories of God's faithfulness and transformation in the lives of believers"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonies.map((testimony, index) => (
          <motion.div
            key={testimony._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}>
            <Link href={`/community/testimonies/${testimony._id}`}>
              <Card className="card-interactive h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Quote className="w-8 h-8 text-primary/20 shrink-0" />
                    {testimony.category && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {testimony.category}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6 line-clamp-5">{testimony.content}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimony.avatar}
                        alt={testimony.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{testimony.author}</p>
                        <p className="text-xs text-muted-foreground">{testimony.timeAgo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {testimony.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {testimony.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
