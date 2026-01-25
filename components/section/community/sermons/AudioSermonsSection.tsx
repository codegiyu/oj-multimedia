'use client';

import { motion } from 'framer-motion';
import { Headphones, Play, Download, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AudioSermon } from './SermonsPageClient';

interface AudioSermonsSectionProps {
  sermons: AudioSermon[];
}

export const AudioSermonsSection = ({ sermons }: AudioSermonsSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="section-header">Audio Sermons</h2>
            <p className="text-muted-foreground text-sm">
              Listen to powerful messages anytime, anywhere
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-secondary">
          View All Audio
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.map((sermon, index) => (
          <motion.div
            key={sermon.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <img
                  src={sermon.image}
                  alt={sermon.pastor}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                  <Button size="icon" variant="play" className="w-10 h-10 rounded-full">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-secondary transition-colors mb-1">
                  {sermon.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{sermon.pastor}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sermon.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    {sermon.plays}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{sermon.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8">
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
