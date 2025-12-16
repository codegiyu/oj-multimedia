'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Download, BookOpen, FileText, Headphones, Image, ShoppingBag, ArrowDown } from 'lucide-react';
import Link from 'next/link';

export const ResourcesPageClient = () => {
  // TODO: Fetch data from API
  const resources = [
    {
      category: 'Free E-books',
      icon: BookOpen,
      items: [
        { title: 'Prayer Guide', downloads: '1.2K', slug: 'prayer-guide' },
        { title: 'Bible Study Methods', downloads: '890', slug: 'bible-study-methods' },
      ],
    },
    {
      category: 'Sermon Templates',
      icon: FileText,
      items: [
        { title: 'Church Flyer Template', downloads: '650', slug: 'church-flyer' },
        { title: 'Event Poster Template', downloads: '420', slug: 'event-poster' },
      ],
    },
    {
      category: 'Free Beats & Loops',
      icon: Headphones,
      items: [
        { title: 'Worship Beat Pack', downloads: '2.1K', slug: 'worship-beats' },
        { title: 'Gospel Instrumentals', downloads: '1.8K', slug: 'gospel-instrumentals' },
      ],
    },
    {
      category: 'Christian Wallpapers',
      icon: Image,
      items: [
        { title: 'Inspirational Quotes', downloads: '3.5K', slug: 'inspirational-quotes' },
        { title: 'Bible Verse Wallpapers', downloads: '2.9K', slug: 'bible-verses' },
      ],
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Download className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Free downloads, e-books, templates, beats, wallpapers, and more to support your ministry.
          </p>
        </div>
      </SectionContainer>

      {/* Free Downloads */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Free Downloads"
            text="Access free resources to support your faith journey"
            Icon={Download}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 flex items-center justify-center">
                      <resource.icon className="w-6 h-6 text-[#5730D5]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{resource.category}</h3>
                  </div>
                  <div className="space-y-4">
                    {resource.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.downloads} downloads</p>
                        </div>
                        <GhostBtn className="text-[#5730D5] hover:text-[#8A2BE2]">
                          <ArrowDown className="w-4 h-4" />
                        </GhostBtn>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Affiliate Products */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Affiliate Products"
            text="Recommended books, gadgets, and resources"
            Icon={ShoppingBag}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Product Name</h3>
                  <p className="text-sm text-muted-foreground mb-4">Product description here</p>
                  <RegularBtn
                    text="View Product"
                    className="w-full bg-[#5730D5] hover:bg-[#8A2BE2] text-white"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};

