'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Video,
  Heart,
  HandHeart,
  HelpCircle,
  BarChart3,
  FolderOpen,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import { CategoryCard } from '@/components/cards/CommunityCategoryCard';
import { FeaturedTestimonies, type Testimony } from './FeaturedTestimonies';
import { TrendingDevotionals, type Devotional } from './TrendingDevotionals';
import { ActiveDiscussions, type Discussion } from './ActiveDiscussions';
import { CommunityCTA } from '../shared';

export interface CommunityCategory {
  icon: string;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  count: number;
  href: string;
}

// Icon map to convert string identifiers to actual icon components
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Video,
  Heart,
  HandHeart,
  HelpCircle,
  BarChart3,
  FolderOpen,
  Megaphone,
};

// Static category definitions - hardcoded on the client side
// Each category has a key that matches the server's categoryCounts keys
const categoryDefinitions: Array<Omit<CommunityCategory, 'count'> & { key: string }> = [
  {
    key: 'devotionals',
    icon: 'BookOpen',
    title: 'Devotionals',
    description: 'Daily inspiration and reflections for your journey',
    color: 'secondary',
    href: '/community/devotionals',
  },
  {
    key: 'testimonies',
    icon: 'Heart',
    title: 'Testimonies',
    description: 'Real stories of hope, transformation and breakthrough',
    color: 'primary',
    href: '/community/testimonies',
  },
  {
    key: 'prayerRequests',
    icon: 'HandHeart',
    title: 'Prayer Requests',
    description: 'Share your needs and pray for others in the community',
    color: 'accent',
    href: '/community/prayer-requests',
  },
  {
    key: 'askAPastor',
    icon: 'HelpCircle',
    title: 'Ask a Pastor',
    description: 'Get guidance and answers to your questions',
    color: 'secondary',
    href: '/community/ask-a-pastor',
  },
  {
    key: 'polls',
    icon: 'BarChart3',
    title: 'Polls & Voting',
    description: 'Share your opinion and see what the community thinks',
    color: 'accent',
    href: '/community/polls-and-voting',
  },
  {
    key: 'resources',
    icon: 'FolderOpen',
    title: 'Resources',
    description: 'Free downloads, templates, beats, and more',
    color: 'primary',
    href: '/community/resources',
  },
  {
    key: 'promoteYourContent',
    icon: 'Megaphone',
    title: 'Promote Your Content',
    description: 'Get your content featured and reach a wider audience',
    color: 'secondary',
    href: '/community/promote-your-content',
  },
];

interface CommunityPageClientProps {
  categoryCounts: Record<string, number>;
  testimonies: Testimony[];
  devotionals: Devotional[];
  discussions: Discussion[];
}

export const CommunityPageClient = ({
  categoryCounts,
  testimonies,
  devotionals,
  discussions,
}: CommunityPageClientProps) => {
  // Merge static category definitions with dynamic counts from server
  const categories: CommunityCategory[] = categoryDefinitions.map(def => ({
    icon: def.icon,
    title: def.title,
    description: def.description,
    color: def.color,
    count: categoryCounts[def.key] ?? 0,
    href: def.href,
  }));

  return (
    <section className="container mx-auto px-4 pb-16">
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Explore the Community
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find what speaks to you — from daily inspiration to open discussions
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            if (!IconComponent) {
              console.warn(`Icon "${category.icon}" not found in iconMap`);
              return null;
            }
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}>
                <CategoryCard {...category} icon={IconComponent} />
              </motion.div>
            );
          })}
        </div>
      </section>

      <FeaturedTestimonies testimonies={testimonies} />

      <TrendingDevotionals devotionals={devotionals} />

      <ActiveDiscussions discussions={discussions} />

      <CommunityCTA />
    </section>
  );
};
