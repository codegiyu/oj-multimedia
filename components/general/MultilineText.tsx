'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import {
  normalizeMultilineInput,
  splitIntoParagraphs,
  splitParagraphLines,
} from '@/lib/utils/multilineText';

interface MultilineTextProps {
  text?: string | null;
  className?: string;
  paragraphClassName?: string;
}

/**
 * Renders textarea-like content with paragraph and line-break support.
 * - Empty lines separate paragraphs
 * - Single newlines inside a paragraph become <br />
 */
export function MultilineText({ text, className, paragraphClassName }: MultilineTextProps) {
  const normalized = normalizeMultilineInput(text);

  if (!normalized) return null;

  const paragraphs = splitIntoParagraphs(text);

  return (
    <div className={cn('space-y-4', className)}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = splitParagraphLines(paragraph);
        return (
          <p key={paragraphIndex} className={paragraphClassName}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
