'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Target, Heart, Lightbulb, Shield } from 'lucide-react';
import { LucideIconComp } from '@/lib/types/general';

interface ValueCardProps {
  Icon: LucideIconComp;
  title: string;
  description: string;
  index: number;
}

const ValueCard = ({ Icon, title, description, index }: ValueCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300">
      <div className="w-14 h-14 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const VALUES = [
  {
    Icon: Heart,
    title: 'Faith-Centered',
    description:
      'Everything we do is rooted in our Christian faith. We aim to spread the Gospel and strengthen believers through quality multimedia content.',
  },
  {
    Icon: Target,
    title: 'Community Focus',
    description:
      'We build a vibrant community of believers, connecting artists, pastors, and content creators to share their gifts and inspire others.',
  },
  {
    Icon: Lightbulb,
    title: 'Quality Content',
    description:
      'We curate and create high-quality gospel music, sermons, devotionals, and resources that inspire and transform lives.',
  },
  {
    Icon: Shield,
    title: 'Accessibility',
    description:
      'We make Christian content accessible to everyone, supporting both creators and consumers in their faith journey.',
  },
];

export const ValuesSection = () => {
  return (
    <SectionContainer>
      <SectionHeading
        title="Our Values"
        text="The principles that guide everything we do"
        Icon={Heart}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map((value, index) => (
          <ValueCard key={value.title} {...value} index={index} />
        ))}
      </div>
    </SectionContainer>
  );
};
