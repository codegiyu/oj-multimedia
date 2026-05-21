'use client';

import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { SectionComp } from '@/components/general/SectionComp';
import { ArtistCard } from '@/components/cards/ArtistCard';

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
    <SectionComp
      icon={Users}
      iconColor="primary"
      heading="Creator Spotlight"
      subtext="Active and trending creators"
      viewAllLink="/community/artists"
      viewAllLabel="Discover Creators"
      contentProps={{ enableAnimation: false }}>
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
    </SectionComp>
  );
};
