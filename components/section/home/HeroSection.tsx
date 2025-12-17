'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ArrowRight, Play, Heart, BookOpen, Mic, Cross } from 'lucide-react';

export const HeroSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Colorful Gradient Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/95 via-[#3B82F6]/90 to-[#2563EB]/95" />

      {/* Animated Gradient Overlay */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 via-transparent to-[#2563EB]/20 bg-[length:200%_200%]"
      />

      {/* Floating Elements with Color */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-[15%] w-40 h-40 rounded-full bg-white/15 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-[20%] w-24 h-24 rounded-full bg-white/10 blur-lg"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-[25%] w-36 h-36 rounded-full bg-white/10 blur-xl"
        />
      </div>

      <SectionContainer className="relative z-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Cross className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Christian Multimedia Blog</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-sans leading-[1.1] drop-shadow-lg">
            Strengthen Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Faith</span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={siteLoading ? {} : { pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 300 16"
                fill="none">
                <motion.path
                  d="M5 12C80 4 220 4 295 12"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeOpacity="0.8"
                />
              </motion.svg>
            </span>
            <br />
            Through Gospel Content
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-light text-white/90 mb-8 font-sans max-w-4xl mx-auto leading-relaxed">
            Discover inspiring music, powerful sermons, daily devotionals, and Christian resources
            to enrich your spiritual journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <RegularBtn
              linkProps={{ href: '/music' }}
              className="px-10 py-6 text-lg bg-white text-[#2563EB] hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl transition-all group"
              RightIcon={ArrowRight}
              rightIconProps={{
                className: 'size-5 group-hover:translate-x-1 transition-transform',
              }}
              text="Explore Music"
            />

            <GhostBtn
              linkProps={{ href: '/sermons' }}
              className="flex items-center gap-3 px-8 py-6 text-white border-2 border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all group">
              <span className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-5 h-5 ml-0.5 text-white" />
              </span>
              <span className="font-semibold">Listen to Sermons</span>
            </GhostBtn>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { icon: Mic, label: 'Sermons', href: '/sermons' },
              { icon: BookOpen, label: 'Devotionals', href: '/devotionals' },
              { icon: Heart, label: 'Prayer Requests', href: '/prayer-requests' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={siteLoading ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group">
                <GhostBtn
                  linkProps={{ href: feature.href }}
                  className="flex flex-col items-center gap-3 p-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all">
                  <feature.icon className="w-8 h-8 text-white" />
                  <span className="text-sm font-semibold text-white">{feature.label}</span>
                </GhostBtn>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
};
