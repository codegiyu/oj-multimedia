'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Music, DollarSign, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import { CompanyWhatsAppModal } from '@/components/section/shared/CompanyWhatsAppModal';
import type { PromotionPricingOption } from '@/lib/types/promotion';
import type { WhatsAppMessagePayload } from '@/lib/services/whatsappMessaging.service';

export interface PromoteYourSongProps {
  pricingOptions: PromotionPricingOption[];
}

const CUSTOM_PRICING_PLAN = {
  title: 'Custom promotion package',
  price: 'To be discussed',
  description: 'Tailored song promotion based on your goals and budget',
  features: [] as string[],
};

export const PromoteYourSong = ({ pricingOptions }: PromoteYourSongProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [messagePayload, setMessagePayload] = useState<WhatsAppMessagePayload | null>(null);
  const [modalTitle, setModalTitle] = useState('Song promotion');
  const [modalDescription, setModalDescription] = useState(
    'Continue on WhatsApp to request this package from the OJ Multimedia team.'
  );
  const [summaryLines, setSummaryLines] = useState<
    { label?: string; value: string; emphasis?: boolean }[]
  >([]);

  const openPlanModal = (option: PromotionPricingOption) => {
    setModalTitle('Promote your song');
    setModalDescription(
      'Review your selected package, then continue on WhatsApp to send a pre-filled request to our team.'
    );
    setSummaryLines([
      { value: option.title },
      { label: 'Price', value: option.price, emphasis: true },
      { label: 'Description', value: option.description },
    ]);
    setMessagePayload({
      type: 'promotion_plan',
      data: {
        plan: {
          title: option.title,
          price: option.price,
          description: option.description,
          features: option.features,
        },
      },
    });
    setModalOpen(true);
  };

  const openCustomPricingModal = () => {
    setModalTitle('Custom song promotion');
    setModalDescription(
      'Tell us about your goals on WhatsApp. We will help you build a package that fits your needs.'
    );
    setSummaryLines([
      { value: CUSTOM_PRICING_PLAN.title },
      { label: 'Price', value: CUSTOM_PRICING_PLAN.price, emphasis: true },
      { label: 'Description', value: CUSTOM_PRICING_PLAN.description },
    ]);
    setMessagePayload({
      type: 'promotion_plan',
      data: {
        inquiry: 'custom',
        plan: CUSTOM_PRICING_PLAN,
      },
    });
    setModalOpen(true);
  };

  return (
    <>
      <SectionComp
        id="promote-song"
        icon={Music}
        iconColor="accent"
        heading="Promote Your Song"
        subtext="Reach a wider audience and grow your fanbase with our promotional packages"
        contentProps={{ enableAnimation: false }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option._id ?? index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Card
                className={`card-interactive relative ${
                  option.isFeatured ? 'border-primary border-2' : ''
                }`}>
                {option.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div
                      className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                        option.isFeatured
                          ? 'bg-primary/20'
                          : 'bg-gradient-to-br from-primary/20 to-primary/10'
                      }`}>
                      <Star className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{option.title}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold text-foreground">{option.price}</span>
                    </div>
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
                    variant={option.isFeatured ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => openPlanModal(option)}>
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Need Custom Pricing?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact us to discuss a custom package that fits your needs
                    </p>
                  </div>
                </div>
                <Button variant="accent" onClick={openCustomPricingModal}>
                  Contact Us
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
