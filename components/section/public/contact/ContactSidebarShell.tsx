'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';

interface ContactSidebarShellProps {
  children: React.ReactNode;
}

export function ContactSidebarShell({ children }: ContactSidebarShellProps) {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer className="bg-secondary text-secondary-foreground h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif text-accent">
          Contact Information
        </h2>
        <p className="text-secondary-foreground/80 mb-8">
          Reach out through any of these channels.
        </p>
        {children}
      </motion.div>
    </SectionContainer>
  );
}
