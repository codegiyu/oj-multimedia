'use client';

import { Fragment } from 'react';
import { motion } from 'motion/react';
import { MultilineText } from '@/components/general/MultilineText';
import { cn } from '@/lib/utils';
import {
  multilineHeadingItem,
  multilineParagraphItem,
  multilineParagraphStaggerContainer,
  multilineTextInView,
} from '@/lib/constants/multilineTextMotion';
import {
  normalizeMultilineInput,
  splitIntoParagraphs,
  splitParagraphLines,
} from '@/lib/utils/multilineText';

export type StructuredProseContentData = {
  introduction?: string;
  sections?: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
  conclusion?: string;
};

function isStructuredProseContent(value: unknown): value is StructuredProseContentData {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type AnimatedBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string; className?: string };

function collectAnimatedBlocks(
  content: StructuredProseContentData,
  classNames: {
    introductionClassName?: string;
    paragraphClassName?: string;
    conclusionClassName?: string;
  }
): AnimatedBlock[] {
  const blocks: AnimatedBlock[] = [];

  if (content.introduction?.trim()) {
    for (const paragraph of splitIntoParagraphs(content.introduction)) {
      blocks.push({
        kind: 'paragraph',
        text: paragraph,
        className: cn('text-lg text-foreground leading-relaxed', classNames.introductionClassName),
      });
    }
  }

  for (const section of content.sections ?? []) {
    if (section.heading?.trim()) {
      blocks.push({ kind: 'heading', text: section.heading });
    }

    for (const paragraph of section.paragraphs) {
      if (!paragraph.trim()) continue;

      for (const part of splitIntoParagraphs(paragraph)) {
        blocks.push({
          kind: 'paragraph',
          text: part,
          className: cn('text-base text-foreground leading-relaxed', classNames.paragraphClassName),
        });
      }
    }
  }

  if (content.conclusion?.trim()) {
    for (const paragraph of splitIntoParagraphs(content.conclusion)) {
      blocks.push({
        kind: 'paragraph',
        text: paragraph,
        className: cn(
          'text-lg text-foreground leading-relaxed font-medium',
          classNames.conclusionClassName
        ),
      });
    }
  }

  return blocks;
}

function AnimatedParagraph({ text, className }: { text: string; className?: string }) {
  const lines = splitParagraphLines(text);

  return (
    <motion.p variants={multilineParagraphItem} className={cn('mb-4 last:mb-0', className)}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </motion.p>
  );
}

export interface StructuredProseContentProps {
  content?: string | StructuredProseContentData | null;
  className?: string;
  introductionClassName?: string;
  paragraphClassName?: string;
  conclusionClassName?: string;
  headingClassName?: string;
  /** Stagger block entrances across intro, sections, and conclusion. */
  animate?: boolean;
}

export function StructuredProseContent({
  content,
  className,
  introductionClassName,
  paragraphClassName,
  conclusionClassName,
  headingClassName,
  animate = false,
}: StructuredProseContentProps) {
  if (content == null) return null;

  if (typeof content === 'string') {
    if (!normalizeMultilineInput(content)) return null;

    return (
      <MultilineText
        text={content}
        animate={animate}
        className={className}
        paragraphClassName={paragraphClassName ?? introductionClassName}
      />
    );
  }

  if (!isStructuredProseContent(content)) return null;

  const hasIntro = Boolean(content.introduction?.trim());
  const hasSections = Boolean(content.sections?.some(s => s.paragraphs?.some(p => p.trim())));
  const hasConclusion = Boolean(content.conclusion?.trim());

  if (!hasIntro && !hasSections && !hasConclusion) return null;

  if (animate) {
    const blocks = collectAnimatedBlocks(content, {
      introductionClassName,
      paragraphClassName,
      conclusionClassName,
    });

    return (
      <motion.div
        className={cn('prose prose-lg max-w-none', className)}
        variants={multilineParagraphStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={multilineTextInView}>
        {blocks.map((block, index) =>
          block.kind === 'heading' ? (
            <motion.h2
              key={`heading-${index}`}
              variants={multilineHeadingItem}
              className={cn(
                'text-2xl font-display font-bold text-foreground mb-4 mt-8 first:mt-0',
                headingClassName
              )}>
              {block.text}
            </motion.h2>
          ) : (
            <AnimatedParagraph
              key={`para-${index}`}
              text={block.text}
              className={block.className}
            />
          )
        )}
      </motion.div>
    );
  }

  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      {hasIntro && (
        <MultilineText
          text={content.introduction}
          className="mb-6"
          paragraphClassName={cn('text-lg text-foreground leading-relaxed', introductionClassName)}
        />
      )}

      {content.sections?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          {section.heading && (
            <h2
              className={cn(
                'text-2xl font-display font-bold text-foreground mb-4 mt-8',
                headingClassName
              )}>
              {section.heading}
            </h2>
          )}
          {section.paragraphs.map((paragraph, paraIndex) => (
            <MultilineText
              key={paraIndex}
              text={paragraph}
              className="mb-4"
              paragraphClassName={cn(
                'text-base text-foreground leading-relaxed',
                paragraphClassName
              )}
            />
          ))}
        </div>
      ))}

      {hasConclusion && (
        <MultilineText
          text={content.conclusion}
          className="mt-8"
          paragraphClassName={cn(
            'text-lg text-foreground leading-relaxed font-medium',
            conclusionClassName
          )}
        />
      )}
    </div>
  );
}
