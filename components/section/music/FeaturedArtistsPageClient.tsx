'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Verified, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MusicCategories } from './MusicCategories';
import { MusicUploadCTA } from '../shared/MusicUploadCTA';
import { EmptyState } from '../news/EmptyState';
import type { FeaturedArtist } from './FeaturedArtists';

interface FeaturedArtistsPageClientProps {
  featuredArtists: (FeaturedArtist & { category: string })[];
}

export const FeaturedArtistsPageClient = ({ featuredArtists }: FeaturedArtistsPageClientProps) => {
  const [displayedItems, setDisplayedItems] = useState(24);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedItems(prev => Math.min(prev + 12, featuredArtists.length));
    setIsLoading(false);
  };

  const hasMore = displayedItems < featuredArtists.length;
  const itemsToShow = featuredArtists.slice(0, displayedItems);

  return (
    <>
      <MusicCategories />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Featured Artists
                </h2>
                <p className="text-sm text-muted-foreground">Creators you should know</p>
              </div>
            </div>
          </div>

          <div>
            {itemsToShow.length === 0 ? (
              <EmptyState
                title="No Featured Artists"
                description="We couldn't find any featured artists in this category. Try selecting a different category or check back later for new content."
                icon={<Users className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {itemsToShow.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group text-center cursor-pointer">
                    <Link href={`/music?category=${artist.category || 'all'}`}>
                      {/* Avatar */}
                      <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            fill
                          />
                        </div>

                        {/* Play overlay */}
                        <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Verified badge */}
                        {artist.verified && (
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                            <Verified className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate px-2">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{artist.genre}</p>
                      <p className="text-xs text-primary font-medium mt-1">
                        {artist.followers} followers
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

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
                      Load More Artists
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>
      <MusicUploadCTA />
    </>
  );
};
