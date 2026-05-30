'use client';

import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ShareTestimonyForm } from './ShareTestimonyForm';

export const ShareTestimony = () => {
  return (
    <section
      id="share-testimony"
      className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                Share Your Testimony
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                Your story matters! Share how God has worked in your life and inspire others in the
                community.
              </p>
              <ShareTestimonyForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
