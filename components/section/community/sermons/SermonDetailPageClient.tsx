'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Share2, Bookmark, Play, Volume2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/atoms/Toast';
import type { SermonItem } from '@/lib/constants/community/sermons';

interface SermonDetailPageClientProps {
  sermon: SermonItem;
  relatedSermons: SermonItem[];
}

export const SermonDetailPageClient = ({ sermon, relatedSermons }: SermonDetailPageClientProps) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: sermon.title,
          text: sermon.description || sermon.title,
          url: window.location.href,
        });
        toast({
          title: 'Shared!',
          description: 'Sermon shared successfully.',
          variant: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Sermon link copied to clipboard.',
          variant: 'success',
        });
      }
    } catch (error) {
      // User cancelled share
      console.error(error);
    }
  };

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        {(sermon.thumbnail || sermon.image) && (
          <Image
            src={sermon.thumbnail || sermon.image || ''}
            alt={sermon.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-primary-foreground">
          <div className="container mx-auto max-w-4xl">
            <Link href="/community/sermons">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 mb-6 bg-background/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Sermons
              </Button>
            </Link>
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
              {sermon.category || sermon.topic}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {sermon.title}
            </h1>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="flex items-center gap-1">
                {sermon.isVideo ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {sermon.pastor}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {sermon.duration}
              </span>
              {sermon.views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {sermon.views}
                </span>
              )}
              {sermon.plays && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {sermon.plays}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Media Player */}
          {sermon.isAudio && sermon.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8">
              <audio controls className="w-full">
                <source src={sermon.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </motion.div>
          )}

          {sermon.isVideo && sermon.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-lg overflow-hidden bg-muted">
              <div className="aspect-video">
                <video
                  src={sermon.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={sermon.thumbnail}
                  preload="metadata">
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}

          {/* Description */}
          {sermon.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-foreground leading-relaxed mb-8">
              {sermon.description}
            </motion.div>
          )}

          {/* Transcript */}
          {sermon.transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-display font-bold mb-4">Transcript</h2>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {sermon.transcript}
              </p>
            </motion.div>
          )}

          {/* Related Scriptures */}
          {sermon.relatedScriptures && sermon.relatedScriptures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-display font-bold mb-4">Related Scriptures</h3>
              <div className="flex flex-wrap gap-2">
                {sermon.relatedScriptures.map((scripture: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {scripture}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Meta Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {sermon.views && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {sermon.views} views
                </span>
              )}
              {sermon.plays && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {sermon.plays} plays
                </span>
              )}
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

      {/* Related Sermons */}
      {relatedSermons.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <h2 className="text-2xl font-display font-bold mb-6">Related Sermons</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedSermons.map((related, index) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link
                  href={`/community/sermons/${related.id}`}
                  className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{related.pastor}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{related.duration}</span>
                    {related.views && <span>{related.views}</span>}
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
