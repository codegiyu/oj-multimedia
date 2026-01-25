'use client';

import { motion } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';
import {
  Sparkles,
  Music,
  Heart,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Film,
  Tv,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Stories', icon: Sparkles },
  { id: 'entertainment', label: 'Entertainment', icon: Tv },
  { id: 'music', label: 'Music & Culture', icon: Music },
  { id: 'lifestyle', label: 'Lifestyle', icon: Heart },
  { id: 'inspiration', label: 'Inspiration', icon: Lightbulb },
  { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
  { id: 'jobs', label: 'Jobs & Careers', icon: Briefcase },
  { id: 'movies', label: 'Movies & Reviews', icon: Film },
];

export const NewsCategories = () => {
  const [activeCategory, setActiveCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  return (
    <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-md z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                  whitespace-nowrap transition-all duration-300
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }
                `}>
                <Icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
