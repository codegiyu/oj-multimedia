import { describe, expect, it } from 'vitest';
import { mapToArtistProfile, mapToCommunityArtist } from '@/lib/utils/communityApiMappers';

describe('mapToCommunityArtist', () => {
  it('maps followerCount, songs, and isFollowing from API artist payloads', () => {
    const mapped = mapToCommunityArtist({
      _id: '507f1f77bcf86cd799439011',
      name: 'Grace Artist',
      image: '/artist.jpg',
      genre: 'Gospel',
      followerCount: 1200,
      songs: 8,
      verified: true,
      isFollowing: true,
    });

    expect(mapped).toMatchObject({
      _id: '507f1f77bcf86cd799439011',
      name: 'Grace Artist',
      followers: '1200',
      followerCount: 1200,
      songs: 8,
      isFollowing: true,
      verified: true,
    });
  });

  it('prefers followers when followerCount is absent', () => {
    const mapped = mapToCommunityArtist({
      _id: '1',
      name: 'Artist',
      image: '',
      genre: '',
      followers: 42,
    });

    expect(mapped.followerCount).toBe(42);
    expect(mapped.followers).toBe('42');
  });
});

describe('mapToArtistProfile', () => {
  it('maps detail fields including videos and follow state', () => {
    const mapped = mapToArtistProfile({
      _id: '507f1f77bcf86cd799439011',
      name: 'Grace Artist',
      image: '/artist.jpg',
      coverImage: '/cover.jpg',
      bio: 'Bio text',
      genre: 'Gospel',
      followers: 500,
      songs: 4,
      videos: 2,
      isFollowing: false,
      verified: true,
      socials: { instagram: 'https://instagram.com/grace' },
    });

    expect(mapped).toMatchObject({
      followerCount: 500,
      followers: '500',
      songs: 4,
      videos: 2,
      isFollowing: false,
      coverImage: '/cover.jpg',
      bio: 'Bio text',
      socials: { instagram: 'https://instagram.com/grace' },
    });
  });
});
