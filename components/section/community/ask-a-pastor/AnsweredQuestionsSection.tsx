'use client';

import { motion } from 'motion/react';
import { CheckCircle2, ThumbsUp, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import type { AnsweredQuestion } from './AskAPastorPageClient';
import { QuestionVoteButtons } from './QuestionVoteButtons';
import { MultilinePreview } from '@/components/general/MultilinePreview';

interface AnsweredQuestionsSectionProps {
  questions: AnsweredQuestion[];
}

export const AnsweredQuestionsSection = ({ questions }: AnsweredQuestionsSectionProps) => {
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
      id="answered-questions"
      icon={CheckCircle2}
      iconColor="secondary"
      heading="Answered Questions"
      subtext="Biblical guidance from our pastors"
      viewAllLink="/community/ask-a-pastor/answered"
      viewAllLabel="View All Answers"
      contentProps={{ enableAnimation: false }}>
      {questions.length === 0 ? (
        <SectionEmptyState
          title="No answered questions yet"
          description="Pastoral answers and biblical guidance will be shared here."
          icon={CheckCircle2}
          actionLabel="Ask a question"
          actionHref="/community/ask-a-pastor#submit-question"
        />
      ) : (
        <>
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
                <Link href={`/community/ask-a-pastor/${question.slug ?? question._id}`}>
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
                    <MultilinePreview
                      text={question.answer}
                      className="text-sm text-foreground line-clamp-4"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {question.helpful} found this helpful
                      </span>
                      {(question.answersCount ?? 0) > 1 ? (
                        <span>{question.answersCount} answers</span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3" onClick={e => e.preventDefault()}>
                      <QuestionVoteButtons
                        questionId={question.slug ?? question._id}
                        initialUpvotes={question.upvotes ?? 0}
                        initialDownvotes={question.downvotes ?? 0}
                      />
                      <span className="inline-flex items-center gap-1 text-sm text-primary">
                        Read Full Answer
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
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
                    Load More Answers
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </>
      )}
    </SectionComp>
  );
};
