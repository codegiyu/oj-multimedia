'use client';

import { Card, CardContent } from '@/components/ui/card';

export const PrivacyPolicyClient = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8 text-lg">
            Last Updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-8 md:p-12 grid gap-8">
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy explains how OHEJUIRA collects, uses, stores, and protects your
                information when you use our platform.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  1. Information We Collect
                </h2>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      A. Personal Information
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      When you create an account or use our services, we may collect:
                    </p>
                    <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Profile details</li>
                      <li>Vendor registration details</li>
                      <li>Uploaded content (songs, sermons, videos, etc.)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      B. Usage Information
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      We automatically collect:
                    </p>
                    <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                      <li>IP address</li>
                      <li>Device information</li>
                      <li>Browsing behavior</li>
                      <li>Pages visited</li>
                      <li>Downloads and submission history</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      C. Marketplace Information
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      For vendors and buyers:
                    </p>
                    <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                      <li>Product listings</li>
                      <li>Order details</li>
                      <li>Chat communication</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We use collected data for:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Managing your account</li>
                  <li>Displaying uploaded content</li>
                  <li>Processing promotions and submissions</li>
                  <li>Sending newsletters and devotional updates</li>
                  <li>Improving user experience</li>
                  <li>Facilitating vendor–buyer communication</li>
                  <li>Security and fraud prevention</li>
                  <li>Responding to requests or customer support</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Cookies & Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">We use cookies to:</p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Keep you logged in</li>
                  <li>Save your preferences</li>
                  <li>Personalize your experience</li>
                  <li>Monitor page traffic and usage statistics</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You may disable cookies from your browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  4. Sharing of Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do <strong>NOT</strong> sell {"users'"} personal information.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  However, we may share information with:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Marketplace vendors (when you chat or place orders)</li>
                  <li>Payment processors (Flutterwave/Paystack if connected)</li>
                  <li>Developers managing the platform</li>
                  <li>Legal authorities if required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  5. Vendors & Third Parties
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Vendor-by-vendor interactions are independent from OHEJUIRA.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We are not responsible for:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Vendor delivery</li>
                  <li>Vendor product quality</li>
                  <li>Scams from direct payments</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Users should verify sellers before making purchases.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We take reasonable measures to protect user data, including:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Encrypted passwords</li>
                  <li>Secure server configurations</li>
                  <li>Admin-level access control</li>
                  <li>Fraud monitoring</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, no online platform is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  7. {"Children's Privacy"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  This platform is not intended for children under 13. We do not knowingly collect
                  information from minors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">Users may request:</p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Account deletion</li>
                  <li>Removal of uploaded content</li>
                  <li>Correction of personal information</li>
                  <li>Unsubscribing from newsletters</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We retain data as long as necessary for:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Account activity</li>
                  <li>Legal compliance</li>
                  <li>Platform functionality</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You may request deletion at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this policy occasionally. Updates will be posted on this page with
                  the {'"Last Updated"'} date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  For privacy or data concerns:
                </p>
                <ul className="list-none grid gap-2 text-muted-foreground">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a
                      href="mailto:ohemultimedia@gmail.com"
                      className="text-primary hover:underline">
                      ohemultimedia@gmail.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +234 705 692 3436 / +234 913 667 0466 / +234 707 324
                    4801
                  </li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
