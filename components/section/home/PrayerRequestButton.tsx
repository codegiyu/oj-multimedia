'use client';

import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const PrayerRequestButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <RegularBtn
        linkProps={{ href: '/community' }}
        className="bg-gradient-to-r from-[#5730D5] to-[#8A2BE2] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all rounded-full px-6 py-3 flex items-center gap-2">
        <Heart className="w-5 h-5" />
        <span className="font-semibold">Prayer Request</span>
      </RegularBtn>
    </div>
  );
};

