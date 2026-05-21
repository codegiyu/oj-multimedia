'use client';

import { debounce } from '@/lib/utils/general';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import BackgroundPaths from '@/components/kokonutui/background-paths';
import Image from 'next/image';

const BASE_LOAD_TIME = 800; // ms — short gate so LCP is not blocked on repeat visits
const TRANSITION_DURATION = 0.8; // s
const TEXT_ANIMATION_DELAY = 0.5; // s - delay before text animates in

export const LoadAnimationScreen = () => {
  const {
    siteLoading,
    actions: { setSiteLoading },
  } = useSiteStore(state => state);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      await debounce(BASE_LOAD_TIME);
      setPageLoaded(true);
    };

    // If already loaded (from cache)
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Show text after a delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, TEXT_ANIMATION_DELAY * 1000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {siteLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={pageLoaded ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (pageLoaded) {
              setSiteLoading(false);
            }
          }}
          className="w-full h-screen bg-white grid place-items-center fixed inset-0 z-[99] overflow-hidden">
          {/* Background Paths */}
          <BackgroundPaths
            title=""
            showTitle={false}
            gradientColors={{
              primary: 'hsl(16, 90%, 58%)',
              middle: 'hsl(24, 100%, 65%)',
              accent: 'hsl(45, 93%, 58%)',
            }}
            opacity={1}
            className="absolute inset-0"
          />

          {/* Content */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={pageLoaded ? {} : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6">
              {/* Logo and Text Container */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {/* Logo Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={pageLoaded ? {} : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <Image
                    src="/images/logo-badge.png"
                    alt="OJ Multimedia Logo"
                    width={50}
                    height={50}
                    className="w-12 h-12 md:w-14 md:h-14 object-contain"
                  />
                </motion.div>
                {/* Animated Text */}
                <AnimatePresence>
                  {showText && !pageLoaded && (
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="font-display font-bold text-2xl md:text-3xl text-primary-foreground">
                      OJ Multimedia
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={pageLoaded ? {} : { y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-primary-foreground/80 text-sm md:text-base">
                Strengthening Faith Through Content
              </motion.p>
            </motion.div>
            {!pageLoaded && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: BASE_LOAD_TIME / 1000, ease: 'linear' }}
                className="h-1 bg-primary-foreground/30 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="h-full w-1/3 bg-primary-foreground rounded-full"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
