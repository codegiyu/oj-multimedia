'use client';

import { motion } from 'motion/react';
import { Users, Star, MessageSquare, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionComp } from '@/components/general/SectionComp';
import type { AvailablePastor } from './AskAPastorPageClient';
import { Button } from '@/components/ui/button';
import { FixedImage } from '@/components/general/FillImage';

interface AvailablePastorsSectionProps {
  pastors: AvailablePastor[];
}

export const AvailablePastorsSection = ({ pastors }: AvailablePastorsSectionProps) => {
  return (
    <SectionComp
      id="available-pastors"
      icon={Users}
      iconColor="accent"
      heading="Available Pastors"
      subtext="Experienced pastors ready to answer your questions"
      viewAllLink="/community/ask-a-pastor"
      viewAllLabel="View All Pastors"
      contentProps={{ enableAnimation: false }}>
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
                <FixedImage
                  src={pastor.image}
                  alt={pastor.name}
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-accent/20 transition-all group-hover:ring-accent/40"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                {pastor.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{pastor.title}</p>
              <p className="text-xs text-muted-foreground mb-3">{pastor.church}</p>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {pastor.expertise.slice(0, 2).map(expertise => (
                  <Badge key={`${pastor._id}-${expertise}`} variant="secondary" className="text-xs">
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
    </SectionComp>
  );
};
