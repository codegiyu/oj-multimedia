import AuthLayout from '@/components/layout/AuthLayout';
import { ResetPasswordPageClient } from '@/components/section/admin/auth/ResetPasswordPageClient';
import { ResetPasswordFormSkeleton } from '@/components/section/admin/auth/ResetPasswordFormSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Create Your Admin Password',
  description: 'Complete your admin invitation by setting a password',
};

function AcceptInviteFallback() {
  return (
    <Card>
      <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
        <CardTitle className="text-2xl">Create Your Password</CardTitle>
        <CardDescription>Set a password to activate your admin account</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <ResetPasswordFormSkeleton />
      </CardContent>
    </Card>
  );
}

export default function AcceptInviteCreatePasswordPage() {
  return (
    <AuthLayout subtitle="">
      <Suspense fallback={<AcceptInviteFallback />}>
        <ResetPasswordPageClient variant="invite" />
      </Suspense>
    </AuthLayout>
  );
}
