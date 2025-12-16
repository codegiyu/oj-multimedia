import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music Details',
  description: 'View music details, lyrics, and meaning.',
};

export default function MusicDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Music Details</h1>
      {/* Music detail content will be added here */}
    </div>
  );
}
