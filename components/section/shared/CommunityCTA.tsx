'use client';

import { motion } from 'motion/react';
import { Heart, MessageCircle, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOptionalCommunityActionModals } from '@/components/section/community/shared/CommunityActionModalsProvider';

export const CommunityCTA = () => {
  const modals = useOptionalCommunityActionModals();

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10 py-16 px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-secondary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4">
            Your Voice <span className="gradient-text">Matters</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-lg mx-auto mb-8">
            Share your story, ask questions, or simply be part of a community that cares. Every
            testimony, every prayer, every conversation makes a difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4">
            <Button
              variant="hero"
              size="lg"
              className="gap-2"
              onClick={() => modals?.openShareTestimony()}>
              <Heart className="w-4 h-4" />
              Share Your Testimony
            </Button>
            <Button
              variant="hero-outline"
              size="lg"
              className="gap-2"
              onClick={() => modals?.openSubmitPrayerRequest()}>
              <Send className="w-4 h-4" />
              Submit Prayer Request
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
