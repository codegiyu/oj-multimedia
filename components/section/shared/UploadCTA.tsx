'use client';

import { Upload, Music, Video, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export const UploadCTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-primary-foreground" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-primary-foreground" />
            <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full border-4 border-primary-foreground" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Share Your Creativity
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Upload your music, videos, or share your story and reach thousands of listeners. Join
              our growing community of creators.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <RegularBtn
                variant="cta"
                size="lg"
                className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                linkProps={{ href: '/community/promote-your-content' }}>
                <Music className="w-5 h-5" />
                Upload Music
              </RegularBtn>
              <RegularBtn
                variant="cta"
                size="lg"
                className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                linkProps={{ href: '/community/promote-your-content' }}>
                <Video className="w-5 h-5" />
                Upload Video
              </RegularBtn>
              <RegularBtn
                variant="cta"
                size="lg"
                className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                linkProps={{ href: '/community/testimonies' }}>
                <BookOpen className="w-5 h-5" />
                Share Testimony
              </RegularBtn>
            </div>

            <p className="text-primary-foreground/60 text-sm">
              Free to upload • Instant publishing • Analytics included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
