'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Music, Mic, Star, Mail, DollarSign } from 'lucide-react';

export const PromotePageClient = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <SectionContainer className="py-16 md:py-20 bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2563EB]/10 mb-6">
            <Star className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            OHEJUIRA Website Pricing
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Transparent pricing for all our services. Some prices can be negotiated (not all
            though)!
          </p>
          <p className="text-sm text-muted-foreground italic">
            For more info, contact us at ohemultimedia@gmail.com or call +234 705 692 3436 / +234
            913 667 0466 / +234 707 324 4801
          </p>
        </div>
      </SectionContainer>

      {/* Pricing Tables */}
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Music Upload & Promotions */}
          <div>
            <SectionHeading
              title="1. Music Upload & Promotions"
              text="Promote your music and reach a wider audience"
              Icon={Music}
            />
            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Service
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          Price (₦)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Upload Your Song (Basic Listing)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          5,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Featured Song (Homepage Banner)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          8,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Artist Spotlight Feature
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          7,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">Music Video Feature</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          5,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">Lyrics Page Creation</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          3,500
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Instrumentals / Beats Upload
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          2,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sermon Uploads */}
          <div>
            <SectionHeading
              title="2. Sermon Uploads"
              text="Share your sermons with our community"
              Icon={Mic}
            />
            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Service
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          Price (₦)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">Upload Audio Sermon</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          1,000 (per sermon)
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">Upload Video Sermon</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          2,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Featured Sermon Placement
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          4,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Pastor Spotlight Feature
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          7,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promotions & Advert Slots */}
          <div>
            <SectionHeading
              title="3. Promotions & Advert Slots"
              text="Get maximum visibility for your content"
              Icon={Star}
            />
            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Promotion Type
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          Price (₦)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Homepage Slider Banner (1 Week)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          10,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Trending Section Feature (1 Week)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          8,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Sponsored Post (News & Lifestyle Section)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          8,000
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Social Media Promo (Facebook + Instagram)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          5,000 – 10,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Marketplace Fees */}
          <div>
            <SectionHeading
              title="4. Vendor Marketplace Fees"
              text="Join our marketplace and start selling"
              Icon={DollarSign}
            />
            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Vendor Service
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          Price (₦)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">
                          Vendor Registration (lifetime)
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          4,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>

      {/* Note Section */}
      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Important Note</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>Some prices can be negotiated (not all though)!</strong> Contact us to
                    discuss your specific needs and see if we can work out a custom pricing
                    arrangement.
                  </p>
                  <div className="mt-6 space-y-2">
                    <p className="text-muted-foreground">
                      <strong>For more info, contact us:</strong>
                    </p>
                    <ul className="list-none space-y-2 text-muted-foreground">
                      <li>
                        <strong>Email:</strong>{' '}
                        <a
                          href="mailto:ohemultimedia@gmail.com"
                          className="text-primary hover:underline">
                          ohemultimedia@gmail.com
                        </a>
                      </li>
                      <li>
                        <strong>Phone:</strong> +234 705 692 3436 / +234 913 667 0466 / +234 707 324
                        4801
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <RegularBtn
                      linkProps={{ href: '/contact' }}
                      text="Contact Us"
                      RightIcon={Mail}
                      rightIconProps={{ className: 'size-4' }}
                      className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </MainLayout>
  );
};
