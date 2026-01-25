'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Video, Music, Palette, Code, Share2, Megaphone, Lightbulb } from 'lucide-react';
import { LucideIconComp } from '@/lib/types/general';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  Icon: LucideIconComp;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ Icon, title, description, index }: ServiceCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="w-14 h-14 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SERVICES = [
  {
    Icon: Video,
    title: 'Content Creation',
    description:
      'We develop original and custom content—from concept to scriptwriting—tailored to meet client needs.',
  },
  {
    Icon: Music,
    title: 'Production',
    description:
      'High quality filming, recording, editing, and post production for music, film, documentaries, commercials, and more.',
  },
  {
    Icon: Palette,
    title: 'Design',
    description:
      'Professional visual content: logos, graphics, animations, UI/UX designs, and digital artwork.',
  },
  {
    Icon: Code,
    title: 'Development',
    description: 'Website development, mobile app creation, and interactive digital experiences.',
  },
  {
    Icon: Share2,
    title: 'Distribution',
    description:
      'We distribute content across social media, streaming platforms, and traditional broadcast networks.',
  },
  {
    Icon: Megaphone,
    title: 'Marketing & Promotion',
    description:
      'Strategic promotional campaigns, ads, PR services, and digital marketing solutions.',
  },
  {
    Icon: Lightbulb,
    title: 'Consulting',
    description:
      'Expert advisory on multimedia strategies, creative technology, and content management.',
  },
];

export const ServicesSection = () => {
  return (
    <SectionContainer background="muted">
      <SectionHeading
        title="What We Do"
        text="OHEJUIRA Multimedia offers a wide range of services"
        Icon={Video}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.title} {...service} index={index} />
        ))}
      </div>
    </SectionContainer>
  );
};
