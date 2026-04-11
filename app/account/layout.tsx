'use client';

import { Suspense } from 'react';
import { AuthProtect } from '@/components/AuthProtect';
import { Loader2 } from 'lucide-react';

function AuthProtectFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AuthProtectFallback />}>
      <AuthProtect>{children}</AuthProtect>
    </Suspense>
  );
}
