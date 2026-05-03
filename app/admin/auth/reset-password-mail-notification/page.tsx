import AuthLayout from '@/components/layout/AuthLayout';
import { ResetPasswordMailNotificationClient } from '@/components/section/admin/auth/ResetPasswordMailNotificationClient';
import { ResetPasswordMailNotificationSkeleton } from '@/components/section/admin/auth/ResetPasswordMailNotificationSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Check Your Email',
  description: 'Password reset email sent',
};

function MailNotificationFallback() {
  return (
    <Card>
      <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          Check Your Email
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a password reset link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <ResetPasswordMailNotificationSkeleton />
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordMailNotificationPage() {
  return (
    <AuthLayout subtitle="">
      <Suspense fallback={<MailNotificationFallback />}>
        <ResetPasswordMailNotificationClient />
      </Suspense>
    </AuthLayout>
  );
}
