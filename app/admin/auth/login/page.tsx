import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/section/admin/auth/LoginForm';
import { LoginFormSkeleton } from '@/components/section/admin/auth/LoginFormSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard',
};

export default function AdminLoginPage() {
  return (
    <AuthLayout subtitle="Sign in to your account">
      <Card>
        <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
