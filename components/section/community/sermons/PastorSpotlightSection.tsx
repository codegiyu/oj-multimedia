'use client';

import { motion } from 'framer-motion';
import { Users, Mic, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Pastor } from './SermonsPageClient';

interface PastorSpotlightSectionProps {
  pastors: Pastor[];
}

export const PastorSpotlightSection = ({ pastors }: PastorSpotlightSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="section-header">Pastor Spotlight</h2>
            <p className="text-muted-foreground text-sm">
              Follow your favorite speakers and pastors
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-secondary">
          View All Pastors
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastors.map((pastor, index) => (
          <motion.div
            key={pastor.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="p-6 text-center">
              <div className="relative mb-4 inline-block">
                <img
                  src={pastor.image}
                  alt={pastor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-secondary/20 group-hover:ring-secondary/40 transition-all"
                />
                {pastor.featured && (
                  <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">
                {pastor.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{pastor.title}</p>
              <p className="text-xs text-muted-foreground mb-3">{pastor.church}</p>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {pastor.topics.map(topic => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  {pastor.sermons}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {pastor.followers}
                </span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Follow
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
