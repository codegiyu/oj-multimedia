/** Social links for artist (matches backend Artist model). */
export interface ArtistSocials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

/**
 * Artist model from backend: name, details, and platform media (Music/Video reference this artist).
 * Use for artist dashboard and API responses.
 */
export interface Artist {
  _id: string;
  /** User id that owns this artist profile (for artist dashboard). */
  user?: string;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  genre?: string;
  socials?: ArtistSocials;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

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
  followerCount?: number;
  isFollowing?: boolean;
  verified?: boolean;
  socials?: ArtistSocials;
  isFeatured?: boolean;
  isRising?: boolean;
  songs?: number;
  videos?: number;
}
