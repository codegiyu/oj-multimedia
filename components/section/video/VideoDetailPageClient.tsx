'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import { resolveContentImage } from '@/lib/constants/contentImageDefaults';
import { Button } from '@/components/ui/button';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { VideoPlayerDynamic } from './VideoPlayerDynamic';
import { VideoDownloadButton } from './VideoDownloadButton';
import { VideoCard } from '@/components/cards/VideoCard';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';
import { MultilineText } from '@/components/general/MultilineText';

interface VideoDetailPageClientProps {
  videoItem: VideoItemWithCreator;
  relatedVideos: VideoItemWithCreator[];
}

export const VideoDetailPageClient = ({ videoItem, relatedVideos }: VideoDetailPageClientProps) => {
  const creatorName =
    typeof videoItem.creator === 'string' ? videoItem.creator : videoItem.creator.name;

  const entityId = videoItem.slug || videoItem._id;

  useEffect(() => {
    sendContentAnalyticsEvent('video', entityId, 'view');
  }, [entityId]);

  const onVideoFirstPlay = useCallback(() => {
    sendContentAnalyticsEvent('video', entityId, 'play');
  }, [entityId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoItem.title,
        text: `${videoItem.title} by ${creatorName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const categoryLabel =
    videoItem.category === 'music'
      ? 'Music Videos'
      : videoItem.category === 'short'
        ? 'Short Clips'
        : videoItem.category === 'talks'
          ? 'Talks & Speeches'
          : videoItem.category === 'creative'
            ? 'Creative Content'
            : videoItem.category === 'inspirational'
              ? 'Inspirational'
              : videoItem.category === 'live'
                ? 'Live Performances'
                : videoItem.category === 'movie'
                  ? 'Movies'
                  : 'Podcasts / Video Talks';

  return (
    <article className="min-h-screen">
      {/* Hero Section with Thumbnail */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <FillImage
          src={videoItem.thumbnail}
          alt={videoItem.title}
          imageContext="public"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/videos">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
              <ArrowLeft className="w-4 h-4" />
              Back to Videos
            </Button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
            <Bookmark className="w-4 h-4" />
            Save
          </Button>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12 text-primary-foreground">
          <div className="max-w-4xl">
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4">
              {categoryLabel}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2">
              {videoItem.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">{creatorName}</p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80 flex-wrap">
              {videoItem.views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {videoItem.views} views
                </span>
              )}
              {videoItem.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {videoItem.duration}
                </span>
              )}
              {videoItem.releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(videoItem.releaseDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {videoItem.likes && (
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {videoItem.likes} likes
                </span>
              )}
              {videoItem.comments !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {videoItem.comments} comments
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hosted file vs YouTube/embed */}
          {videoItem.videoFileUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8">
              <VideoPlayerDynamic
                videoUrl={videoItem.videoFileUrl}
                poster={resolveContentImage(videoItem.thumbnail, 'public')}
                title={videoItem.title}
                description={videoItem.description}
                onFirstPlay={onVideoFirstPlay}
              />
            </motion.div>
          )}
          {!videoItem.videoFileUrl && videoItem.youtubeEmbedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-black aspect-video">
              <iframe
                src={videoItem.youtubeEmbedUrl}
                title={videoItem.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          )}
          {!videoItem.videoFileUrl && !videoItem.youtubeEmbedUrl && videoItem.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8">
              <VideoPlayerDynamic
                videoUrl={videoItem.videoUrl}
                poster={resolveContentImage(videoItem.thumbnail, 'public')}
                title={videoItem.title}
                description={videoItem.description}
                onFirstPlay={onVideoFirstPlay}
              />
            </motion.div>
          )}

          {/* Download Button */}
          {(videoItem.videoFileUrl ||
            videoItem.downloadUrl ||
            (videoItem.isMonetizable && (videoItem.price ?? videoItem.downloadPrice))) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8">
              <VideoDownloadButton videoItem={videoItem} />
            </motion.div>
          )}

          {/* Description */}
          {videoItem.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-4">About</h2>
              <MultilineText
                text={videoItem.description}
                paragraphClassName="text-base text-foreground leading-relaxed"
              />
            </motion.div>
          )}

          {/* Tags */}
          {videoItem.tags && videoItem.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8">
              <h2 className="text-2xl font-display font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {videoItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-muted text-foreground text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12">
              <h2 className="text-2xl font-display font-bold mb-6">Related Videos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}>
                    <VideoCard
                      _id={video._id}
                      title={video.title}
                      creator={video.creator}
                      thumbnail={video.thumbnail}
                      views={video.views || '0'}
                      duration={video.duration || '0:00'}
                      category={video.category || 'Video'}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </article>
  );
};
