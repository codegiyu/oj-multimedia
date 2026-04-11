'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Video, BarChart3, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const benefits = [
  { icon: MessageCircle, title: 'Simple process', description: 'Message our team with your files' },
  { icon: BarChart3, title: 'Analytics', description: 'Track your performance' },
  { icon: Users, title: 'Reach', description: 'Connect with viewers' },
  { icon: Share2, title: 'Share', description: 'Spread your creativity' },
];

export const VideoUploadCTA = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-primary/5 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">For Creators</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-display font-bold mb-4">
                Share Your <span className="text-primary">Videos</span> With The World
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-6 max-w-md">
                Our admins publish approved content. Use the contact page—or WhatsApp when it is
                listed there—to submit videos and details. We will guide you through the process.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <Link href="/contact">
                    <MessageCircle className="w-5 h-5" />
                    Contact to submit video
                  </Link>
                </Button>
                <Button variant="hero-outline" size="lg" className="gap-2" asChild>
                  <Link href="/community/promote-your-content">
                    <Share2 className="w-5 h-5" />
                    Promote your content
                  </Link>
                </Button>
              </motion.div>
            </div>

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

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="relative z-10 text-center text-sm text-muted-foreground mt-8">
            Admin-reviewed publishing • You keep your rights • Promotional options available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
