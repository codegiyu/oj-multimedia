'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Eye, MessageCircle, ThumbsUp, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import type { QuestionItem } from '@/lib/constants/community/questions';
import { getPastorById } from '@/lib/utils/community/pastors';
import { ShareButton } from '@/lib/hooks/use-copy';

interface QuestionDetailPageClientProps {
  question: QuestionItem;
  relatedQuestions: QuestionItem[];
}

export const QuestionDetailPageClient = ({
  question,
  relatedQuestions,
}: QuestionDetailPageClientProps) => {
  const [helpful, setHelpful] = useState(question.helpful || 0);
  const pastor = question.pastor_id ? getPastorById(question.pastor_id) : null;

  const handleHelpful = () => {
    setHelpful(prev => prev + 1);
    toast({
      title: 'Thank you!',
      description: 'Your feedback helps others find helpful answers.',
      variant: 'success',
    });
  };

  return (
    <article className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/community/ask-a-pastor">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Ask a Pastor
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4">
              <div className="flex-1">
                <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
                  {question.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {question.question}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {question.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {question.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {question.answers} answers
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {question.fullQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                {question.fullQuestion}
              </p>
            </motion.div>
          )}

          {question.isAnswered && question.answer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start gap-4 mb-4">
                {pastor && (
                  <div>
                    <h3 className="font-semibold">{question.pastor}</h3>
                    {pastor.title && (
                      <p className="text-sm text-muted-foreground">{pastor.title}</p>
                    )}
                  </div>
                )}
                {question.answeredDate && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    {question.answeredDate}
                  </span>
                )}
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-line mb-4">
                {question.answer}
              </p>
              <Button variant="outline" size="sm" onClick={handleHelpful} className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({helpful})
              </Button>
            </motion.div>
          )}

          {!question.isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-muted/30 rounded-lg border border-border">
              <p className="text-muted-foreground">
                This question is waiting for a pastor to provide an answer. Check back soon!
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {question.views} views
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {question.answers} answers
              </span>
            </div>
            <ShareButton
              text=""
              shareTitle={question.question}
              shareText={question.fullQuestion || question.question}
              successTitle="Link Copied!"
              successDescription="Question link copied to clipboard."
              displayType="text-icon"
              variant="outline"
              size="sm"
            />
          </motion.div>
        </div>
      </section>

      {relatedQuestions.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <h2 className="text-2xl font-display font-bold mb-6">Related Questions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedQuestions.map((related, index) => (
              <motion.div
                key={related._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link
                  href={`/community/ask-a-pastor/${related._id}`}
                  className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2 line-clamp-2">{related.question}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <span>{related.category}</span>
                    <span>{related.answers} answers</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
