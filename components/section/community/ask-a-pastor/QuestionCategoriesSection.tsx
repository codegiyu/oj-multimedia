'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, TrendingUp, DollarSign, BookOpen, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuestionCategory } from './AskAPastorPageClient';

interface QuestionCategoriesSectionProps {
  categories: QuestionCategory[];
}

const categoryIcons: Record<string, typeof Sparkles> = {
  Faith: Sparkles,
  Relationships: Users,
  'Spiritual Growth': TrendingUp,
  Finance: DollarSign,
  'Bible Study': BookOpen,
  Prayer: Heart,
  Default: BookOpen,
};

const categoryColors: Record<string, string> = {
  Faith: 'from-amber-500 to-orange-500',
  Relationships: 'from-blue-500 to-cyan-500',
  'Spiritual Growth': 'from-purple-500 to-violet-500',
  Finance: 'from-green-500 to-emerald-500',
  'Bible Study': 'from-indigo-500 to-blue-500',
  Prayer: 'from-rose-500 to-pink-500',
  Default: 'from-primary to-secondary',
};

export const QuestionCategoriesSection = ({ categories }: QuestionCategoriesSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Browse by Category</h2>
            <p className="text-muted-foreground text-sm">Find questions and answers by topic</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary" asChild>
          <Link href="/community/ask-a-pastor">
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.name] || categoryIcons.Default;
          const colorClass = categoryColors[category.name] || categoryColors.Default;

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group p-0">
              <Link
                href={`/community/ask-a-pastor/active?category=${encodeURIComponent(category.name.toLowerCase().replace(' ', '-'))}`}>
                <div className="px-6 py-8 text-center relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} questions
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
