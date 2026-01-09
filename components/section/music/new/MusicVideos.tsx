import { Play, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const videos = [
  {
    id: 1,
    title: 'Rise Above - Official Music Video',
    artist: 'Grace Williams',
    views: '1.2M',
    duration: '4:32',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=340&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Unshaken Faith - Live Performance',
    artist: 'David Thompson',
    views: '856K',
    duration: '5:18',
    thumbnail: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&h=340&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Morning Light - Acoustic Session',
    artist: 'Sarah Chen',
    views: '432K',
    duration: '3:45',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Grateful Heart - Behind The Scenes',
    artist: 'Michael Rivers',
    views: '287K',
    duration: '6:12',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=340&fit=crop',
    featured: false,
  },
];

export function MusicVideos() {
  const featuredVideo = videos.find(v => v.featured);
  const otherVideos = videos.filter(v => !v.featured);

  return (
    <section className="py-16 bg-muted/30">
      <div className="regular-container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Music Videos</h2>
          <p className="text-muted-foreground">Watch inspiring performances and stories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Video */}
          {featuredVideo && (
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="aspect-video">
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="play"
                  size="icon"
                  className="w-16 h-16 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Play className="w-7 h-7 fill-current" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2 inline-block">
                  FEATURED
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{featuredVideo.title}</h3>
                <p className="text-white/80 text-sm">{featuredVideo.artist}</p>
                <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {featuredVideo.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredVideo.duration}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Other Videos */}
          <div className="grid gap-4">
            {otherVideos.map(video => (
              <div
                key={video.id}
                className="group flex gap-4 bg-card rounded-xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300 cursor-pointer">
                <div className="relative w-40 flex-shrink-0">
                  <div className="aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="flex-1 py-3 pr-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{video.artist}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            View All Videos
          </Button>
        </div>
      </div>
    </section>
  );
}
