'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import {
  Music,
  Play,
  Download,
  User,
  FileText,
  Video,
  Headphones,
  Upload,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const MusicPageClient = () => {
  // TODO: Fetch data from API
  const latestMusic = [
    { title: 'Amazing Grace', artist: 'John Doe', duration: '4:32', slug: 'amazing-grace' },
    { title: 'Heaven is Here', artist: 'Jane Smith', duration: '3:45', slug: 'heaven-is-here' },
    { title: 'Faithful God', artist: 'Michael Brown', duration: '5:12', slug: 'faithful-god' },
  ];

  const artists = [
    { name: 'John Doe', slug: 'john-doe', songs: 12 },
    { name: 'Jane Smith', slug: 'jane-smith', songs: 8 },
    { name: 'Michael Brown', slug: 'michael-brown', songs: 15 },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Music className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Gospel Music</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover the latest gospel music, download MP3s, watch music videos, and explore artist
            profiles.
          </p>
          <RegularBtn
            linkProps={{ href: '/promote' }}
            text="Submit Your Song"
            RightIcon={Upload}
            rightIconProps={{ className: 'size-4' }}
            className="bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
          />
        </div>
      </SectionContainer>

      {/* Latest Music */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Latest Music"
            text="Fresh releases from gospel artists"
            Icon={Music}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {latestMusic.map((song, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <Link href={`/music/${song.slug}`}>
                  <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5730D5]/20 to-[#8A2BE2]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-[#5730D5] ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#5730D5] transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">{song.artist}</p>
                    <div className="flex items-center gap-4">
                      <GhostBtn className="text-sm text-[#5730D5] hover:text-[#8A2BE2]">
                        <Download className="w-4 h-4 mr-1" />
                        Download MP3
                      </GhostBtn>
                      <span className="text-sm text-muted-foreground">{song.duration}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Artist Profiles */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading title="Artist Profiles" text="Meet the gospel artists" Icon={User} />
            <GhostBtn
              linkProps={{ href: '/music?tab=artists' }}
              className="hidden md:flex items-center gap-2 text-[#5730D5]">
              <span>View All Artists</span>
              <ArrowRight className="w-4 h-4" />
            </GhostBtn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artists.map((artist, idx) => (
              <Card key={idx} className="text-center group hover:shadow-lg transition-shadow">
                <Link href={`/music/artists/${artist.slug}`}>
                  <div className="p-6">
                    <div className="w-24 h-24 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-[#5730D5]/20 transition-colors">
                      <User className="w-12 h-12 text-[#5730D5]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{artist.name}</h3>
                    <p className="text-muted-foreground">{artist.songs} songs</p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Features Grid */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Explore More"
            text="Everything you need for your gospel music journey"
            Icon={Headphones}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lyrics & Meaning</h3>
              <p className="text-sm text-muted-foreground">
                Read song lyrics and their spiritual meanings
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Video className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Music Videos</h3>
              <p className="text-sm text-muted-foreground">Watch official music videos</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instrumentals</h3>
              <p className="text-sm text-muted-foreground">
                Download beats and instrumental tracks
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Submit Your Song</h3>
              <p className="text-sm text-muted-foreground">Share your music with the world</p>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};
