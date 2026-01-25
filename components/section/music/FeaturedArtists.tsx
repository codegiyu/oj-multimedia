'use client';

import { motion } from 'framer-motion';
import { Play, Users, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FeaturedArtist {
  id: number;
  name: string;
  genre: string;
  image: string;
  followers: string;
  verified: boolean;
  songs: number;
}

interface FeaturedArtistsProps {
  artists: FeaturedArtist[];
}

export const FeaturedArtists = ({ artists: featuredArtists }: FeaturedArtistsProps) => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Featured Artists</h2>
              <p className="text-sm text-muted-foreground">Creators you should know</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            View All
          </Button>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group text-center cursor-pointer">
              {/* Avatar */}
              <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 mb-4">
                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Play overlay */}
                <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="play" size="icon" className="w-10 h-10">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </Button>
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
              <p className="text-xs text-primary font-medium mt-1">{artist.followers} followers</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
