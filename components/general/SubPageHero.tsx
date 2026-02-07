'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DynamicIcon, LucideIconName } from './DynamicIcon';

interface SubPageHeroProps {
  /** Main title of the sub-page */
  title: string;
  /** Optional highlighted word in the title */
  titleHighlight?: string;
  /** Description text below the title */
  description: string;
  /** Badge text to display above the title */
  badgeText?: string;
  /** Icon name to display in the badge */
  badgeIcon?: LucideIconName;
  /** URL for the back button (parent page) */
  backUrl: string;
  /** Text for the back button */
  backLabel?: string;
  /** Optional additional stats or info to display */
  stats?: Array<{
    icon?: LucideIconName;
    text: string;
  }>;
  /** Optional background image URL */
  backgroundImage?: string;
}

export const SubPageHero = ({
  title,
  titleHighlight,
  description,
  // badgeText,
  // badgeIcon,
  backUrl,
  backLabel = 'Back to News',
  stats,
  backgroundImage,
}: SubPageHeroProps) => {
  return (
    <section className="relative pt-[9.25rem] md:pt-[11.25rem] pb-12 md:pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Optional background image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
        </div>
      )}

      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6">
          <Link href={backUrl}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Button>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          {/* {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              {badgeIcon && <DynamicIcon name={badgeIcon} props={{ className: 'w-4 h-4' }} />}
              <span className="text-sm font-medium">{badgeText}</span>
            </div>
          )} */}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            {titleHighlight && title.includes(titleHighlight) ? (
              <>
                {title.substring(0, title.indexOf(titleHighlight))}
                <span className="text-primary">{titleHighlight}</span>
                {title.substring(title.indexOf(titleHighlight) + titleHighlight.length)}
              </>
            ) : (
              title
            )}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">{description}</p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2">
                    {stat.icon && (
                      <DynamicIcon name={stat.icon} props={{ className: 'w-4 h-4 text-primary' }} />
                    )}
                    <span>{stat.text}</span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
