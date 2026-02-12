/**
 * Frontend ArtistProfile type.
 * Uses _id: string (not id: number). user is the id of the User account that owns this profile.
 */
export interface ArtistProfile {
  _id: string;
  user?: string;
  name: string;
  genre?: string;
  image: string;
  coverImage?: string;
  bio?: string;
  followers?: string;
  verified?: boolean;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  isFeatured?: boolean;
  isRising?: boolean;
  songs?: number;
  videos?: number;
}
