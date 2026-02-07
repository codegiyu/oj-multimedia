'use client';

import { motion } from 'framer-motion';
import { Heart, MessageSquare, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface Testimony {
  _id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

interface FeaturedTestimoniesProps {
  testimonies: Testimony[];
}

export const FeaturedTestimonies = ({ testimonies }: FeaturedTestimoniesProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Recent Testimonies</h2>
            <p className="text-muted-foreground text-sm">Stories from our community</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary" asChild>
          <Link href="/community/testimonies/featured">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonies.map((testimony, index) => (
          <motion.div
            key={testimony._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer">
            <Link href={`/community/testimonies/${testimony._id}`}>
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground mb-6 line-clamp-4">{testimony.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={testimony.avatar}
                    alt={testimony.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimony.author}</p>
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
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
