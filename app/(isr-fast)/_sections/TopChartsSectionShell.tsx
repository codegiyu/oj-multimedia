import { ReactNode } from 'react';

interface TopChartsSectionShellProps {
  charts: ReactNode;
  artists: ReactNode;
}

export function TopChartsSectionShell({ charts, artists }: TopChartsSectionShellProps) {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {charts}
          {artists}
        </div>
      </div>
    </section>
  );
}
