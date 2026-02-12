'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { Button } from '@/components/ui/button';

export interface FeaturedArtist {
  _id: string;
  name: string;
  genre: string;
  image: string;
  followers: string;
  verified: boolean;
  songs: number;
  category?: string;
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
          <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
            <Link href="/community/artists">View All</Link>
          </Button>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredArtists.map((artist, index) => (
            <motion.div
              key={artist._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}>
              <ArtistCard
                _id={artist._id}
                name={artist.name}
                image={artist.image}
                genre={artist.genre}
                followers={artist.followers}
                verified={artist.verified}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
