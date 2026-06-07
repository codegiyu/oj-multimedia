import AuthLayout from '@/components/layout/AuthLayout';
import { RequestPasswordResetFormSkeleton } from '@/components/section/admin/auth/RequestPasswordResetFormSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <AuthLayout subtitle="">
      <Card>
        <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <RequestPasswordResetFormSkeleton />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
