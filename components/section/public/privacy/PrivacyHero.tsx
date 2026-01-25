'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';

export const PrivacyHero = () => {
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden pt-[12.25rem] pb-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-primary/10 to-secondary/15" />

        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4">
            <span className="badge-trending">
              <Shield className="w-3 h-3" />
              Your Privacy Matters
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
            Privacy <span className="gradient-text">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Learn how we collect, use, store, and protect your information when you use our
            platform.
          </motion.p>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[8%] top-1/3 hidden lg:block">
        <div className="w-14 h-14 rounded-2xl bg-accent/20 backdrop-blur-md border border-accent/30 flex items-center justify-center">
          <Lock className="w-6 h-6 text-accent" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[8%] bottom-1/3 hidden lg:block">
        <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center">
          <Eye className="w-5 h-5 text-primary" />
        </div>
      </motion.div>
    </section>
  );
};
