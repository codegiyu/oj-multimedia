'use client';

import { motion } from 'framer-motion';
import { Heart, MessageSquare, Quote } from 'lucide-react';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';

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
    <SectionComp
      icon={Heart}
      iconColor="primary"
      heading="Recent Testimonies"
      subtext="Stories from our community"
      viewAllLink="/community/testimonies/featured"
      contentProps={{ enableAnimation: false }}>
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
    </SectionComp>
  );
};
