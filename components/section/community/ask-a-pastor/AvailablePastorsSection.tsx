'use client';

import { motion } from 'framer-motion';
import { Users, Star, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AvailablePastor } from './AskAPastorPageClient';

interface AvailablePastorsSectionProps {
  pastors: AvailablePastor[];
}

export const AvailablePastorsSection = ({ pastors }: AvailablePastorsSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="section-header">Available Pastors</h2>
            <p className="text-muted-foreground text-sm">
              Experienced pastors ready to answer your questions
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-accent" asChild>
          <Link href="/community/ask-a-pastor">
            View All Pastors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastors.map((pastor, index) => (
          <motion.div
            key={pastor._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all">
            <div className="p-6 text-center">
              <div className="relative mb-4 inline-block">
                <img
                  src={pastor.image}
                  alt={pastor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-accent/20 group-hover:ring-accent/40 transition-all"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                {pastor.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{pastor.title}</p>
              <p className="text-xs text-muted-foreground mb-3">{pastor.church}</p>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {pastor.expertise.slice(0, 2).map(expertise => (
                  <Badge key={expertise} variant="secondary" className="text-xs">
                    {expertise}
                  </Badge>
                ))}
                {pastor.expertise.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{pastor.expertise.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {pastor.questionsAnswered} answered
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {pastor.rating}
                </span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Ask Question
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
