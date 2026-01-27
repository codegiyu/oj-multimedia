'use client';

import { motion } from 'framer-motion';
import { Play, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const VideoHero = () => {
  return (
    <section className="relative pt-[12.25rem] pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Video className="w-4 h-4" />
            <span className="text-sm font-medium">Discover Fresh Content</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Watch <span className="text-primary">Trending Videos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore trending videos, discover creators, and share your own creative content with a
            community that celebrates creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link href="/videos/trending">
                <Play className="w-5 h-5 fill-current" />
                Watch Trending
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="gap-2" asChild>
              <Link href="/community/promote-your-content">
                <Upload className="w-5 h-5" />
                Upload Your Video
              </Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-8 md:gap-12 mt-12 pt-8 border-t border-border/50">
            {[
              { value: '30K+', label: 'Videos' },
              { value: '8K+', label: 'Creators' },
              { value: '5M+', label: 'Views Daily' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
