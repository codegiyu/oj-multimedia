'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQueryState, parseAsString } from 'nuqs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { callApi } from '@/lib/services/callApi';
import { toast } from '@/components/atoms/Toast';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Mail, CheckCircle2 } from 'lucide-react';
import { RESET_LINK_EXPIRATION_MINUTES } from '@/lib/constants/authLinks';

export function ResetPasswordMailNotificationClient() {
  const [email] = useQueryState('email', parseAsString.withDefault(''));
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const handleResend = async () => {
    if (!email || !canResend) return;
    setResendLoading(true);
    const { data, error, message } = await callApi('AUTH_REQUEST_PASSWORD_RESET', {
      payload: { email, scope: 'reset-password', accessType: 'console' },
    });
    setResendLoading(false);
    if (error || !data) {
      toast({
        title: 'Resend failed',
        description: message || 'Failed to resend password reset email. Please try again.',
        variant: 'error',
      });
      return;
    }
    toast({
      title: 'Email sent',
      description: 'Password reset email has been sent again. Please check your inbox.',
      variant: 'success',
    });
    setCanResend(false);
    setTimeRemaining(60);
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeRemaining]);

  return (
    <Card>
      <CardHeader className="space-y-0 border-b border-foreground/20 pt-6 pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          Check Your Email
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a password reset link to {email || 'your email address'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in{' '}
              {RESET_LINK_EXPIRATION_MINUTES} minutes.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email? You can request another one in{' '}
                  <span className="font-semibold text-foreground">{timeRemaining}</span> seconds.
                </p>
              ) : (
                <RegularBtn
                  text={resendLoading ? 'Sending...' : 'Resend Email'}
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={resendLoading}
                  loading={resendLoading}
                />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/admin/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
