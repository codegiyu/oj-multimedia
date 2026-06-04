'use client';

import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';
import { AppLink } from '@/components/atoms/AppLink';
import { FillImage } from '@/components/general/FillImage';
import { MultilinePreview } from '@/components/general/MultilinePreview';

interface NewsCardProps {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  time: string;
  image: string;
  featured?: boolean;
}

export const NewsCard = ({
  _id,
  title,
  excerpt,
  category,
  time,
  image,
  featured,
}: NewsCardProps) => {
  const linkId = _id;
  if (featured) {
    const featuredContent = (
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] rounded-2xl overflow-hidden cursor-pointer">
        <FillImage
          imageContext="public"
          src={image}
          alt={title}
          sizes="(max-width: 768px) 100vw, 600px"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
          <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-3">
            {category}
          </span>
          <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-primary-glow transition-colors">
            {title}
          </h3>
          <MultilinePreview
            text={excerpt}
            className="text-primary-foreground/80 text-sm line-clamp-2 mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary-foreground/60 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.article>
    );

    if (linkId) {
      return (
        <AppLink href={`/news/story/${linkId}`} className="block h-full">
          {featuredContent}
        </AppLink>
      );
    }
    return featuredContent;
  }

  const regularContent = (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group h-full bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
      <div className="relative aspect-[16/10] overflow-hidden">
        <FillImage
          imageContext="public"
          src={image}
          alt={title}
          sizes="(max-width: 768px) 100vw, 400px"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="inline-flex px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium mb-2">
          {category}
        </span>
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <MultilinePreview
          text={excerpt}
          className="text-sm text-muted-foreground line-clamp-2 mb-3"
        />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {time}
        </span>
      </div>
    </motion.article>
  );

  if (linkId) {
    return (
      <AppLink href={`/news/story/${linkId}`} className="block h-full">
        {regularContent}
      </AppLink>
    );
  }
  return regularContent;
};
