'use client';

import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageCircle,
  Heart,
  User,
  Calendar,
  Share2,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import type { NewsItem } from '@/lib/constants/news';
import { MultilineText } from '@/components/general/MultilineText';
import { NewsDownloadButton } from '@/components/section/news/NewsDownloadButton';
import { Button } from '@/components/ui/button';

interface NewsDetailPageClientProps {
  newsItem: NewsItem;
  relatedStories: NewsItem[];
}

export const NewsDetailPageClient = ({ newsItem, relatedStories }: NewsDetailPageClientProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt || newsItem.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <FillImage
          src={newsItem.image}
          alt={newsItem.title}
          imageContext="public"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background">
              <ArrowLeft className="w-4 h-4" />
              Back to News
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
              {newsItem.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {newsItem.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80 flex-wrap">
              {newsItem.author && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {newsItem.author}
                </span>
              )}
              {newsItem.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(newsItem.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {newsItem.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {newsItem.views}
              </span>
              {newsItem.comments !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {newsItem.comments}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {newsItem.excerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8">
              <MultilineText
                text={newsItem.excerpt}
                paragraphClassName="text-xl text-muted-foreground font-medium leading-relaxed"
              />
            </motion.div>
          )}

          {newsItem.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-8">
              <audio
                controls
                src={newsItem.audioUrl}
                className="w-full rounded-lg"
                preload="metadata">
                Your browser does not support audio.
              </audio>
            </motion.div>
          )}

          {newsItem.downloadUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mb-8">
              <NewsDownloadButton
                _id={newsItem._id}
                slug={newsItem.slug}
                title={newsItem.title}
                downloadUrl={newsItem.downloadUrl}
              />
            </motion.div>
          )}

          {/* Full Story Content */}
          {newsItem.fullStory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-lg max-w-none">
              {/* Introduction */}
              {newsItem.fullStory.introduction && (
                <MultilineText
                  text={newsItem.fullStory.introduction}
                  className="mb-6"
                  paragraphClassName="text-lg text-foreground leading-relaxed"
                />
              )}

              {/* Sections */}
              {newsItem.fullStory.sections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  {section.heading && (
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4 mt-8">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((paragraph, paraIndex) => (
                    <MultilineText
                      key={paraIndex}
                      text={paragraph}
                      className="mb-4"
                      paragraphClassName="text-base text-foreground leading-relaxed"
                    />
                  ))}
                </div>
              ))}

              {/* Conclusion */}
              {newsItem.fullStory.conclusion && (
                <MultilineText
                  text={newsItem.fullStory.conclusion}
                  className="mt-8"
                  paragraphClassName="text-lg text-foreground leading-relaxed font-medium"
                />
              )}
            </motion.div>
          )}

          {newsItem.youtubeEmbedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 rounded-2xl overflow-hidden bg-black aspect-video border border-border/50">
              <iframe
                src={newsItem.youtubeEmbedUrl}
                title={newsItem.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          )}
          {!newsItem.youtubeEmbedUrl && newsItem.videoFileUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 rounded-2xl overflow-hidden bg-muted">
              <div className="aspect-video">
                <video
                  src={newsItem.videoFileUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={newsItem.image}
                  preload="metadata">
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}
          {!newsItem.youtubeEmbedUrl && !newsItem.videoFileUrl && newsItem.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 rounded-2xl overflow-hidden bg-muted">
              <div className="aspect-video">
                <video
                  src={newsItem.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={newsItem.image}
                  preload="metadata">
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}

          {/* Meta Information Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {newsItem.views && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {newsItem.views} views
                </span>
              )}
              {newsItem.comments !== undefined && (
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {newsItem.comments} comments
                </span>
              )}
              {newsItem.likes !== undefined && (
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {newsItem.likes} likes
                </span>
              )}
            </div>
            <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Story
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="container mx-auto px-4 py-12 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              Related Stories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStories.map((story, index) => (
                <motion.article
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
                  <Link href={`/news/story/${story._id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <FillImage
                        src={story.image}
                        alt={story.title}
                        imageContext="public"
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {story.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {story.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {story.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {story.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {story.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
