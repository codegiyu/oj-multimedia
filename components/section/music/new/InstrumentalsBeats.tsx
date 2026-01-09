import { Play, Download, ShoppingCart, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const instrumentals = [
  {
    id: 1,
    title: 'Worship Keys - C Major',
    producer: 'SoundScape Studios',
    bpm: 72,
    key: 'C Major',
    duration: '3:45',
    price: 'Free',
    waveform: 'bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20',
  },
  {
    id: 2,
    title: 'Gospel Drums Pack',
    producer: 'BeatMaker Pro',
    bpm: 85,
    key: 'Various',
    duration: '4:12',
    price: '$15',
    waveform: 'bg-gradient-to-r from-orange/20 via-orange/60 to-orange/20',
  },
  {
    id: 3,
    title: 'Afro Praise Beat',
    producer: 'AfroSoul Beats',
    bpm: 110,
    key: 'G Minor',
    duration: '3:30',
    price: '$25',
    waveform: 'bg-gradient-to-r from-secondary/40 via-secondary/80 to-secondary/40',
  },
  {
    id: 4,
    title: 'Piano Meditation',
    producer: 'Peaceful Productions',
    bpm: 60,
    key: 'D Major',
    duration: '5:00',
    price: 'Free',
    waveform: 'bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20',
  },
  {
    id: 5,
    title: 'Contemporary Worship Track',
    producer: 'SoundScape Studios',
    bpm: 78,
    key: 'E Major',
    duration: '4:30',
    price: '$20',
    waveform: 'bg-gradient-to-r from-orange/20 via-orange/60 to-orange/20',
  },
  {
    id: 6,
    title: 'Spoken Word Background',
    producer: 'Ambient Creations',
    bpm: 65,
    key: 'A Minor',
    duration: '6:15',
    price: '$10',
    waveform: 'bg-gradient-to-r from-secondary/40 via-secondary/80 to-secondary/40',
  },
];

export function InstrumentalsBeats() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <section className="py-16 bg-background">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Instrumentals & Beats</h2>
            <p className="text-muted-foreground">High-quality tracks for your next project</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="outline" size="sm">
              Free
            </Button>
            <Button variant="outline" size="sm">
              Premium
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {instrumentals.map(track => (
            <div
              key={track.id}
              className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-elegant transition-all duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-primary/10 hover:bg-primary/20 flex-shrink-0"
                onClick={() => togglePlay(track.id)}>
                {playingId === track.id ? (
                  <Pause className="w-5 h-5 text-primary" />
                ) : (
                  <Play className="w-5 h-5 text-primary" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      track.price === 'Free'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-primary/10 text-primary'
                    }`}>
                    {track.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{track.producer}</p>
              </div>

              {/* Waveform visualization */}
              <div className="hidden md:block flex-1 max-w-xs">
                <div
                  className={`h-10 rounded-lg ${track.waveform} flex items-center justify-center gap-0.5`}>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-foreground/30 rounded-full"
                      style={{
                        height: `${Math.random() * 100}%`,
                        minHeight: '4px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                <span>{track.bpm} BPM</span>
                <span>{track.key}</span>
                <span>{track.duration}</span>
              </div>

              <div className="flex gap-2">
                {track.price === 'Free' ? (
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Download className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            Browse All Instrumentals
          </Button>
        </div>
      </div>
    </section>
  );
}
