/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SectionContentProps {
  children: ReactNode;
  className?: string;
  asList?: boolean;
  listClassName?: string;
  itemClassName?: string;
  containerVariants?: any;
  itemVariants?: any;
  enableAnimation?: boolean;
}

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const SectionContent = ({
  children,
  className,
  asList = false,
  listClassName,
  itemClassName,
  containerVariants = defaultContainerVariants,
  itemVariants = defaultItemVariants,
  enableAnimation = false,
}: SectionContentProps) => {
  if (asList && Array.isArray(children)) {
    const content = enableAnimation ? (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className={cn(listClassName)}>
        {children.map((child, index) => (
          <motion.div key={index} variants={itemVariants} className={itemClassName}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <div className={cn(listClassName)}>
        {children.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    );

    return <div className={cn(className)}>{content}</div>;
  }

  // For non-list content, wrap in motion.div if animation is enabled
  if (enableAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(className)}>
        {children}
      </motion.div>
    );
  }

  return <div className={cn(className)}>{children}</div>;
};
