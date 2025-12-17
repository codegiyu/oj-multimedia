'use client';

import { debounce } from '@/lib/utils/general';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Cross } from 'lucide-react';

const BASE_LOAD_TIME = 2000; // ms
const TRANSITION_DURATION = 0.8; // s

export const LoadAnimationScreen = () => {
  const {
    siteLoading,
    actions: { setSiteLoading },
  } = useSiteStore(state => state);
  const [pageLoaded, setPageLoaded] = useState(false);

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

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      {siteLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={pageLoaded ? { opacity: 0 } : {}}
          transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
          onAnimationComplete={() => setSiteLoading(false)}
          className="w-full h-screen bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#2563EB] grid place-items-center fixed inset-0 z-[99]">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={pageLoaded ? {} : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <Cross className="w-10 h-10 text-white" />
              </div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={pageLoaded ? {} : { y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white font-sans mb-2">
                OJ Multimedia
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={pageLoaded ? {} : { y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/80 text-sm md:text-base">
                Strengthening Faith Through Content
              </motion.p>
            </motion.div>
            {!pageLoaded && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: BASE_LOAD_TIME / 1000, ease: 'linear' }}
                className="h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="h-full w-1/3 bg-white rounded-full"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};
