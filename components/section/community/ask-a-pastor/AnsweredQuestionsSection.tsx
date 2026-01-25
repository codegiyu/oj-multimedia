'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ThumbsUp, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AnsweredQuestion } from './AskAPastorPageClient';

interface AnsweredQuestionsSectionProps {
  questions: AnsweredQuestion[];
}

export const AnsweredQuestionsSection = ({ questions }: AnsweredQuestionsSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="section-header">Answered Questions</h2>
            <p className="text-muted-foreground text-sm">Biblical guidance from our pastors</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2 text-secondary">
          View All Answers
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
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                  <Badge className="bg-green-500 text-white text-xs">Answered</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Answered {question.answeredDate}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{question.pastor}</span>
              </div>
              <p className="text-sm text-foreground line-clamp-4">{question.answer}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="w-3 h-3" />
                {question.helpful} found this helpful
              </div>
              <Button size="sm" variant="ghost" className="gap-1">
                Read Full Answer
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
