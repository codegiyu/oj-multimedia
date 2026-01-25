'use client';

import { motion } from 'framer-motion';
import { HandHeart, Heart, MessageCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PrayerRequest } from './PrayerRequestsPageClient';

interface ActivePrayerRequestsSectionProps {
  requests: PrayerRequest[];
}

export const ActivePrayerRequestsSection = ({ requests }: ActivePrayerRequestsSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <HandHeart className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="section-header">Active Prayer Requests</h2>
            <p className="text-muted-foreground text-sm">Join us in lifting these needs to God</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-accent">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {request.urgent && (
                    <Badge className="bg-red-500 text-white flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Urgent
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {request.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  {request.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{request.content}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {request.timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {request.prayers} prayers
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {request.comments} comments
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">— {request.author}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="gap-1">
                  <Heart className="w-4 h-4" />
                  Pray
                </Button>
                <Button size="sm" variant="ghost" className="gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
