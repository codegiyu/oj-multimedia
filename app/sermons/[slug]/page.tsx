import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sermon Details',
  description: 'View sermon details and content.',
};

export default function SermonDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sermon Details</h1>
      {/* Sermon detail content will be added here */}
    </div>
  );
}
