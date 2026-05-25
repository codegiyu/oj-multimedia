'use client';

import { Fragment } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  multilineParagraphItem,
  multilineParagraphStaggerContainer,
  multilineTextInView,
} from '@/lib/constants/multilineTextMotion';
import {
  normalizeMultilineInput,
  splitIntoParagraphs,
  splitParagraphLines,
} from '@/lib/utils/multilineText';

export interface MultilineTextProps {
  text?: string | null;
  className?: string;
  paragraphClassName?: string;
  /** Stagger paragraph entrances (editorial detail pages only). */
  animate?: boolean;
}

function ParagraphLines({ paragraph }: { paragraph: string }) {
  const lines = splitParagraphLines(paragraph);

  return (
    <>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Renders textarea-like content with paragraph and line-break support.
 * - Empty lines separate paragraphs
 * - Single newlines inside a paragraph become <br />
 */
export function MultilineText({
  text,
  className,
  paragraphClassName,
  animate = false,
}: MultilineTextProps) {
  const normalized = normalizeMultilineInput(text);

  if (!normalized) return null;

  const paragraphs = splitIntoParagraphs(text);

  if (!animate) {
    return (
      <div className={cn('space-y-4', className)}>
        {paragraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex} className={paragraphClassName}>
            <ParagraphLines paragraph={paragraph} />
          </p>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('space-y-4', className)}
      variants={multilineParagraphStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={multilineTextInView}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <motion.p
          key={paragraphIndex}
          variants={multilineParagraphItem}
          className={paragraphClassName}>
          <ParagraphLines paragraph={paragraph} />
        </motion.p>
      ))}
    </motion.div>
  );
}
