'use client';

import { Card, CardContent } from '@/components/ui/card';

export const TermsConditionsClient = () => {
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
                Welcome to OHEJUIRA. By accessing or using this website, mobile site, or any of our
                services, you agree to these Terms & Conditions. Please read them carefully before
                using our platform.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By using our website or creating an account, you agree to comply with and be
                  legally bound by these Terms & Conditions. If you do not agree, please do not use
                  this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  2. Nature of the Platform
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  OHEJUIRA is a Christian-based multimedia platform offering:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Gospel music downloads</li>
                  <li>Inspirational Music downloads</li>
                  <li>Sermons (audio/video)</li>
                  <li>Devotionals</li>
                  <li>Gospel news and lifestyle content</li>
                  <li>Resources & free downloads</li>
                  <li>Promotional services for artists and ministers</li>
                  <li>Vendor marketplace for general products</li>
                  <li>Community features such as prayer requests, testimonies, polls, and more</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The platform is open to gospel artists, Inspirational Artists, pastors, creators,
                  and vendors who wish to share or promote their content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  3. User Responsibilities
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">Users agree to:</p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Provide accurate information during registration</li>
                  <li>Not upload harmful, defamatory, or illegal content</li>
                  <li>Not misuse downloads, music, or sermons</li>
                  <li>Respect Christian values and community rules</li>
                  <li>Not engage in fraud, spam, or impersonation</li>
                  <li>Use the platform only for lawful purposes</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to suspend or delete any account that violates these rules.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  4. Content Submission (Music, Sermons, Videos, etc.)
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  When you upload any content (song, sermon, video, or article), you confirm that:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>You own the rights or have permission to upload it</li>
                  <li>Your content does not infringe copyright, trademarks, or privacy</li>
                  <li>
                    You grant us permission to host, display, promote, or distribute it on the
                    platform
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Paid Promotions:</strong> Payments made for{' '}
                  {'"Promote Your Music/Sermon"'} or {'"Get Featured"'} are final and non-refundable
                  once service has started.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  5. Marketplace & Vendors
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  The marketplace allows vendors to sell general products (fashion, cosmetics, food,
                  etc.). Vendors agree that:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>They are fully responsible for the quality of items they list</li>
                  <li>They must provide accurate descriptions and pricing</li>
                  <li>They must deliver products as promised</li>
                  <li>Disputes between vendor and buyer must be resolved directly</li>
                  <li>OHEJUIRA is not responsible for failed deliveries or poor product quality</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Payments:</strong> Some vendors are paid directly (e.g., via WhatsApp or
                  bank transfer). OHEJUIRA is not liable for loss arising from direct vendor
                  payments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  6. Downloads & Use of Materials
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">Users may:</p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Download/Inspirational gospel songs</li>
                  <li>Download sermons</li>
                  <li>Access devotionals and resources</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4 mb-2">
                  However, users may NOT:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Resell or redistribute content commercially</li>
                  <li>Modify copyrighted materials</li>
                  <li>Upload pirated content</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  All content on this platform is for personal use only unless stated otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  7. Monetization & Upload Fees
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Certain services require payment:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Promote Your Song</li>
                  <li>Upload Your Sermon</li>
                  <li>Vendor Registration Fees</li>
                  <li>Featured Slots</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Exact pricing will be stated on the respective pages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  8. Newsletter & Communication
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  By subscribing to our newsletter, you agree to receive:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Daily devotionals</li>
                  <li>New music alerts</li>
                  <li>Sermon updates</li>
                  <li>Gospel news</li>
                  <li>Promotional or sponsored messages</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You may unsubscribe anytime.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Account Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We may suspend or terminate accounts that:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Violate the Terms</li>
                  <li>Abuse the platform</li>
                  <li>Post offensive or unchristian content</li>
                  <li>Engage in fraud or illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  We are not responsible for:
                </p>
                <ul className="list-disc list-inside grid gap-1 text-muted-foreground ml-4">
                  <li>Loss caused by vendor transactions</li>
                  <li>Errors in user-submitted content</li>
                  <li>Incorrect devotional or news information from third-party sources</li>
                  <li>Technical issues, downtimes, or data loss</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Users agree to use the platform at their own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Continued use of the platform means
                  you accept the updated version.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  For questions or concerns:
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
