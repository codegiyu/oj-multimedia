'use client';

import { motion } from 'motion/react';
import { useQueryState, parseAsString } from 'nuqs';
import { Sparkles, Lightbulb, GraduationCap, Briefcase, Film, Church, Star } from 'lucide-react';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

const categoryIconById = {
  [ALL_CATEGORY_ID]: Sparkles,
  'christian-celebrity-news': Star,
  'church-announcements': Church,
  'inspirational-stories': Lightbulb,
  'scholarship-alerts': GraduationCap,
  'jobs-ngo': Briefcase,
  'christian-movie-reviews': Film,
};

export type NewsCategoriesProps = {
  categoryOptions: CategoryNavItem[];
};

export const NewsCategories = ({ categoryOptions }: NewsCategoriesProps) => {
  const [activeCategory, setActiveCategory] = useQueryState(
    'category',
    parseAsString.withDefault(ALL_CATEGORY_ID)
  );

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId === ALL_CATEGORY_ID ? null : categoryId);
  };

  return (
    <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-md z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categoryOptions.map(category => {
            const Icon = categoryIconById[category.id as keyof typeof categoryIconById] ?? Sparkles;
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
