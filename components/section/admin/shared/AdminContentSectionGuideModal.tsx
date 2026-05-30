'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ADMIN_CONTENT_SECTION_GUIDES,
  type AdminContentScope,
} from '@/lib/constants/adminContentSectionGuide';

export interface AdminContentSectionGuideModalProps {
  scope: AdminContentScope;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminContentSectionGuideModal({
  scope,
  open,
  onOpenChange,
}: AdminContentSectionGuideModalProps) {
  const guide = ADMIN_CONTENT_SECTION_GUIDES[scope];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
          <DialogDescription>{guide.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h3 className="font-medium text-foreground">Before an item goes live</h3>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              {guide.prerequisites.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="font-medium text-foreground">Public sections</h3>
            {guide.sections.map(section => (
              <article
                key={section.name}
                className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                <h4 className="font-medium text-foreground">{section.name}</h4>
                <dl className="space-y-1.5 text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground/80">Where: </dt>
                    <dd className="inline">{section.surfaces}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground/80">Qualifies when: </dt>
                    <dd className="inline">{section.qualification}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground/80">Order: </dt>
                    <dd className="inline">{section.sorting}</dd>
                  </div>
                </dl>
                <div>
                  <p className="font-medium text-foreground/80">What you control in admin</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                    {section.adminControls.map(control => (
                      <li key={control}>{control}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>

          {guide.notes.length > 0 ? (
            <section className="space-y-2">
              <h3 className="font-medium text-foreground">Good to know</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {guide.notes.map(note => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
