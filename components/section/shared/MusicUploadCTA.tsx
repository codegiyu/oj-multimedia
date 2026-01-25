'use client';

import { motion } from 'framer-motion';
import { Upload, Music, Mic, DollarSign, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: Upload, title: 'Easy Upload', description: 'Drag & drop your tracks' },
  { icon: BarChart3, title: 'Analytics', description: 'Track your performance' },
  { icon: Users, title: 'Reach', description: 'Connect with listeners' },
  { icon: DollarSign, title: 'Monetize', description: 'Earn from your music' },
];

export const MusicUploadCTA = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">For Creators</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-display font-bold mb-4">
                Share Your <span className="text-primary">Music</span> With The World
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-6 max-w-md">
                Upload your tracks, reach new listeners, and grow your audience. Join thousands of
                artists sharing their creativity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" className="gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your Song
                </Button>
                <Button variant="hero-outline" size="lg" className="gap-2">
                  <Mic className="w-5 h-5" />
                  Submit Beats
                </Button>
              </motion.div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="relative z-10 text-center text-sm text-muted-foreground mt-8">
            Free to upload • Instant publishing • Keep your rights • Analytics included
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
