'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import { CompanyWhatsAppModal } from '@/components/section/shared/CompanyWhatsAppModal';
import { getFeaturedIcon } from '@/lib/utils/promotionIconMap';
import type { FeaturedOption } from '@/lib/types/promotion';
import type { WhatsAppMessagePayload } from '@/lib/services/whatsappMessaging.service';

export interface GetFeaturedProps {
  featuredOptions: FeaturedOption[];
}

const PACKAGE_DEALS_PLAN = {
  title: 'Featured placement package',
  duration: 'Flexible',
  price: 'To be discussed',
  description: 'Combine multiple featured placements for maximum impact',
  features: [] as string[],
};

export const GetFeatured = ({ featuredOptions }: GetFeaturedProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [messagePayload, setMessagePayload] = useState<WhatsAppMessagePayload | null>(null);
  const [modalTitle, setModalTitle] = useState('Get featured');
  const [modalDescription, setModalDescription] = useState(
    'Continue on WhatsApp to request this placement from the OJ Multimedia team.'
  );
  const [summaryLines, setSummaryLines] = useState<
    { label?: string; value: string; emphasis?: boolean }[]
  >([]);

  const openPlanModal = (option: FeaturedOption) => {
    setModalTitle('Get featured');
    setModalDescription(
      'Review your selected placement, then continue on WhatsApp to send a pre-filled request to our team.'
    );
    setSummaryLines([
      { value: option.title },
      { label: 'Duration', value: option.duration },
      { label: 'Price', value: option.price, emphasis: true },
      { label: 'Description', value: option.description },
    ]);
    setMessagePayload({
      type: 'featured_plan',
      data: {
        plan: {
          title: option.title,
          duration: option.duration,
          price: option.price,
          description: option.description,
          features: option.features,
        },
      },
    });
    setModalOpen(true);
  };

  const openPackagesModal = () => {
    setModalTitle('Featured placement packages');
    setModalDescription(
      'Discuss combining multiple placements on WhatsApp. We will help you choose the best package.'
    );
    setSummaryLines([
      { value: PACKAGE_DEALS_PLAN.title },
      { label: 'Duration', value: PACKAGE_DEALS_PLAN.duration },
      { label: 'Price', value: PACKAGE_DEALS_PLAN.price, emphasis: true },
      { label: 'Description', value: PACKAGE_DEALS_PLAN.description },
    ]);
    setMessagePayload({
      type: 'featured_plan',
      data: {
        inquiry: 'packages',
        plan: PACKAGE_DEALS_PLAN,
      },
    });
    setModalOpen(true);
  };

  return (
    <>
      <SectionComp
        id="get-featured"
        icon={Star}
        iconColor="accent"
        heading="Get Featured and Boost Your Visibility"
        subtext="Stand out from the crowd with our featured placement options. Get noticed by thousands of potential listeners."
        contentProps={{ enableAnimation: false }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredOptions.map((option, index) => {
            const Icon = getFeaturedIcon(option.icon);
            return (
              <motion.div
                key={option._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}>
                <Card className="card-interactive">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{option.title}</h3>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl font-bold text-foreground">{option.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{option.duration}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant="outline"
                      size="lg"
                      onClick={() => openPlanModal(option)}>
                      Get Featured
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Multiple Feature Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Combine multiple features for maximum impact. Contact us for package deals.
                    </p>
                  </div>
                </div>
                <Button variant="accent" onClick={openPackagesModal}>
                  Contact for Packages
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </SectionComp>

      <CompanyWhatsAppModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
        description={modalDescription}
        messagePayload={messagePayload}
        summaryLines={summaryLines}
      />
    </>
  );
};
