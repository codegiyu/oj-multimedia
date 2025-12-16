import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Store',
  description: 'Browse products from this vendor.',
};

export default function VendorStorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Vendor Store</h1>
      {/* Vendor store content will be added here */}
    </div>
  );
}
