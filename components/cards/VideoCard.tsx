'use client';

import { motion } from 'motion/react';
import { Play, Eye, Clock, MoreVertical, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLink } from '@/components/atoms/AppLink';
import { FillImage } from '@/components/general/FillImage';
import { ShareIconButton } from '@/components/content/ShareIconButton';
import { FavoriteButton } from '@/components/content/FavoriteButton';

interface VideoCardProps {
  _id?: string;
  title: string;
  creator: string | { _id: string; name: string };
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
  /** 'featured' | 'shortForm' | 'recent' = different layouts. 'recent' = horizontal row, small thumb, uploadedAt */
  variant?: 'default' | 'featured' | 'shortForm' | 'recent';
  /** Show FEATURED badge on thumbnail (used when variant='featured') */
  featured?: boolean;
  /** Likes count (used when variant='shortForm') */
  likes?: string;
  /** Upload date label (used when variant='recent') */
  uploadedAt?: string;
}

export const VideoCard = ({
  _id,
  title,
  creator,
  thumbnail,
  views,
  duration,
  category,
  variant = 'default',
  featured = false,
  likes,
  uploadedAt,
}: VideoCardProps) => {
  const creatorName = typeof creator === 'string' ? creator : creator.name;
  const isFeaturedVariant = variant === 'featured';
  const isShortFormVariant = variant === 'shortForm';
  const isRecentVariant = variant === 'recent';
  const detailHref = _id ? `/videos/${_id}` : undefined;

  if (isRecentVariant) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group flex gap-4 p-4 bg-card rounded-2xl hover:shadow-md transition-all">
        {detailHref ? (
          <AppLink
            href={detailHref}
            className="flex min-w-0 flex-1 gap-4"
            aria-label={`View ${title}`}>
            <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
              <FillImage
                imageContext="public"
                src={thumbnail}
                alt=""
                sizes="128px"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Play className="w-5 h-5 text-background fill-current" aria-hidden />
              </div>
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-background text-[10px] rounded font-medium">
                {duration}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors mb-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{creatorName}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-muted rounded-full">{category}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {views}
                </span>
                {uploadedAt != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {uploadedAt}
                  </span>
                )}
              </div>
            </div>
          </AppLink>
        ) : (
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
              <FillImage imageContext="public" src={thumbnail} alt={title} sizes="128px" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground truncate">{creatorName}</p>
            </div>
          </div>
        )}
        {detailHref && (
          <FavoriteButton
            entityType="video"
            entityId={_id!}
            className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: isShortFormVariant ? 0 : isFeaturedVariant ? -8 : -4,
        scale: isShortFormVariant ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div
        className={`relative overflow-hidden ${isShortFormVariant ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {detailHref ? (
          <AppLink
            href={detailHref}
            className="absolute inset-0 z-0 block"
            aria-label={`View ${title}`}>
            <FillImage
              imageContext="public"
              src={thumbnail}
              alt=""
              sizes="(max-width: 768px) 100vw, 400px"
              className={`transition-transform duration-500 ${isFeaturedVariant || isShortFormVariant ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}
            />

            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity pointer-events-none ${isShortFormVariant ? 'bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100' : isFeaturedVariant ? 'bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100' : 'bg-foreground/20 opacity-0 group-hover:opacity-100'}`}>
              <span
                className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground ${isFeaturedVariant || isShortFormVariant ? 'h-10 w-10 shadow-glow' : 'h-12 w-12'}`}>
                <Play
                  className={`fill-current ${isShortFormVariant ? 'w-4 h-4 ml-0.5' : 'w-6 h-6 ml-1'}`}
                  aria-hidden
                />
              </span>
            </div>

            <span
              className={`absolute font-medium rounded bg-foreground/80 pointer-events-none ${isShortFormVariant ? 'bottom-2 right-2 px-1.5 py-0.5 text-[10px] text-background' : isFeaturedVariant ? 'bottom-3 right-3 text-xs px-2 py-1 rounded-md text-background' : 'bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-md text-primary-foreground'}`}>
              {!isFeaturedVariant && !isShortFormVariant && <Clock className="w-3 h-3" />}
              {duration}
            </span>

            {!isShortFormVariant && (
              <div
                className={`absolute top-2 left-2 pointer-events-none ${isFeaturedVariant ? 'top-3 left-3' : ''}`}>
                {isFeaturedVariant && featured ? (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    FEATURED
                  </span>
                ) : !isFeaturedVariant ? (
                  <span className="px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
                    {category}
                  </span>
                ) : null}
              </div>
            )}
          </AppLink>
        ) : (
          <>
            <FillImage
              imageContext="public"
              src={thumbnail}
              alt={title}
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-foreground/80 text-xs text-primary-foreground">
              {duration}
            </span>
          </>
        )}

        {isShortFormVariant && detailHref && (
          <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoriteButton
              entityType="video"
              entityId={_id!}
              className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7"
              iconClassName="w-3 h-3"
            />
            {detailHref && (
              <ShareIconButton
                title={title}
                text={`${title} by ${creatorName}`}
                url={detailHref}
                className="bg-card/80 backdrop-blur-sm hover:bg-card h-7 w-7"
                iconClassName="w-3 h-3"
              />
            )}
          </div>
        )}
      </div>

      <div className={isShortFormVariant ? 'p-2' : 'p-4'}>
        {isShortFormVariant ? (
          detailHref ? (
            <AppLink href={detailHref} className="block" aria-label={`View ${title}`}>
              <h3 className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {title}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate mb-1">{creatorName}</p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{views} views</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5" />
                  {likes ?? '0'}
                </span>
              </div>
            </AppLink>
          ) : (
            <>
              <h3 className="font-semibold text-xs line-clamp-2 mb-1">{title}</h3>
              <p className="text-[10px] text-muted-foreground truncate">{creatorName}</p>
            </>
          )
        ) : isFeaturedVariant ? (
          detailHref ? (
            <AppLink href={detailHref} className="block" aria-label={`View ${title}`}>
              <div className="mb-2">
                <span className="text-xs text-primary font-medium mb-1 block">{category}</span>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{creatorName}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {views}
                </span>
              </div>
            </AppLink>
          ) : (
            <div>
              <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
              <p className="text-xs text-muted-foreground">{creatorName}</p>
            </div>
          )
        ) : (
          <div className="flex gap-3">
            {detailHref ? (
              <AppLink
                href={detailHref}
                className="flex min-w-0 flex-1 gap-3"
                aria-label={`View ${title}`}>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {creatorName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{creatorName}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {views}
                    </span>
                  </div>
                </div>
              </AppLink>
            ) : (
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {creatorName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{creatorName}</p>
                </div>
              </div>
            )}
            {detailHref && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="More options"
                onClick={e => e.preventDefault()}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
