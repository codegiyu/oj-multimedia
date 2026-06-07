import AuthLayout from '@/components/layout/AuthLayout';
import { LoginFormSkeleton } from '@/components/section/admin/auth/LoginFormSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <AuthLayout subtitle="">
      <Card>
        <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <LoginFormSkeleton />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
