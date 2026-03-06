import { LoginPageLayout } from '@/components/auth/LoginPageLayout';
import { LoginPageContent } from '@/components/auth/LoginPageContent';
import { LoginPageSkeleton } from '@/components/auth/LoginPageSkeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <LoginPageLayout>
      <Suspense fallback={<LoginPageSkeleton />}>
        <LoginPageContent />
      </Suspense>
    </LoginPageLayout>
  );
}
