'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Eye, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Question } from './AskAPastorPageClient';

interface ActiveQuestionsSectionProps {
  questions: Question[];
}

export const ActiveQuestionsSection = ({ questions }: ActiveQuestionsSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="section-header">Active Questions</h2>
            <p className="text-muted-foreground text-sm">
              Questions awaiting answers from our pastors
            </p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-primary">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {question.question}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {question.timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {question.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {question.answers} answers
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">— {question.author}</span>
              <Button size="sm" variant="ghost" className="gap-1">
                <MessageSquare className="w-4 h-4" />
                View Answers
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
