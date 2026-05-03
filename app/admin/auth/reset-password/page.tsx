import AuthLayout from '@/components/layout/AuthLayout';
import { ResetPasswordPageClient } from '@/components/section/admin/auth/ResetPasswordPageClient';
import { ResetPasswordFormSkeleton } from '@/components/section/admin/auth/ResetPasswordFormSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Reset Your Password',
  description: 'Enter your new password to complete the reset',
};

function ResetPasswordFallback() {
  return (
    <Card>
      <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Enter your new password to complete the reset process</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <ResetPasswordFormSkeleton />
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout subtitle="">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordPageClient />
      </Suspense>
    </AuthLayout>
  );
}
