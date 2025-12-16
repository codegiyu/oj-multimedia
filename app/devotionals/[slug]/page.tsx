import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devotional Details',
  description: 'Read devotional content and prayer points.',
};

export default function DevotionalDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Devotional Details</h1>
      {/* Devotional detail content will be added here */}
    </div>
  );
}
