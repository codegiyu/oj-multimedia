'use client';

import { motion } from 'motion/react';
import { Play, Upload, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const MusicHero = () => {
  return (
    <section className="relative pt-[12.25rem] pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Headphones className="w-4 h-4" />
            <span className="text-sm font-medium">Discover Fresh Sounds</span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Discover <span className="text-primary">Music</span> That Moves You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore trending tracks, discover new artists, and share your own music with a community
            that celebrates creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link href="/music/trending">
                <Play className="w-5 h-5 fill-current" />
                Play Trending Songs
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="gap-2" asChild>
              <Link href="/community/promote-your-content">
                <Upload className="w-5 h-5" />
                Upload Your Song
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="gap-2" asChild>
              <Link href="/community/promote-your-content">
                <Music className="w-5 h-5" />
                Submit Beats
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
              { value: '50K+', label: 'Songs' },
              { value: '12K+', label: 'Artists' },
              { value: '2M+', label: 'Plays Daily' },
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
