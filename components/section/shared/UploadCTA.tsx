'use client';

import { Upload, Music, Video, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useContentSubmitWhatsApp } from '@/components/section/shared/ContentSubmitWhatsAppTrigger';
import { useOpenShareTestimony } from '@/lib/hooks/useOpenShareTestimony';

export const UploadCTA = () => {
  const musicSubmit = useContentSubmitWhatsApp('music');
  const videoSubmit = useContentSubmitWhatsApp('video');
  const openShareTestimony = useOpenShareTestimony();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-8 md:p-12">
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
              Publishing is curated by our team. Reach out on WhatsApp to submit music, videos, or
              stories for review.
            </p>

            <div className="flex flex-col w-full sm:flex-row sm:flex-wrap justify-center gap-4 mb-8">
              <RegularBtn
                type="button"
                variant="cta"
                size="lg"
                className="gap-2 w-full sm:w-auto min-h-11 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                onClick={musicSubmit.openSubmitModal}>
                <Music className="w-5 h-5" />
                Submit music
              </RegularBtn>
              <RegularBtn
                type="button"
                variant="cta"
                size="lg"
                className="gap-2 w-full sm:w-auto min-h-11 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                onClick={videoSubmit.openSubmitModal}>
                <Video className="w-5 h-5" />
                Submit video
              </RegularBtn>
              <RegularBtn
                type="button"
                variant="cta"
                size="lg"
                className="gap-2 w-full sm:w-auto min-h-11 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
                onClick={openShareTestimony}>
                <BookOpen className="w-5 h-5" />
                Share Testimony
              </RegularBtn>
            </div>

            <p className="text-primary-foreground/60 text-sm">
              Admin-reviewed publishing • We reply via your chosen channel • Analytics when live
            </p>
          </div>
        </motion.div>
      </div>
      {musicSubmit.modal}
      {videoSubmit.modal}
    </section>
  );
};
