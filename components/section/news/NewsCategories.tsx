'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';
import { Sparkles, Lightbulb, GraduationCap, Briefcase, Film, Church, Star } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Stories', icon: Sparkles },
  { id: 'christian-celebrity-news', label: 'Christian Celebrity News', icon: Star },
  { id: 'church-announcements', label: 'Church & Ministry Announcements', icon: Church },
  { id: 'inspirational-stories', label: 'Inspirational Stories', icon: Lightbulb },
  { id: 'scholarship-alerts', label: 'Scholarship Alerts', icon: GraduationCap },
  { id: 'jobs-ngo', label: 'Jobs (NGO / Faith-based)', icon: Briefcase },
  { id: 'christian-movie-reviews', label: 'Christian Movie Reviews', icon: Film },
];

export const NewsCategories = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory] = useQueryState('category', parseAsString.withDefault('all'));

  const handleCategoryChange = (categoryId: string) => {
    // Use router.push to trigger server-side re-render with new searchParams
    // nuqs will automatically sync from the URL change
    const newUrl = categoryId === 'all' ? pathname : `${pathname}?category=${categoryId}`;
    router.push(newUrl, { scroll: false });
  };

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
                onClick={() => handleCategoryChange(category.id)}
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
