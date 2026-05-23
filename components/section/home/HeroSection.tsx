'use client';

import { motion } from 'motion/react';
import { Play, Upload, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-[11.25rem]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Colorful gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20" />

        {/* Background image with blend */}
        <FillImage
          src="/images/hero-bg.jpg"
          alt=""
          priority
          sizes="100vw"
          className="opacity-50 mix-blend-overlay"
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <span className="badge-trending mb-4">
              <TrendingUp className="w-3 h-3" />
              Trending Now
            </span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Discover.
            <br />
            <span className="gradient-text">Create.</span>
            <br />
            Share.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
            Your platform for fresh music, creative videos, and inspiring stories. Join thousands of
            creators sharing their art with the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl" className="gap-3" asChild>
              <Link href="/music/trending">
                <Headphones className="w-5 h-5" />
                Listen to Trending Songs
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="gap-3" asChild>
              <Link href="/videos/trending">
                <Play className="w-5 h-5" />
                Watch Videos
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8">
            <Button variant="accent" size="lg" className="gap-2" asChild>
              <Link href="/community/promote-your-content">
                <Upload className="w-4 h-4" />
                Upload Your Music or Video
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50 invisible">
            <div>
              <p className="text-3xl font-display font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Active Creators</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold">1M+</p>
              <p className="text-sm text-muted-foreground">Songs & Videos</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold">5M+</p>
              <p className="text-sm text-muted-foreground">Monthly Plays</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[10%] top-1/3 hidden xl:block">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[20%] bottom-1/4 hidden xl:block">
        <div className="w-16 h-16 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30" />
      </motion.div>
    </section>
  );
};
