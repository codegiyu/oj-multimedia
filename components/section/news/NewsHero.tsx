'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const NewsHero = () => {
  return (
    <section className="relative pt-[10.25rem] md:pt-[12.25rem] pb-16 md:pb-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Fresh stories daily</span>
          </div> */}

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            {"What's "}
            <span className="text-primary">Trending</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            News, culture, and inspiration. Stories worth your time, curated for the curious mind.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Updated hourly</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>50+ stories this week</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
