'use client';

import { ReactNode, useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { LoginModal } from '@/components/auth/LoginModal';

interface CommunitySectionFrameProps {
  highlights: ReactNode;
  poll: ReactNode;
}

export function CommunitySectionFrame({ highlights, poll }: CommunitySectionFrameProps) {
  const user = useAuthStore(state => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <section id="community" className="py-10 md:py-24 bg-muted/30 overflow-hidden scroll-mt-header">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <h2 className="section-header">Community</h2>
              <p className="text-muted-foreground text-sm">Connect with creators</p>
            </div>
          </div>
          {user ? (
            <Button variant="secondary" className="gap-2 w-full sm:w-auto min-h-11" asChild>
              <Link href="/community">
                Visit community
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                className="gap-2 w-full sm:w-auto min-h-11"
                onClick={() => setIsLoginModalOpen(true)}>
                Join Community
                <ArrowRight className="w-4 h-4" />
              </Button>
              <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {highlights}
          {poll}
        </div>
      </div>
    </section>
  );
}
