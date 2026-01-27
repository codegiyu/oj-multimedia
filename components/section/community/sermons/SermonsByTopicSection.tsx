'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Sparkles,
  Target,
  Shield,
  BookOpen,
  Flame,
  Crown,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SermonTopic } from './SermonsPageClient';

interface SermonsByTopicSectionProps {
  topics: SermonTopic[];
}

const topicIcons: Record<string, typeof Heart> = {
  Faith: Sparkles,
  Family: Users,
  Healing: Heart,
  Purpose: Target,
  Leadership: Crown,
  Protection: Shield,
  'Word Study': BookOpen,
  Revival: Flame,
  Default: BookOpen,
};

const topicColors: Record<string, string> = {
  Faith: 'from-amber-500 to-orange-500',
  Family: 'from-teal-500 to-emerald-500',
  Healing: 'from-rose-500 to-pink-500',
  Purpose: 'from-violet-500 to-purple-500',
  Leadership: 'from-blue-500 to-indigo-500',
  Protection: 'from-slate-500 to-gray-600',
  'Word Study': 'from-cyan-500 to-teal-500',
  Revival: 'from-orange-500 to-red-500',
  Default: 'from-primary to-secondary',
};

export const SermonsByTopicSection = ({ topics }: SermonsByTopicSectionProps) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Sermons by Topic</h2>
            <p className="text-muted-foreground text-sm">
              Find sermons that speak to your current season
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary" asChild>
          <Link href="/community/sermons">
            View All Topics
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topics.map((topic, index) => {
          const Icon = topicIcons[topic.name] || topicIcons.Default;
          const colorClass = topicColors[topic.name] || topicColors.Default;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group p-0">
              <Link href={`/community/sermons?topic=${encodeURIComponent(topic.name)}`}>
                <div className="px-6 py-8 text-center relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{topic.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {topic.count} sermons
                  </Badge>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
