'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { UserPlus, CheckCircle } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { VendorApplicationForm } from '@/components/section/marketplace/VendorApplicationForm';

export function BecomeVendorPageClient() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Application received</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for applying to become a vendor. We will review your details and contact you
              shortly.
            </p>
            <RegularBtn
              variant="outline"
              linkProps={{ href: '/marketplace' }}
              text="Back to Marketplace"
            />
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Become a Vendor</h1>
            <p className="text-muted-foreground">
              Register to sell on our marketplace. Fill in your store and contact details below.
            </p>
          </div>

          <VendorApplicationForm onSuccess={() => setSubmitted(true)} />
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
