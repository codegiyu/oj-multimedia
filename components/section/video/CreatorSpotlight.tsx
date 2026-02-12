'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { Button } from '@/components/ui/button';

export interface FeaturedCreator {
  _id: string;
  name: string;
  category: string;
  avatar: string;
  followers: string;
  videos: number;
  views: string;
  verified: boolean;
  latestVideo?: {
    thumbnail: string;
    title: string;
    duration: string;
  };
}

interface CreatorSpotlightProps {
  creators: FeaturedCreator[];
}

export const CreatorSpotlight = ({ creators: featuredCreators }: CreatorSpotlightProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Creator Spotlight</h2>
              <p className="text-sm text-muted-foreground">Active and trending creators</p>
            </div>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
            <Link href="/community/artists">Discover Creators</Link>
          </Button>
        </div>

        {/* Creators Grid - uses ArtistCard linking to community artist page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCreators.map((creator, index) => (
            <motion.div
              key={creator._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}>
              <ArtistCard
                _id={creator._id}
                name={creator.name}
                image={creator.avatar}
                genre={creator.category}
                followers={creator.followers}
                verified={creator.verified}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
