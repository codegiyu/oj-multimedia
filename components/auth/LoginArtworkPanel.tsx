'use client';

import Link from 'next/link';
import { FillImage, FixedImage } from '@/components/general/FillImage';
import { LOGIN_ARTWORK_DESCRIPTION, LOGIN_ARTWORK_TITLE } from '@/components/auth/loginConstants';

interface LoginArtworkPanelProps {
  title?: string;
  description?: string;
  /** When set, the logo badge links to this internal path (login page exit). */
  logoHref?: string;
  className?: string;
}

export function LoginArtworkPanel({
  title = LOGIN_ARTWORK_TITLE,
  description = LOGIN_ARTWORK_DESCRIPTION,
  logoHref,
  className = 'hidden md:block relative overflow-hidden',
}: LoginArtworkPanelProps) {
  const logo = (
    <FixedImage
      src="/images/logo-badge.png"
      alt={logoHref ? '' : 'OJ Multimedia'}
      width={64}
      height={64}
      className="h-16 w-auto"
    />
  );

  return (
    <div className={className}>
      <FillImage
        src="/images/signin-artwork.jpg"
        alt=""
        priority
        sizes="50vw"
        className="object-cover object-left"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/20 via-dark/20 to-dark/20" />
      <div className="relative z-10 flex flex-col items-start justify-between p-6 h-full min-h-[500px] text-white">
        <div>
          {logoHref ? (
            <Link
              href={logoHref}
              aria-label="OJ Multimedia home"
              className="inline-block rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent">
              {logo}
            </Link>
          ) : (
            logo
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 drop-shadow-sm">{title}</h2>
          <p className="text-white/95 text-base max-w-sm drop-shadow-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
