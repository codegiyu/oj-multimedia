'use client';

import { MultilineText } from '@/components/general/MultilineText';
import { cn } from '@/lib/utils';
import { normalizeMultilineInput } from '@/lib/utils/multilineText';

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

export interface StructuredProseContentProps {
  content?: string | StructuredProseContentData | null;
  className?: string;
  introductionClassName?: string;
  paragraphClassName?: string;
  conclusionClassName?: string;
  headingClassName?: string;
}

export function StructuredProseContent({
  content,
  className,
  introductionClassName,
  paragraphClassName,
  conclusionClassName,
  headingClassName,
}: StructuredProseContentProps) {
  if (content == null) return null;

  if (typeof content === 'string') {
    if (!normalizeMultilineInput(content)) return null;

    return (
      <MultilineText
        text={content}
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
