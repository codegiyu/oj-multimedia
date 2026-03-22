'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ children, subtitle = 'Admin Dashboard' }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="w-fit flex flex-col items-center mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/images/logo-badge.png"
            alt="OJ Multimedia"
            width={256}
            height={64}
            className="h-16 w-auto"
            priority
          />
        </div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
          {subtitle}
        </h2>
      </div>

      {/* Content */}
      <div className="w-full max-w-md grid gap-8">{children}</div>

      {/* Footer */}
      <div className="w-full grid gap-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </main>
  );
}
