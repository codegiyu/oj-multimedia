'use client';

import { motion } from 'framer-motion';
import { BarChart3, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const CreatePoll = () => {
  return (
    <section
      id="create-poll"
      className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Create a Poll</h3>
              <p className="text-muted-foreground mb-6">
                Have a question for the community? Create a poll and gather opinions from fellow
                believers. Your poll will help shape discussions and decisions in our community.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="accent" size="lg" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Poll
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/community">Back to Community</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
