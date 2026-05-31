'use client';

import { motion } from 'motion/react';
import { Eye, MessageCircle, ThumbsUp, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import type { QuestionItem } from '@/lib/constants/community/questions';
import { ShareButton } from '@/lib/hooks/use-copy';
import { MultilineText } from '@/components/general/MultilineText';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';
import { QuestionVoteButtons } from './QuestionVoteButtons';
import { callApi } from '@/lib/services/callApi';
import { getErrorMessage } from '@/lib/utils/general';
import { FixedImage } from '@/components/general/FillImage';
import type { ReactNode } from 'react';

interface QuestionDetailPageClientProps {
  question: QuestionItem;
  relatedSlot?: ReactNode;
}

export const QuestionDetailPageClient = ({
  question,
  relatedSlot,
}: QuestionDetailPageClientProps) => {
  const user = useAuthStore(state => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [answerLikes, setAnswerLikes] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    question.answersList?.forEach(a => {
      map[a._id] = a.likes;
    });
    return map;
  });

  const answers = question.answersList ?? [];
  const questionSlugOrId = question.slug ?? question._id;

  const handleLikeAnswer = async (answerId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const res = await callApi('PUBLIC_ANSWER_LIKE', {
      query: `/${questionSlugOrId}/answers/${answerId}/like` as `/${string}/answers/${string}/like`,
    });

    if (res.error) {
      toast({
        title: 'Unable to like answer',
        description: getErrorMessage(res.error),
        variant: 'error',
      });
      return;
    }

    if (res.data?.likes != null) {
      setAnswerLikes(prev => ({ ...prev, [answerId]: res.data!.likes }));
    }

    toast({
      title: 'Thank you!',
      description: 'Your feedback helps others find helpful answers.',
      variant: 'success',
    });
  };

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/ask-a-pastor"
        backLabel="Back to Ask a Pastor"
        title={question.question}
        badge={
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {question.category}
            </span>
            {question.isPrivate ? (
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            ) : null}
          </div>
        }
        metaItems={[
          { icon: User, label: question.author },
          { icon: Eye, label: `${question.views} views` },
          { icon: MessageCircle, label: `${question.answers} answers` },
        ]}
      />

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {question.fullQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none mb-8">
              <MultilineText
                text={question.fullQuestion}
                paragraphClassName="text-lg text-foreground leading-relaxed"
              />
            </motion.div>
          )}

          <div className="mb-8">
            <QuestionVoteButtons
              questionId={questionSlugOrId}
              initialUpvotes={question.upvotes ?? 0}
              initialDownvotes={question.downvotes ?? 0}
            />
          </div>

          {answers.length > 0 ? (
            <div className="space-y-6">
              {answers.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    {entry.pastor?.image ? (
                      <FixedImage
                        imageContext="public"
                        src={entry.pastor.image}
                        alt={entry.pastor.name ?? 'Pastor'}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : null}
                    <div className="flex-1">
                      {entry.pastor?.slug ? (
                        <Link
                          href={`/community/ask-a-pastor/pastors/${entry.pastor.slug}`}
                          className="font-semibold hover:text-primary">
                          {entry.pastor.name}
                        </Link>
                      ) : (
                        <h3 className="font-semibold">
                          {entry.pastor?.name ?? entry.pastorName ?? 'Pastor'}
                        </h3>
                      )}
                      {entry.pastor?.title ? (
                        <p className="text-sm text-muted-foreground">{entry.pastor.title}</p>
                      ) : null}
                    </div>
                    {entry.answeredAt ? (
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.answeredAt).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                  <MultilineText
                    text={entry.answer}
                    className="mb-4"
                    paragraphClassName="text-foreground leading-relaxed"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLikeAnswer(entry._id)}
                    className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({answerLikes[entry._id] ?? entry.likes})
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : !question.isAnswered ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-muted/30 rounded-lg border border-border">
              <p className="text-muted-foreground">
                This question is waiting for a pastor to provide an answer. Check back soon!
              </p>
            </motion.div>
          ) : null}

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

      {relatedSlot}
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </article>
  );
};
