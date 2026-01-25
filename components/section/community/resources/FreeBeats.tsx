'use client';

import { motion } from 'framer-motion';
import { Headphones, Download, ArrowRight, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Beat } from './ResourcesPageClient';

interface FreeBeatsProps {
  beats: Beat[];
}

export const FreeBeats = ({ beats }: FreeBeatsProps) => {
  return (
    <section id="free-beats" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-accent" />
          </div>
        </div>
        <h2 className="section-header mb-3">Free Beats & Loops</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Download free beats, instrumentals, and loops for your worship and music ministry
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {beats.map((beat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <Card className="card-interactive">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/10 rounded-t-xl flex items-center justify-center relative">
                  <Music className="w-16 h-16 text-accent/50" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs font-medium rounded-full">
                      {beat.genre}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{beat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {beat.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{beat.downloads} downloads</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    Download
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
