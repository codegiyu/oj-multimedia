import { Handshake, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Button } from '@/components/ui/button';

const contactMethods = [
  {
    method: 'Email',
    value: 'ohemultimedia@gmail.com',
    icon: Mail,
    action: 'mailto:ohemultimedia@gmail.com',
  },
  {
    method: 'Phone',
    value: '+234 705 692 3436',
    icon: Phone,
    action: 'tel:+2347056923436',
  },
  {
    method: 'WhatsApp',
    value: '+234 913 667 0466',
    icon: MessageSquare,
    action: 'https://wa.me/2349136670466',
  },
];

const partnershipBenefits = [
  'Long-term sponsorship opportunities',
  'Custom advertising solutions',
  'Brand visibility across all platforms',
  'Dedicated account manager',
  'Performance tracking and reports',
  'Flexible pricing and payment options',
];

export const ContactSponsorship = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-secondary/20 via-background to-primary/10">
      <div className="regular-container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            Sponsorship & Partnerships
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Contact for Sponsorship / Partnership
          </h2>
          <p className="text-lg text-muted-foreground">
            Interested in long-term partnerships or sponsorship opportunities? We offer custom
            solutions tailored to your brand and goals. Let's discuss how we can work together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Methods */}
          <Card className="border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
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
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Additional Contact:</p>
                <p className="text-base font-semibold text-foreground">+234 707 324 4801</p>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Benefits */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Partnership Benefits</h3>
              <ul className="space-y-4">
                {partnershipBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
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
                <RegularBtn variant="cta" className="w-full" linkProps={{ href: '/contact' }}>
                  Visit Contact Page
                </RegularBtn>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Let's Build Something Great Together
              </h3>
              <p className="text-muted-foreground mb-6">
                Whether you're looking for short-term promotions or long-term partnerships, we're
                here to help. Contact us today to discuss your specific needs and discover how we
                can help grow your audience.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <RegularBtn
                  variant="cta"
                  size="lg"
                  linkProps={{ href: 'mailto:ohemultimedia@gmail.com' }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </RegularBtn>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    window.open('tel:+2347056923436', '_self');
                  }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
