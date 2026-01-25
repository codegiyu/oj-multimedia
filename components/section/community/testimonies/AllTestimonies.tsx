'use client';

import { motion } from 'framer-motion';
import { Heart, MessageSquare, Quote, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Testimony } from './TestimoniesPageClient';

interface AllTestimoniesProps {
  testimonies: Testimony[];
}

const categories = [
  'All',
  'Healing',
  'Purpose',
  'Prayer',
  'Marriage',
  'Provision',
  'Deliverance',
  'Salvation',
  'Blessing',
];

export const AllTestimonies = ({ testimonies }: AllTestimoniesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTestimonies =
    selectedCategory === 'All'
      ? testimonies
      : testimonies.filter(t => t.category === selectedCategory);

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Quote className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <h2 className="section-header mb-3">All Testimonies</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Browse through all testimonies and be inspired by stories of God's goodness
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Testimonies Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonies.map((testimony, index) => (
          <motion.div
            key={testimony.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}>
            <Card className="card-interactive h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-6 h-6 text-primary/20 shrink-0" />
                  {testimony.category && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {testimony.category}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-6 line-clamp-4">{testimony.content}</p>

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
          </motion.div>
        ))}
      </div>

      {filteredTestimonies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonies found in this category.</p>
        </div>
      )}
    </section>
  );
};
