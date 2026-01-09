import { Users, Music, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const artists = [
  {
    id: 1,
    name: 'Grace Williams',
    genre: 'Contemporary Worship',
    songs: 24,
    followers: '45K',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    verified: true,
  },
  {
    id: 2,
    name: 'David Thompson',
    genre: 'Gospel Soul',
    songs: 18,
    followers: '32K',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'Sarah Chen',
    genre: 'Inspirational Pop',
    songs: 31,
    followers: '67K',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    verified: true,
  },
  {
    id: 4,
    name: 'Michael Rivers',
    genre: 'Afro-Inspirational',
    songs: 15,
    followers: '28K',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    verified: false,
  },
  {
    id: 5,
    name: 'Harmony Collective',
    genre: 'Choir & Ensemble',
    songs: 42,
    followers: '89K',
    image: 'https://images.unsplash.com/photo-1529518969858-8baa65152fc8?w=300&h=300&fit=crop',
    verified: true,
  },
  {
    id: 6,
    name: 'Joy Adams',
    genre: 'Spoken Word',
    songs: 12,
    followers: '19K',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    verified: false,
  },
];

export function ArtistProfiles() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Artists</h2>
            <p className="text-muted-foreground">Discover talented creators in our community</p>
          </div>
          <Button variant="ghost" className="gap-2">
            View All Artists <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {artists.map(artist => (
            <div key={artist.id} className="group text-center cursor-pointer">
              <div className="relative mb-4">
                <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-background shadow-lg group-hover:border-primary/30 transition-colors duration-300">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {artist.verified && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <Award className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">{artist.genre}</p>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  {artist.songs}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {artist.followers}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
