'use client';

import { motion } from 'motion/react';
import { Heart, MessageCircle, Calendar, Share2, Bookmark, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/atoms/Toast';
import type { TestimonyItem } from '@/lib/constants/community/testimonies';
import { MultilineText } from '@/components/general/MultilineText';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { CommunityContentDetailHero } from '../shared/CommunityContentDetailHero';

interface TestimonyDetailPageClientProps {
  testimony: TestimonyItem;
  relatedTestimonies: TestimonyItem[];
}

export const TestimonyDetailPageClient = ({
  testimony,
  relatedTestimonies,
}: TestimonyDetailPageClientProps) => {
  const user = useAuthStore(state => state.user);
  const [likes, setLikes] = useState(testimony.likes);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: testimony.title || 'Testimony',
          text: testimony.content,
          url: window.location.href,
        });
        toast({
          title: 'Shared!',
          description: 'Testimony shared successfully.',
          variant: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Testimony link copied to clipboard.',
          variant: 'success',
        });
      }
    } catch {
      // User cancelled share
    }
  };

  const handleLike = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setLikes(prev => prev + 1);
    toast({
      title: 'Liked!',
      description: 'Thank you for your support.',
      variant: 'success',
    });
  };

  return (
    <article className="min-h-screen">
      <CommunityContentDetailHero
        backHref="/community/testimonies"
        backLabel="Back to Testimonies"
        title={testimony.title || 'Testimony'}
        layout="avatar"
        avatar={{ src: testimony.avatar, alt: testimony.author }}
        metaItems={[
          { icon: User, label: testimony.author },
          ...(testimony.date
            ? [
                {
                  icon: Calendar,
                  label: new Date(testimony.date).toLocaleDateString(),
                },
              ]
            : []),
        ]}
        badge={
          testimony.category ? (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
              {testimony.category}
            </span>
          ) : undefined
        }
      />

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <MultilineText
            animate
            text={testimony.fullContent || testimony.content}
            className="prose prose-lg max-w-none"
            paragraphClassName="text-lg text-foreground leading-relaxed"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={handleLike} className="gap-2">
                <Heart className="w-4 h-4" />
                {likes}
              </Button>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {testimony.comments} comments
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {relatedTestimonies.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <h2 className="text-2xl font-display font-bold mb-6">Related Testimonies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedTestimonies.map((related, index) => (
              <motion.div
                key={related._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link
                  href={`/community/testimonies/${related._id}`}
                  className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {related.title || 'Testimony'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {related.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{related.author}</span>
                    <span>{related.likes} likes</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </article>
  );
};
