'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { BookOpen } from 'lucide-react';

export const StorySection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer background="muted">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image/Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground">Our Journey</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-xl -z-10" />
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}>
          <SectionHeading
            title="Our Purpose"
            text="Transforming lives through creative expression and technology-driven storytelling"
            className="text-start mb-8"
            Icon={BookOpen}
          />

          <div className="grid gap-4 text-muted-foreground">
            <p>
              OHEJUIRA-Multimedia is a dynamic, innovation-driven creative company established with
              a clear purpose: Serving humanity through innovation in entertainment and technology.
            </p>
            <p>
              We specialize in creating, producing, and distributing impactful multimedia content
              across various formats—Audio, Video, Graphics, Text, and Interactive Media. Our
              commitment is to empower creators, inspire audiences, and elevate storytelling through
              excellence, innovation, and technology.
            </p>
            <p>
              Our purpose is to transform lives through creative expression and technology-driven
              storytelling while offering world class production, design, and distribution services.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
