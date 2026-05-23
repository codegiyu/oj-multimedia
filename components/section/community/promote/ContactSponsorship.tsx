'use client';

import { motion } from 'motion/react';
import { Handshake, Mail, Phone, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import { getContactIcon } from '@/lib/utils/promotionIconMap';
import type { ContactMethod } from '@/lib/types/promotion';

export interface ContactSponsorshipProps {
  contactMethods: ContactMethod[];
  partnershipBenefits: string[];
  additionalContact?: string;
}

export const ContactSponsorship = ({
  contactMethods,
  partnershipBenefits,
  additionalContact,
}: ContactSponsorshipProps) => {
  const primaryEmail = contactMethods.find(m => m.action.startsWith('mailto:'));
  const primaryPhone = contactMethods.find(m => m.action.startsWith('tel:'));

  return (
    <SectionComp
      id="contact"
      icon={Handshake}
      iconColor="primary"
      heading="Contact for Sponsorship / Partnership"
      subtext="Interested in long-term partnerships or sponsorship opportunities? We offer custom solutions tailored to your brand and goals. Let's discuss how we can work together."
      sectionClassName="overflow-hidden"
      contentProps={{ enableAnimation: false }}>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}>
          <Card className="card-interactive">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
              <div className="space-y-4">
                {contactMethods.map(method => {
                  const Icon = getContactIcon(method.icon);
                  return (
                    <a
                      key={method._id}
                      href={method.action}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{method.method}</p>
                        <p className="text-base font-semibold text-foreground">{method.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
              {additionalContact && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Additional Contact:</p>
                  <p className="text-base font-semibold text-foreground">{additionalContact}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Partnership Benefits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}>
          <Card className="card-interactive bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Partnership Benefits</h3>
              <ul className="space-y-4">
                {partnershipBenefits.map((benefit, index) => (
                  <li key={`${benefit}-${index}`} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to discuss sponsorship opportunities? Contact us today to schedule a
                  consultation.
                </p>
                <Button variant="accent" className="w-full" asChild>
                  <a href="/contact">Visit Contact Page</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {"Let's Build Something Great Together"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {
                  "Whether you're looking for short-term promotions or long-term partnerships, we're here to help. Contact us today to discuss your specific needs and discover how we can help grow your audience."
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {primaryEmail && (
                  <Button variant="accent" size="lg" asChild>
                    <a href={primaryEmail.action}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                )}
                {primaryPhone && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(primaryPhone.action, '_self')}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </SectionComp>
  );
};
