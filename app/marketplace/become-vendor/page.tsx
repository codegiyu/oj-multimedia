import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Vendor',
  description: 'Register to become a vendor and start selling your products.',
};

export default function BecomeVendorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Become a Vendor</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Register to become a vendor and start selling your products on our marketplace.
      </p>
      {/* Vendor registration form will be added here */}
    </div>
  );
}
