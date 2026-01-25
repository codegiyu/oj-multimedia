'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  hideTextOnMobile?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  showText = true,
  hideTextOnMobile = true,
  className = '',
  href = '/',
}: LogoProps) {
  const textClasses = hideTextOnMobile ? 'hidden sm:block' : '';
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo-badge.png"
        alt="OJ Multimedia Logo"
        width={40}
        height={40}
        className="w-10 h-10 object-contain"
      />
      {showText && (
        <span className={`font-display font-bold text-xl ${textClasses}`}>OJ Multimedia</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
