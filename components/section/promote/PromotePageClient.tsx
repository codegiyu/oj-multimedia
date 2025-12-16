'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Music, Mic, Star, Mail, Upload } from 'lucide-react';

export const PromotePageClient = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Star className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Promote Your Content</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Share your music or sermons with our community. Get featured and reach a wider audience.
          </p>
        </div>
      </SectionContainer>

      {/* Promotion Options */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Promotion Options"
            text="Choose how you want to promote your content"
            Icon={Star}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Promote Music */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#5730D5]/10 flex items-center justify-center">
                    <Music className="w-8 h-8 text-[#5730D5]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Promote Your Song</h3>
                    <p className="text-muted-foreground">Starting from ₦5,000</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Featured placement on homepage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Social media promotion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Newsletter feature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Analytics dashboard</span>
                  </li>
                </ul>
                <RegularBtn
                  text="Submit Your Song"
                  RightIcon={Upload}
                  rightIconProps={{ className: 'size-4' }}
                  className="w-full bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
                />
              </CardContent>
            </Card>

            {/* Upload Sermon */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#5730D5]/10 flex items-center justify-center">
                    <Mic className="w-8 h-8 text-[#5730D5]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Upload Your Sermon</h3>
                    <p className="text-muted-foreground">Monetizable option available</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Reach thousands of listeners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Earn from your content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Pastor spotlight feature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5730D5] mt-1">✓</span>
                    <span className="text-muted-foreground">Download analytics</span>
                  </li>
                </ul>
                <RegularBtn
                  text="Upload Sermon"
                  RightIcon={Upload}
                  rightIconProps={{ className: 'size-4' }}
                  className="w-full bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>

      {/* Get Featured & Partnership */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Get Featured & Partnerships"
            text="Contact us for sponsorship and partnership opportunities"
            Icon={Mail}
          />
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                Interested in getting featured, sponsoring content, or forming a partnership? We'd love to
                hear from you. Contact us to discuss opportunities.
              </p>
              <RegularBtn
                linkProps={{ href: '/contact' }}
                text="Contact Us"
                RightIcon={Mail}
                rightIconProps={{ className: 'size-4' }}
                className="bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
              />
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};

