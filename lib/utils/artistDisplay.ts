export type ArtistRef = string | { _id: string; name: string; slug?: string; linkable?: boolean };

export function resolveArtistDisplay(artist: ArtistRef): {
  name: string;
  href: string | null;
} {
  if (typeof artist === 'string') {
    return { name: artist, href: null };
  }

  const linkable = artist.linkable !== false && Boolean(artist.slug || artist._id);
  const name = artist.name || 'Unknown user';

  if (!linkable) {
    return { name: name === '' ? 'Unknown user' : name, href: null };
  }

  const id = artist.slug || artist._id;
  return { name, href: `/community/artists/${id}` };
}
