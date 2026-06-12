'use client';

import { Suspense, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { AuthProtect } from '@/components/AuthProtect';
import { UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { VendorApplicationForm } from '@/components/section/marketplace/VendorApplicationForm';

function AuthProtectFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function BecomeVendorContent() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application received</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for applying to become a vendor. We will review your details and contact you
            shortly. You can check your vendor portal for status updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <RegularBtn
              variant="default"
              linkProps={{ href: '/account/vendor' }}
              text="Go to vendor portal"
            />
            <RegularBtn
              variant="outline"
              linkProps={{ href: '/marketplace' }}
              text="Back to Marketplace"
            />
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer className="marketplace-page-top">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <UserPlus className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">
            Register to sell on our marketplace. Sign in, then fill in your store and contact
            details below.
          </p>
        </div>

        <VendorApplicationForm onSuccess={() => setSubmitted(true)} />
      </div>
    </SectionContainer>
  );
}

export function BecomeVendorPageClient() {
  return (
    <MainLayout>
      <Suspense fallback={<AuthProtectFallback />}>
        <AuthProtect>
          <BecomeVendorContent />
        </AuthProtect>
      </Suspense>
    </MainLayout>
  );
}
