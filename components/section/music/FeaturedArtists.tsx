'use client';

import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ArtistCard } from '@/components/cards/ArtistCard';

export interface FeaturedArtist {
  _id: string;
  name: string;
  genre: string;
  image: string;
  followers: string;
  followerCount?: number;
  isFollowing?: boolean;
  verified: boolean;
  songs: number;
  category?: string;
}

interface FeaturedArtistsProps {
  artists: FeaturedArtist[];
}

export const FeaturedArtists = ({ artists: featuredArtists }: FeaturedArtistsProps) => {
  return (
    <SectionComp
      icon={Users}
      iconColor="primary"
      heading="Featured Artists"
      subtext="Creators you should know"
      viewAllLink="/music/featured-artists"
      background="bg-muted/30"
      contentProps={{ enableAnimation: false }}>
      {featuredArtists.length === 0 ? (
        <SectionEmptyState
          title="No featured artists yet"
          description="Artists and creators will appear here when they join the platform."
          icon={Users}
          actionLabel="Discover artists"
          actionHref="/music/featured-artists"
        />
      ) : (
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
                showFollowButton
                isFollowing={artist.isFollowing}
                followerCount={artist.followerCount}
              />
            </motion.div>
          ))}
        </div>
      )}
    </SectionComp>
  );
};
