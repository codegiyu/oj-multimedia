'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Eye, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import type { Question } from './AskAPastorPageClient';

interface ActiveQuestionsSectionProps {
  questions: Question[];
}

export const ActiveQuestionsSection = ({ questions }: ActiveQuestionsSectionProps) => {
  const [displayedItems, setDisplayedItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 6, questions.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < questions.length;
  const itemsToShow = questions.slice(0, displayedItems);

  return (
    <SectionComp
      icon={HelpCircle}
      iconColor="primary"
      heading="Active Questions"
      subtext="Questions awaiting answers from our pastors"
      viewAllLink="/community/ask-a-pastor/active"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 gap-6">
        {itemsToShow.map((question, index) => (
          <motion.div
            key={question._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all">
            <Link href={`/community/ask-a-pastor/${question._id}`}>
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
                <Button size="sm" variant="ghost" className="gap-1" asChild>
                  <Link href={`/community/ask-a-pastor/${question._id}`}>
                    <MessageSquare className="w-4 h-4" />
                    View Answers
                  </Link>
                </Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && itemsToShow.length > 0 && (
        <div className="flex justify-center mt-10">
          <motion.button
            onClick={loadMoreItems}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="px-8 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Load More Questions
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </SectionComp>
  );
};
