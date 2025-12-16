'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { Heart, MessageSquare, User, Mail, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CommunityPageClient = () => {
  // TODO: Fetch data from API
  const testimonies = [
    {
      name: 'Sarah Johnson',
      testimony:
        'This platform has been a blessing to my spiritual journey. The devotionals and sermons have transformed my life.',
      date: '2 days ago',
    },
    {
      name: 'Michael Brown',
      testimony:
        'I found my calling through the inspiring messages here. Thank you for this amazing resource.',
      date: '5 days ago',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#5730D5]/5 to-[#8A2BE2]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5730D5]/10 mb-6">
            <Heart className="w-8 h-8 text-[#5730D5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Community</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Share testimonies, submit prayer requests, ask questions, and connect with fellow believers.
          </p>
        </div>
      </SectionContainer>

      {/* Prayer Request Form */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            title="Prayer Request"
            text="Submit your prayer requests and our community will pray with you"
            Icon={Heart}
          />
          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5730D5]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prayer Request
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5730D5]"
                    placeholder="Share your prayer request..."
                  />
                </div>
                <RegularBtn
                  type="submit"
                  text="Submit Prayer Request"
                  className="w-full bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white"
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      {/* Testimonies */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading
              title="Testimonies from Readers"
              text="Stories of transformation and blessing"
              Icon={MessageSquare}
            />
            <GhostBtn
              linkProps={{ href: '/community?tab=testimonies' }}
              className="hidden md:flex items-center gap-2 text-[#5730D5] hover:text-[#8A2BE2]">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </GhostBtn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonies.map((testimony, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">&ldquo;{testimony.testimony}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimony.name}</p>
                      <p className="text-sm text-muted-foreground">{testimony.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Other Features */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="More Community Features"
            text="Engage with our community in various ways"
            Icon={Heart}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <User className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ask A Pastor</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get answers to your spiritual questions from experienced pastors
              </p>
              <GhostBtn
                linkProps={{ href: '/community?tab=ask-pastor' }}
                className="text-sm text-[#5730D5]">
                Ask Question
              </GhostBtn>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Newsletter Archive</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse past newsletters and stay updated with our content
              </p>
              <GhostBtn
                linkProps={{ href: '/community?tab=newsletter' }}
                className="text-sm text-[#5730D5]">
                View Archive
              </GhostBtn>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#5730D5]/10 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#5730D5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Polls & Voting</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Participate in community polls and share your opinions
              </p>
              <GhostBtn
                linkProps={{ href: '/community?tab=polls' }}
                className="text-sm text-[#5730D5]">
                View Polls
              </GhostBtn>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};

