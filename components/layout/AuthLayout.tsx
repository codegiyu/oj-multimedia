'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicSiteHref } from '@/lib/constants/texts';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ children, subtitle = 'Admin Dashboard' }: AuthLayoutProps) {
  const publicSiteHref = getPublicSiteHref();
  const publicSiteIsExternal = publicSiteHref.startsWith('http');

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="w-fit flex flex-col items-center mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <Link
            href={publicSiteHref}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            {...(publicSiteIsExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <Image
              src="/images/logo-badge.png"
              alt=""
              width={256}
              height={64}
              className="h-16 w-auto shrink-0"
              priority
            />
            <span className="text-left text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
              OJ Multimedia Admin
            </span>
          </Link>
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
