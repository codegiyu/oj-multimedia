import { Play, Clock, Music, Mic2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const recentContent = [
  {
    type: 'music',
    title: 'Morning Light',
    creator: 'Anna Martinez',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    icon: Music,
  },
  {
    type: 'sermon',
    title: 'Finding Purpose in Pain',
    creator: 'Pastor James Brown',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300&h=300&fit=crop',
    icon: Mic2,
  },
  {
    type: 'devotional',
    title: 'Trust in the Process',
    creator: 'Rebecca Stone',
    time: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=300&h=300&fit=crop',
    icon: BookOpen,
  },
  {
    type: 'music',
    title: 'Breakthrough',
    creator: 'Kingdom Sound',
    time: '12 hours ago',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    icon: Music,
  },
  {
    type: 'music',
    title: 'Faithful One',
    creator: 'Chris Anderson',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    icon: Music,
  },
  {
    type: 'sermon',
    title: 'The Power of Gratitude',
    creator: 'Dr. Sarah Mitchell',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=300&fit=crop',
    icon: Mic2,
  },
];

const typeColors = {
  music: 'bg-primary-foreground/90 text-primary',
  sermon: 'bg-secondary-foreground/90 text-secondary',
  devotional: 'bg-accent-foreground/90 text-accent',
};

export function RecentUploads() {
  return (
    <section className="py-16">
      <div className="regular-container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Recent Uploads</h2>
            <p className="text-muted-foreground">Fresh content from our community</p>
          </div>
          <Button variant="outline">See All New</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentContent.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl shadow-card overflow-hidden card-hover group">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                {/* Type Badge */}
                <div
                  className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${typeColors[item.type as keyof typeof typeColors]}`}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>

                {/* Play Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="play" size="icon">
                    <Play className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{item.creator}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
