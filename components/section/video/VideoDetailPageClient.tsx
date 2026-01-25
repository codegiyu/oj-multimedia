'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Bookmark,
  Video,
  MessageCircle,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { VideoItem } from '@/lib/constants/videos';
import { VideoPlayer } from './VideoPlayer';
import { VideoDownloadButton } from './VideoDownloadButton';

interface VideoDetailPageClientProps {
  videoItem: VideoItem;
  relatedVideos: VideoItem[];
}

export const VideoDetailPageClient = ({ videoItem, relatedVideos }: VideoDetailPageClientProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoItem.title,
        text: `${videoItem.title} by ${videoItem.creator}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
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
                : 'Podcasts / Video Talks';

  return (
    <article className="min-h-screen">
      {/* Hero Section with Thumbnail */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src={videoItem.thumbnail}
          alt={videoItem.title}
          fill
          className="object-cover"
          priority
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
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
              {videoItem.creator}
            </p>
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
          {/* Video Player */}
          {videoItem.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8">
              <VideoPlayer
                videoUrl={videoItem.videoUrl}
                poster={videoItem.thumbnail}
                title={videoItem.title}
                description={videoItem.description}
              />
            </motion.div>
          )}

          {/* Download Button */}
          {videoItem.downloadUrl && (
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
              <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                {videoItem.description}
              </p>
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
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group">
                    <Link
                      href={`/videos/${video.id}`}
                      className="block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 hover:border-primary/20">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Video className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-background text-xs rounded font-medium">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{video.creator}</p>
                        {video.views && (
                          <p className="text-xs text-muted-foreground mt-1">{video.views} views</p>
                        )}
                      </div>
                    </Link>
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
