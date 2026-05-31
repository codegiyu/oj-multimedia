'use client';

import Link from 'next/link';
import { MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FixedImage } from '@/components/general/FillImage';
import { MultilineText } from '@/components/general/MultilineText';
import type { PastorDetail } from '@/lib/types/community';

export interface PastorPublicProfilePageClientProps {
  pastor: PastorDetail;
}

export function PastorPublicProfilePageClient({ pastor }: PastorPublicProfilePageClientProps) {
  return (
    <article className="min-h-screen">
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-6 -ml-2">
          <Link href="/community/ask-a-pastor">
            <ArrowLeft className="h-4 w-4" />
            Back to Ask a Pastor
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <FixedImage
            imageContext="public"
            src={pastor.image ?? ''}
            alt={pastor.name}
            width={128}
            height={128}
            className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
          />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-display font-bold">{pastor.name}</h1>
              {pastor.title ? <p className="text-muted-foreground">{pastor.title}</p> : null}
              {pastor.church ? (
                <p className="text-sm text-muted-foreground">{pastor.church}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {pastor.questionsAnswered ?? 0} questions answered
              </span>
              {(pastor.rating ?? 0) > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {Number(pastor.rating).toFixed(1)} rating
                </span>
              ) : null}
            </div>

            {pastor.expertise && pastor.expertise.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pastor.expertise.map(item => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : null}

            <Button asChild className="rounded-full">
              <Link href={`/community/ask-a-pastor?pastor=${pastor._id}#submit-question`}>
                Ask {pastor.name.split(' ')[0]} a question
              </Link>
            </Button>
          </div>
        </div>

        {pastor.bio ? (
          <div className="mt-10 prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <MultilineText text={pastor.bio} paragraphClassName="text-foreground leading-relaxed" />
          </div>
        ) : null}
      </section>
    </article>
  );
}
