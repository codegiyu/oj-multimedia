'use client';

import { motion } from 'motion/react';
import { HandHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionComp } from '@/components/general/SectionComp';
import { SubmitPrayerRequestForm } from './SubmitPrayerRequestForm';

export const SubmitPrayerRequestSection = () => {
  return (
    <SectionComp
      id="submit-prayer-request"
      icon={HandHeart}
      iconColor="primary"
      heading="Submit a Prayer Request"
      subtext="Share your prayer need with our community. We'll join you in prayer."
      contentProps={{ enableAnimation: false }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <SubmitPrayerRequestForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SectionComp>
  );
};
